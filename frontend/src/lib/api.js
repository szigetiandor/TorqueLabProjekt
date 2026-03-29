const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Saját apiRequest fetch-alapú segédfüggvény
 */
export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Alapértelmezett beállítások (pl. sütik küldése)
  const defaultOptions = {
    credentials: 'include', // Fontos a JWT sütik miatt!
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  };

  const response = await fetch(url, defaultOptions);

  // Ha a válasz nem üres, megpróbáljuk parzolni a JSON-t
  let data = null;
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    data = await response.json();
  }

  if (!response.ok) {
    throw new Error(data?.error || `Hiba történt: ${response.status}`);
  }

  return data;
}

// Ha véletlenül valahol sima default importként hivatkoznál rá:
export default apiRequest;