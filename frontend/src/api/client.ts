const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080/api/v1";

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = localStorage.getItem("t4u_token");

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...options.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message ?? "Não foi possível concluir a operação.");
  }

  return response.json() as Promise<T>;
}