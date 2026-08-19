/**
 * Utilitários de validação centralizados
 */

/**
 * Valida formato de email
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Valida URL com protocolo http/https.
 */
export function isValidUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  try {
    const urlObj = new URL(url.trim());
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Valida URL de imagem: aceita http/https ou caminho relativo local
 * (ex.: `/uploads/games/...`). Nunca aceita `javascript:`, `data:` etc.
 */
export function isValidImageUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
    return trimmed.length > 1;
  }
  return isValidUrl(trimmed);
}

/**
 * Compara hostname com domínio permitido de forma EXATA ou de subdomínio
 * filho. Nunca usa `includes` (evita `drive.google.com.evil.com` e
 * `notdrive.google.com`).
 */
function isAllowedHostname(hostname: string, allowedDomains: string[]): boolean {
  const host = hostname.toLowerCase().replace(/\.$/, '');
  return allowedDomains.some((domain) => {
    const d = domain.toLowerCase().replace(/\.$/, '');
    return host === d || host.endsWith(`.${d}`);
  });
}

/**
 * Valida se a URL é de um serviço permitido (Google Drive, OneDrive, etc).
 * O hostname deve ser exatamente o domínio permitido ou um subdomínio filho.
 */
export function isValidDownloadUrl(url: string): boolean {
  if (!isValidUrl(url)) return false;
  const allowedDomains = [
    'drive.google.com',
    'onedrive.live.com',
    'dropbox.com',
    'mega.nz',
    'github.com',
    'gitlab.com',
  ];
  try {
    const urlObj = new URL(url.trim());
    return isAllowedHostname(urlObj.hostname, allowedDomains);
  } catch {
    return false;
  }
}

/**
 * Valida se a URL é de um serviço de vídeo permitido (YouTube, Vimeo).
 * O hostname deve ser exatamente o domínio permitido ou um subdomínio filho.
 */
export function isValidVideoUrl(url: string): boolean {
  if (!isValidUrl(url)) return false;
  const allowedDomains = [
    'youtube.com',
    'youtu.be',
    'vimeo.com',
  ];
  try {
    const urlObj = new URL(url.trim());
    return isAllowedHostname(urlObj.hostname, allowedDomains);
  } catch {
    return false;
  }
}

/**
 * Sanitiza texto removendo caracteres perigosos e limitando tamanho
 */
export function sanitizeText(text: string, maxLength?: number): string {
  if (!text || typeof text !== 'string') return '';
  let sanitized = text.trim();
  
  // Remover caracteres de controle (exceto quebras de linha)
  sanitized = sanitized.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '');
  
  // Limitar tamanho se especificado
  if (maxLength && sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }
  
  return sanitized;
}

/**
 * Valida título do jogo
 */
export function validateGameTitle(title: string): { valid: boolean; error?: string } {
  if (!title || typeof title !== 'string') {
    return { valid: false, error: 'Título é obrigatório' };
  }
  
  const sanitized = sanitizeText(title);
  
  if (sanitized.length < 3) {
    return { valid: false, error: 'Título deve ter pelo menos 3 caracteres' };
  }
  
  if (sanitized.length > 100) {
    return { valid: false, error: 'Título deve ter no máximo 100 caracteres' };
  }
  
  return { valid: true };
}

/**
 * Valida descrição do jogo
 */
export function validateGameDescription(description: string): { valid: boolean; error?: string } {
  if (!description || typeof description !== 'string') {
    return { valid: false, error: 'Descrição é obrigatória' };
  }
  
  const sanitized = sanitizeText(description);
  
  if (sanitized.length < 10) {
    return { valid: false, error: 'Descrição deve ter pelo menos 10 caracteres' };
  }
  
  if (sanitized.length > 2000) {
    return { valid: false, error: 'Descrição deve ter no máximo 2000 caracteres' };
  }
  
  return { valid: true };
}

/**
 * Valida nome do autor
 */
