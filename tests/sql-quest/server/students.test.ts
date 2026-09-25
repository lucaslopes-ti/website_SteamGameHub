/** @jest-environment node */
import { NextRequest } from "next/server";
import { createFakeDb, type FakeDb } from "./fake-firestore";

const mockGetAuthUser = jest.fn();
jest.mock("@/lib/server-auth", () => ({
  getAuthUser: () => mockGetAuthUser(),
  requireAuth: jest.requireActual("@/lib/server-auth").requireAuth,
  requireStaff: jest.requireActual("@/lib/server-auth").requireStaff,
}));
const holder: { db: FakeDb | null } = { db: null };
const mockGetUsers = jest.fn();
jest.mock("@/lib/firebase/admin", () => ({
  getAdminDb: () => holder.db,
  getAdminAuth: () => ({ getUsers: (...args: unknown[]) => mockGetUsers(...args) }),
}));

import { GET } from "@/app/api/sql-quest/instructor/students/route";
import { listInstructorStudents } from "@/lib/sql-quest/server/students";

const staff = { uid: "staff", email: "staff@example.com", emailVerified: true, name: "Staff", role: "teacher", isAdmin: false, isTeacher: true, isStaff: true };

beforeEach(() => {
  process.env.FIREBASE_SERVICE_ACCOUNT_KEY = "test";
  mockGetAuthUser.mockReset();
  mockGetUsers.mockReset().mockImplementation(async (ids: { uid: string }[]) => ({
    users: ids.filter(({ uid }) => uid !== "missing-auth").map(({ uid }) => ({ uid, metadata: { lastSignInTime: uid === "a" ? "2026-01-02T00:00:00Z" : "" } })),
  }));
});
afterEach(() => delete process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

describe("GET instructor students", () => {
  it("rejects unauthenticated and non-staff users before database access", async () => {
    const db = createFakeDb();
    holder.db = db.db;
    mockGetAuthUser.mockResolvedValueOnce(null);
    expect((await GET(new NextRequest("http://localhost/api/sql-quest/instructor/students"))).status).toBe(401);
    mockGetAuthUser.mockResolvedValueOnce({ ...staff, isStaff: false, isTeacher: false, role: "student" });
    expect((await GET(new NextRequest("http://localhost/api/sql-quest/instructor/students"))).status).toBe(403);
    expect(mockGetUsers).not.toHaveBeenCalled();
  });

  it("lists valid completed progress irrespective of ranking opt-in, sorted and with nullable auth times", async () => {
    const { db, store } = createFakeDb();
    store.sql_quest_progress = {
      b: { completedLessonIds: ["1-1"], totalXp: 100, rankingOptIn: false },
      a: { completedLessonIds: ["1-1", "1-2"], totalXp: 100, displayName: "A" },
      "missing-auth": { completedLessonIds: ["1-1"], totalXp: 50 },
      empty: { completedLessonIds: [], totalXp: 999 },
      invalid: { completedLessonIds: ["bad"], totalXp: 999 },
    };
    const entries = await listInstructorStudents(db as unknown as Parameters<typeof listInstructorStudents>[0], { getUsers: mockGetUsers } as never);
    expect(entries.map(({ uid }) => uid)).toEqual(["a", "b", "missing-auth"]);
    expect(entries[0]).toMatchObject({ displayName: "A", xp: 100, lessonCount: 2, lastSignInAt: "2026-01-02T00:00:00Z" });
    expect(entries[2].lastSignInAt).toBeNull();
    expect(mockGetUsers).toHaveBeenCalledTimes(1);
  });

  it("returns the staff payload without caching and excludes empty progress", async () => {
    const { db, store } = createFakeDb();
    store.sql_quest_progress = {
      visible: { completedLessonIds: ["1-1"], totalXp: 25, rankingOptIn: false },
      empty: { completedLessonIds: [], totalXp: 500, rankingOptIn: false },
    };
    holder.db = db;
    mockGetAuthUser.mockResolvedValue(staff);

    const response = await GET(new NextRequest("http://localhost/api/sql-quest/instructor/students"));
    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("private, no-store");
    expect(await response.json()).toEqual({
      students: [{
        uid: "visible",
        displayName: null,
        xp: 25,
        level: expect.any(Number),
        lessonCount: 1,
        lastSignInAt: null,
      }],
    });
    expect(mockGetUsers).toHaveBeenCalledWith([{ uid: "visible" }]);
  });

  it("loads more than 1000 students in bounded Auth batches", async () => {
    const { db, store } = createFakeDb();
    const progress: Record<string, { completedLessonIds: string[]; totalXp: number }> = {};
    for (let index = 0; index < 1001; index += 1) {
      progress[`student-${String(index).padStart(4, "0")}`] = {
        completedLessonIds: ["1-1"],
        totalXp: index,
      };
    }
    store.sql_quest_progress = progress;
    const entries = await listInstructorStudents(
      db as unknown as Parameters<typeof listInstructorStudents>[0],
      { getUsers: mockGetUsers } as never
    );

    expect(entries).toHaveLength(1001);
    expect(mockGetUsers).toHaveBeenCalledTimes(2);
    const batchSizes = mockGetUsers.mock.calls.map(([batch]) => batch.length);
    expect(batchSizes).toEqual([1000, 1]);
    expect(batchSizes.every((size) => size <= 1000)).toBe(true);
    expect(new Set(entries.map(({ uid }) => uid)).size).toBe(1001);
  });

  it("fails closed when Firebase Auth lookup fails", async () => {
    const { db, store } = createFakeDb();
    store.sql_quest_progress = { a: { completedLessonIds: ["1-1"] } };
    mockGetAuthUser.mockResolvedValue(staff);
    mockGetUsers.mockRejectedValueOnce(new Error("auth unavailable"));
    holder.db = db;
    expect((await GET(new NextRequest("http://localhost/api/sql-quest/instructor/students"))).status).toBe(500);
  });
});
