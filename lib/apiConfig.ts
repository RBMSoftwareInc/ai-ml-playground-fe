/**
 * Centralized API configuration
 * Use this instead of hardcoded localhost URLs
 */

export const getApiBaseUrl = (): string => {
  return (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '');
};

export const buildApiUrl = (path: string): string => {
  const baseUrl = getApiBaseUrl();
  if (path.startsWith('http')) return path;
  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
};

