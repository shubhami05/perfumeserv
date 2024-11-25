import { useAuth } from "@clerk/nextjs";

export async function authFetch(url: string, options: RequestInit = {}) {
  // const { getToken } = useAuth();
  // const token = await getToken();

  const headers = {
    ...options.headers,
    // Authorization: `Bearer ${token}`,
  };

  return fetch(url, { ...options, headers });
}