export function validateAuthorName(name: string): { valid: boolean; error?: string } {
  if (!name || typeof name !== 'string') {
    return { valid: false, error: 'Nome do autor é obrigatório' };
  }
  
  const sanitized = sanitizeText(name);
  
  if (sanitized.length < 2) {
    return { valid: false, error: 'Nome deve ter pelo menos 2 caracteres' };
  }
  
  if (sanitized.length > 100) {
    return { valid: false, error: 'Nome deve ter no máximo 100 caracteres' };
  }
  
  return { valid: true };
}

/**
 * Valida arrays de gêneros e tecnologias.
 * Cada elemento deve ser uma string não-vazia (após sanitização).
 */
export function validateGameArrays(
  genres: string[],
  technologies: string[]
): { valid: boolean; error?: string } {
  if (!Array.isArray(genres) || genres.length === 0) {
    return { valid: false, error: 'Selecione pelo menos um gênero' };
  }

  if (genres.length > 10) {
    return { valid: false, error: 'Máximo de 10 gêneros permitidos' };
  }

  if (!Array.isArray(technologies) || technologies.length === 0) {
    return { valid: false, error: 'Selecione pelo menos uma tecnologia' };
  }

  if (technologies.length > 10) {
    return { valid: false, error: 'Máximo de 10 tecnologias permitidas' };
  }

  if (!genres.every((g) => typeof g === 'string' && sanitizeText(g).length > 0)) {
    return { valid: false, error: 'Gêneros inválidos' };
  }

  if (!technologies.every((t) => typeof t === 'string' && sanitizeText(t).length > 0)) {
    return { valid: false, error: 'Tecnologias inválidas' };
  }

  return { valid: true };
}

/**
 * Valida uma propriedade de array editável que ESTÁ presente no PATCH.
 *
 * A propriedade deve ser um array de itens válidos. Rejeita explicitamente
 * `null`, string, objeto ou arrays inválidos — NUNCA normaliza entradas
 * inválidas para `[]`. Ausência da propriedade (não chamar esta função)
 * preserva o valor atual.
 */
export function validatePresentArray(
  value: unknown,
  options: {
    maxItems: number;
    maxItemLength: number;
    itemValidator?: (item: string) => boolean;
    error: string;
  }
): { valid: boolean; error?: string } {
  if (!Array.isArray(value)) {
    return { valid: false, error: options.error };
  }
  if (value.length > options.maxItems) {
    return {
      valid: false,
      error: `Máximo de ${options.maxItems} itens permitidos`,
    };
  }
  const itemsValid = value.every((item) => {
    if (typeof item !== "string") return false;
    const sanitized = sanitizeText(item, options.maxItemLength);
    if (sanitized.length === 0) return false;
    if (options.itemValidator && !options.itemValidator(item)) return false;
    return true;
  });
  if (!itemsValid) return { valid: false, error: options.error };
  return { valid: true };
}

/**
 * Sanitiza um array de strings, removendo entradas vazias e limitando o
 * tamanho de cada elemento.
 */
export function sanitizeStringArray(
  values: unknown,
  maxItems: number,
  maxItemLength: number
): string[] {
  if (!Array.isArray(values)) return [];
  return values
    .filter((item): item is string => typeof item === 'string')
    .map((item) => sanitizeText(item, maxItemLength))
    .filter((item) => item.length > 0)
    .slice(0, maxItems);
}

/**
 * Valida array de screenshots: máximo 5 URLs de imagem válidas.
 */
export function validateScreenshots(
  screenshots: unknown
): { valid: boolean; error?: string } {
  if (screenshots === undefined || screenshots === null) return { valid: true };
  if (!Array.isArray(screenshots)) {
    return { valid: false, error: 'Screenshots deve ser uma lista de URLs' };
  }
  if (screenshots.length > 5) {
    return { valid: false, error: 'Máximo de 5 screenshots permitidos' };
  }
  if (!screenshots.every((url) => typeof url === 'string' && isValidImageUrl(url))) {
    return { valid: false, error: 'Screenshot inválido. Use uma URL http(s) ou caminho local.' };
  }
  return { valid: true };
}

