/**
 * Fake Firestore para testes das API routes da SQL Quest.
 *
 * Suporta o subconjunto usado pelas rotas: collection().doc(id).get/set/update,
 * collection().doc() (auto-id), collection().add, collection().where(...).get,
 * db.getAll(...refs) e db.runTransaction(fn).
 */

export type Store = Record<string, Record<string, Record<string, unknown>>>;

interface FakeRef {
  id: string;
  __collection: string;
  get: () => Promise<{ exists: boolean; data: () => Record<string, unknown> | null }>;
  set: (data: unknown, opts?: { merge?: boolean }) => Promise<void>;
  update: (data: Record<string, unknown>) => Promise<void>;
  delete: () => Promise<void>;
}

export function createFakeDb(initial?: Store) {
  const store: Store = initial ?? {};
  let autoIdCounter = 0;

  const makeRef = (collectionName: string, id: string): FakeRef => ({
    id,
    __collection: collectionName,
    get: async () => ({
      exists: Boolean(store[collectionName]?.[id]),
      data: () => store[collectionName]?.[id] ?? null,
    }),
    set: async (data, opts) => {
      store[collectionName] = store[collectionName] ?? {};
      const record = data as Record<string, unknown>;
      if (opts?.merge) {
        store[collectionName][id] = { ...(store[collectionName][id] ?? {}), ...record };
      } else {
        store[collectionName][id] = record;
      }
    },
    update: async (data) => {
      store[collectionName] = store[collectionName] ?? {};
      store[collectionName][id] = { ...(store[collectionName][id] ?? {}), ...data };
    },
    delete: async () => {
      delete store[collectionName]?.[id];
    },
  });

  const collection = (name: string) => ({
    doc: (id?: string) => {
      if (id) return makeRef(name, id);
      autoIdCounter += 1;
      return makeRef(name, `auto-${autoIdCounter}`);
    },
    add: async (data: unknown) => {
      autoIdCounter += 1;
      const id = `auto-${autoIdCounter}`;
      store[name] = store[name] ?? {};
      store[name][id] = data as Record<string, unknown>;
      return { id };
    },
    where: (field: string, op: string, value: unknown) => {
      const query = {
        limit: () => query,
        get: async () => {
          const docs = Object.entries(store[name] ?? {})
            .filter(([, data]) => {
              const actual = (data as Record<string, unknown>)[field];
              if (op === "==") return actual === value;
              if (op === "array-contains") {
                return Array.isArray(actual) && actual.includes(value);
              }
              if (op === "in") {
                return Array.isArray(value) && value.includes(actual);
              }
              return false;
            })
            .map(([id, data]) => ({
              id,
              exists: true,
              data: () => data,
            }));
          return { docs, empty: docs.length === 0, size: docs.length };
        },
      };
      return query;
    },
  });

  const db = {
    collection,
    getAll: async (...refs: FakeRef[]) =>
      refs.map((ref) => ({
        exists: Boolean(store[ref.__collection]?.[ref.id]),
        data: () => store[ref.__collection]?.[ref.id] ?? null,
      })),
    runTransaction: async (fn: (tx: unknown) => Promise<void>) => {
      const tx = {
        get: async (ref: FakeRef) => ({
          exists: Boolean(store[ref.__collection]?.[ref.id]),
          data: () => store[ref.__collection]?.[ref.id] ?? null,
        }),
        set: async (ref: FakeRef, data: unknown, opts?: { merge?: boolean }) => {
          store[ref.__collection] = store[ref.__collection] ?? {};
          const record = data as Record<string, unknown>;
          if (opts?.merge) {
            store[ref.__collection][ref.id] = {
              ...(store[ref.__collection][ref.id] ?? {}),
              ...record,
            };
          } else {
            store[ref.__collection][ref.id] = record;
          }
        },
      };
      await fn(tx);
    },
  };

  return { db, store };
}

export type FakeDb = ReturnType<typeof createFakeDb>["db"];