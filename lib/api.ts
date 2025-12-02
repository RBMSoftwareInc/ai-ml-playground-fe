export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '');
export const assetBaseUrl = (process.env.NEXT_PUBLIC_ASSET_BASE_URL || API_BASE_URL).replace(/\/$/, '');

const buildUrl = (path: string) => {
  if (!path) return API_BASE_URL;
  if (path.startsWith('http')) return path;
  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
};

export async function apiFetch<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  const url = buildUrl(path);
  const response = await fetch(url, options);

  if (!response.ok) {
    const errorBody = await response.text().catch(() => '');
    throw new Error(`API ${response.status}: ${response.statusText} ${errorBody}`);
  }

  const contentType = response.headers.get('content-type');
  if (contentType?.includes('application/json')) {
    return response.json() as Promise<T>;
  }

  return (response.text() as unknown) as T;
}

export async function postJson<T = any>(path: string, body: any, options: RequestInit = {}) {
  return apiFetch<T>(path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    body: JSON.stringify(body),
    ...options,
  });
}

