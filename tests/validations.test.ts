/**
 * Testes de validação de URLs e arrays.
 *
 * @jest-environment node
 */
import {
  isValidDownloadUrl,
  isValidVideoUrl,
  isValidImageUrl,
  validateGameArrays,
  validateScreenshots,
  sanitizeStringArray,
} from "@/lib/validations";

describe("isValidDownloadUrl", () => {
  it("aceita domínio exato permitido", () => {
    expect(isValidDownloadUrl("https://drive.google.com/file/d/abc")).toBe(true);
    expect(isValidDownloadUrl("https://mega.nz/file/xyz")).toBe(true);
  });

  it("aceita subdomínio filho do domínio permitido", () => {
    expect(isValidDownloadUrl("https://www.drive.google.com/file")).toBe(true);
    expect(isValidDownloadUrl("https://www.dropbox.com/s/abc")).toBe(true);
  });

  it("rejeita hostname que apenas CONTÉM o domínio (nunca includes)", () => {
    // `notdrive.google.com` contém `drive.google.com` mas não é filho.
    expect(isValidDownloadUrl("https://notdrive.google.com/file")).toBe(false);
    // `drive.google.com.evil.com` contém o domínio mas é outro host.
    expect(isValidDownloadUrl("https://drive.google.com.evil.com/file")).toBe(false);
    expect(isValidDownloadUrl("https://evil-drive.google.com.evil.com")).toBe(false);
  });

  it("rejeita protocolo não-http(s)", () => {
    expect(isValidDownloadUrl("javascript:alert(1)")).toBe(false);
    expect(isValidDownloadUrl("ftp://drive.google.com/file")).toBe(false);
  });

  it("rejeita URL inválida", () => {
    expect(isValidDownloadUrl("não é uma url")).toBe(false);
    expect(isValidDownloadUrl("")).toBe(false);
  });
});

describe("isValidVideoUrl", () => {
  it("aceita YouTube, youtu.be e Vimeo exatos", () => {
    expect(isValidVideoUrl("https://www.youtube.com/watch?v=abc")).toBe(true);
    expect(isValidVideoUrl("https://youtu.be/abc")).toBe(true);
    expect(isValidVideoUrl("https://vimeo.com/123")).toBe(true);
  });

  it("rejeita hostname que apenas CONTÉM o domínio", () => {
    expect(isValidVideoUrl("https://notyoutube.com/watch?v=abc")).toBe(false);
    expect(isValidVideoUrl("https://youtube.com.evil.com/watch")).toBe(false);
  });
});

describe("isValidImageUrl", () => {
  it("aceita http(s) e caminho local relativo", () => {
    expect(isValidImageUrl("https://example.com/img.png")).toBe(true);
    expect(isValidImageUrl("/uploads/games/abc.png")).toBe(true);
  });

  it("rejeita protocolo perigoso e protocolo-relativo", () => {
    expect(isValidImageUrl("javascript:alert(1)")).toBe(false);
    expect(isValidImageUrl("//evil.com/x.png")).toBe(false);
    expect(isValidImageUrl("data:text/html,<script>")).toBe(false);
  });
});

describe("validateGameArrays", () => {
  it("rejeita elementos não-string", () => {
    expect(validateGameArrays(["Ação", 123 as any], ["Unity"]).valid).toBe(false);
  });

  it("rejeita elementos vazios após sanitização", () => {
    expect(validateGameArrays(["Ação", "   "], ["Unity"]).valid).toBe(false);
  });

  it("aceita arrays válidos", () => {
    expect(validateGameArrays(["Ação", "RPG"], ["Unity", "C#"]).valid).toBe(true);
  });
});

describe("sanitizeStringArray", () => {
  it("filtra não-strings, vazios e limita tamanho", () => {
    const result = sanitizeStringArray(["Ação", 123, "  ", "RPG"], 10, 50);
    expect(result).toEqual(["Ação", "RPG"]);
  });
});

describe("validateScreenshots", () => {
  it("aceita até 5 URLs válidas", () => {
    expect(validateScreenshots(["https://a.com/1.png", "/uploads/2.png"]).valid).toBe(true);
  });

  it("rejeita mais de 5", () => {
    const many = Array.from({ length: 6 }, (_, i) => `https://a.com/${i}.png`);
    expect(validateScreenshots(many).valid).toBe(false);
  });

  it("rejeita URL inválida", () => {
    expect(validateScreenshots(["javascript:alert(1)"]).valid).toBe(false);
  });
});
