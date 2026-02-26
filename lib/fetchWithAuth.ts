export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const res = await fetch(url, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const text = await res.text(); // first read as text
  try {
    return JSON.parse(text); // try parse JSON
  } catch {
    throw new Error("Invalid JSON response: " + text); // helpful debug
  }
}
