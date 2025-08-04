import { useAuthStore } from "~/stores/auth";

const controllers = new Map();

export function useApi() {
  const config = useRuntimeConfig();
  const authStore = useAuthStore();
  const apiBase = config.public.apiV1Endpoint;

  /**
   * apiFetch(path: string, queryParams?: object, options?: object)
   */
  async function apiFetch(path, queryParams = {}, options = {}) {
    const url = new URL(apiBase + path);

    // ✅ Conditionally include user_id and org_id
    if (queryParams.includeUserId !== false && authStore.user?.id) {
      url.searchParams.append("user_id", authStore.user.id);
    }

    if (
      queryParams.includeOrgId !== false &&
      authStore.currentOrganization?.id
    ) {
      url.searchParams.append(
        "organization_id",
        authStore.currentOrganization.id
      );
    }

    // ✅ Add any other query parameters
    for (const [key, value] of Object.entries(queryParams)) {
      if (
        value !== undefined &&
        key !== "includeUserId" &&
        key !== "includeOrgId"
      ) {
        url.searchParams.append(key, value);
      }
    }

    const key = options.key || path;

    // Abort previous request with same key
    if (controllers.has(key)) {
      controllers.get(key)?.abort();
    }

    const controller = new AbortController();
    controllers.set(key, controller);

    const headers = {
      "Content-Type": "application/json",
      ...(authStore.session?.access_token
        ? { Authorization: `Bearer ${authStore.session?.access_token}` }
        : {}),
      ...(options.headers || {}),
    };

    try {
      const response = await fetch(url.toString(), {
        ...options,
        headers,
        signal: controller.signal,
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "API request failed");
      }

      return await response.json();
    } catch (err) {
      if (err.name === "AbortError") {
        console.warn(`Fetch aborted for ${key}`);
      } else {
        console.error(`API fetch error for ${key}:`, err);
      }
      throw err;
    } finally {
      controllers.delete(key);
    }
  }

  return { apiFetch };
}
