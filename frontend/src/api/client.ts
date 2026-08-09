const API_URL =
  import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api/v1'

export async function apiFetch<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      Accept: 'application/json',
      ...options?.headers,
    },
  })

  if (!response.ok) {
    throw new Error('Não foi possível carregar os dados.')
  }

  return response.json() as Promise<T>
}