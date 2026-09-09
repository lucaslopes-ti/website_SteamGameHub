/**
 * Testes de turmas da SQL Quest — códigos e autorização.
 *
 * @jest-environment node
 */
import {
  CLASS_CODE_ALPHABET,
  CLASS_CODE_LENGTH,
  canViewClass,
  generateClassCode,
  isInstructorOfClass,
  isMemberOfClass,
  isValidClassCode,
  normalizeClassCode,
} from "@/lib/sql-quest/domain/classes";

describe("generateClassCode", () => {
  it("gera códigos com o tamanho e alfabeto corretos", () => {
    for (let i = 0; i < 50; i++) {
      const code = generateClassCode();
      expect(code).toHaveLength(CLASS_CODE_LENGTH);
      for (const ch of code) {
        expect(CLASS_CODE_ALPHABET).toContain(ch);
      }
    }
  });

  it("gera códigos variados", () => {
    const codes = new Set(Array.from({ length: 20 }, () => generateClassCode()));
    expect(codes.size).toBeGreaterThan(1);
  });
});

describe("isValidClassCode / normalizeClassCode", () => {
  it("aceita código válido", () => {
    expect(isValidClassCode("ABC234")).toBe(true);
  });

  it("normaliza minúsculas e espaços", () => {
    expect(normalizeClassCode("  abc234 ")).toBe("ABC234");
    expect(isValidClassCode("abc234")).toBe(true);
  });

  it("rejeita tamanho errado", () => {
    expect(isValidClassCode("ABC23")).toBe(false);
    expect(isValidClassCode("ABC2345")).toBe(false);
  });

  it("rejeita caracteres ambíguos/fora do alfabeto", () => {
    expect(isValidClassCode("ABC23O")).toBe(false); // O
    expect(isValidClassCode("ABC23I")).toBe(false); // I
    expect(isValidClassCode("ABC23L")).toBe(false); // L
    expect(isValidClassCode("ABC23!")).toBe(false);
  });
});

describe("autorização de turma", () => {
  const classDoc = {
    instructorUids: ["u-teacher"],
    memberUids: ["u-student"],
  };

  it("instrutor reconhece o dono da turma", () => {
    expect(
      isInstructorOfClass({ uid: "u-teacher", isStaff: false }, classDoc)
    ).toBe(true);
  });

  it("staff global é instrutor de qualquer turma", () => {
    expect(
      isInstructorOfClass({ uid: "u-admin", isStaff: true }, classDoc)
    ).toBe(true);
  });

  it("aluno comum não é instrutor", () => {
    expect(
      isInstructorOfClass({ uid: "u-student", isStaff: false }, classDoc)
    ).toBe(false);
  });

  it("membro reconhece aluno da turma", () => {
    expect(isMemberOfClass("u-student", classDoc)).toBe(true);
    expect(isMemberOfClass("u-outsider", classDoc)).toBe(false);
  });

  it("canViewClass libera instrutor e membro, bloqueia estranho", () => {
    expect(canViewClass({ uid: "u-teacher", isStaff: false }, classDoc)).toBe(true);
    expect(canViewClass({ uid: "u-student", isStaff: false }, classDoc)).toBe(true);
    expect(canViewClass({ uid: "u-outsider", isStaff: false }, classDoc)).toBe(false);
  });
});