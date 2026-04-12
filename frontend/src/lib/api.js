const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Saját apiRequest fetch-alapú segédfüggvény
 */
export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  };

  const response = await fetch(url, defaultOptions);

  let data = null;
  const contentType = response.headers.get("content-type");
  
  if (contentType && contentType.includes("application/json")) {
    data = await response.json();
  }

  if (!response.ok) {
    console.error("Szerver hiba:", data);
    throw new Error(data?.error || `Hiba történt: ${response.status}`);
  }

  return data;
}

// Ha véletlenül valahol sima default importként hivatkoznál rá:
export default apiRequest;