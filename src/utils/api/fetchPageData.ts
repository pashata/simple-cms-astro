const apiUrl = import.meta.env.PUBLIC_USER_API_URL;
const apiToken = import.meta.env.PUBLIC_API_TOKEN;

if (!apiUrl || !apiToken) {
	throw new Error('Missing PUBLIC_USER_API_URL or PUBLIC_API_TOKEN env variables!');
}

export async function fetchPageData(endpoint: string) {
	const url = `${apiUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

	try {
		const res = await fetch(url, {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${apiToken}`,
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}
		});

		if (!res.ok) {
			const body = await res.text().catch(() => 'No response body');
			throw new Error(
				`[${res.status}] Failed to fetch page data from ${url}: ${res.statusText}. Response: ${body}`
			);
		}

		const json = await res.json();
		return json.data;

	} catch (error: unknown) {
		// Network error or invalid JSON, etc.
		if (error instanceof Error) {
			throw new Error(`Network or fetch error while accessing ${url}: ${error.message}`);
		} else {
			throw new Error(`Unknown error while accessing ${url}`);
		}
	}
}

export async function safeFetchPageData<T = any>(endpoint: string): Promise<T | null> {
	try {
		return await fetchPageData(endpoint);
	} catch (err) {
		const message =
			err instanceof Error ? err.message : 'Unknown error';
		console.error(`[safeFetchPageData] ${endpoint} – ${message}`);
		return null;
	}
}