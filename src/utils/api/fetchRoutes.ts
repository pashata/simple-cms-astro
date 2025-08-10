// src/lib/routes.ts
type ApiNav = {
    title?: string;
    name?: string;   // some APIs use "name"
    path?: string;   // e.g. "/about-us"
    slug?: string;   // e.g. "about-us" or ""
  };
  
  export type RouteItem = { title: string; path: string; slug: string };
  
  const apiUrl = import.meta.env.PUBLIC_USER_API_URL;   // e.g. http://starter.test/api/public
  const apiToken = import.meta.env.PUBLIC_API_TOKEN;
  
  if (!apiUrl || !apiToken) {
    throw new Error('Missing PUBLIC_USER_API_URL or PUBLIC_API_TOKEN env variables!');
  }
  
  function urlJoin(base: string, endpoint: string) {
    return `${base.replace(/\/+$/, '')}/${endpoint.replace(/^\/+/, '')}`;
  }
  
  // Single endpoint; website is derived from the token
  const buildRoutesEndpoint = () => `navigations`;
  
  async function get<T>(endpoint: string): Promise<T> {
    const url = urlJoin(apiUrl!, endpoint);
    let res: Response;
  
    try {
      res = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${apiToken}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      throw new Error(`[NETWORK] ${url} – ${msg}`);
    }
  
    // Read raw text first to improve error messages if JSON parsing fails
    const text = await res.text();
  
    if (!res.ok) {
      throw new Error(
        `[HTTP ${res.status}] ${url} – ${res.statusText}. Body: ${text.slice(0, 300)}`
      );
    }
  
    try {
      return JSON.parse(text) as T;
    } catch {
      throw new Error(
        `[PARSE] ${url} – expected JSON but got: ${text.slice(0, 300)}`
      );
    }
  }
  
  function normalizePath(path: string | undefined): string {
    if (!path) return '/';
    // ensure leading slash, collapse repeats, drop trailing slash (except root)
    const p = `/${path}`.replace(/\/+/g, '/');
    return p === '//' ? '/' : p.replace(/\/+$/, '') || '/';
  }
  
  function normalizeSlug(slug: string | undefined, path: string): string {
    if (slug != null && slug !== '') {
      return slug.replace(/^\/+/, ''); // no leading slash
    }
    // derive from path if missing
    return path.replace(/^\/+/, ''); // "" for root, "about-us", "blog/hello-world"
  }
  
  function toRouteItem(n: ApiNav): RouteItem {
    const title = (n.title ?? n.name ?? 'Untitled').toString();
    const path = normalizePath(n.path);
    const slug = normalizeSlug(n.slug, path);
    return { title, path, slug };
  }
  
  /** New canonical helpers (no website id needed) */
  export async function fetchRoutes(): Promise<RouteItem[]> {
    const endpoint = buildRoutesEndpoint();
    const json = await get<{ data: ApiNav[] }>(endpoint);
    const list = Array.isArray(json?.data) ? json.data : [];
    return list.map(toRouteItem);
  }
  
  export async function safeFetchRoutes(): Promise<RouteItem[]> {
    const endpoint = buildRoutesEndpoint();
    const url = urlJoin(apiUrl!, endpoint);
    try {
      const json = await get<{ data: ApiNav[] }>(endpoint);
      const list = Array.isArray(json?.data) ? json.data : [];
      return list.map(toRouteItem);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error(`[safeFetchRoutes] GET ${url} failed: ${msg}`);
      return [];
    }
  }