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
 * Valida URL
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
 * Valida se a URL é de um serviço permitido (Google Drive, OneDrive, etc)
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
    return allowedDomains.some(domain => urlObj.hostname.includes(domain));
  } catch {
    return false;
  }
}

/**
 * Valida se a URL é de um serviço de vídeo permitido (YouTube, Vimeo)
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
    return allowedDomains.some(domain => urlObj.hostname.includes(domain));
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
 * Valida arrays de gêneros e tecnologias
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
  
  return { valid: true };
}

