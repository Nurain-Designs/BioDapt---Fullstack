// src/lib/api.ts

/**
 * Simple wrapper around the browser fetch API for the BioDapt project.
 * All endpoints are relative (e.g. "/api/materials") so Vite's dev proxy
 * forwards them to the Express backend at http://localhost:5000.
 */

export async function get<T>(path: string): Promise<T> {
  const res = await fetch(path);
  if (!res.ok) {
    throw new Error(`GET ${path} failed with status ${res.status}`);
  }
  return (await res.json()) as T;
}

export async function post<T, B = any>(path: string, body: B): Promise<T> {
  const res = await fetch(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`POST ${path} failed with status ${res.status}`);
  }
  return (await res.json()) as T;
}
