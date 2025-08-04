import { useAuthStore } from "~/stores/auth";

export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore();

  const publicRoutePrefixes = ["/auth", "/ohif"];

  const isPublic = publicRoutePrefixes.some((prefix) =>
    to.path.startsWith(prefix)
  );

  if (isPublic) {
    return;
  }

  if (!authStore.isAuthenticated && !authStore.user) {
    await authStore.initializeFromSupabase();
  }

  // If already authenticated and trying to access login, redirect to home
  if (to.path === "/auth/login" && authStore.isAuthenticated) {
    if (to.path !== "/") {
      return navigateTo("/");
    }
    return;
  }

  // If not authenticated, redirect to login (but only if not already there)
  if (!authStore.isAuthenticated) {
    if (to.path !== "/auth/login") {
      return navigateTo("/auth/login");
    }
    return;
  }

  const role = authStore.user?.role;
  const roleBasedRoutes = {
    radiologist: ["/orders", "/reports", "/settings", "/viewer"],
    doctor: ["/reports", "/settings", "/viewer"],
    technician: [
      "/studies",
      "/study-info",
      "/upload",
      "/orders",
      "/reports",
      "/settings",
      "/viewer",
      "/shared",
    ],
    admin: ["/users", "/logs"],
  };

  if (!roleBasedRoutes[role]) {
    console.warn("Unknown role or no permissions configured:", role);
  }

  const allowedPaths = roleBasedRoutes[role] || [];
  const isAllowed = allowedPaths.some((path) => to.path.startsWith(path));

  // Only redirect to home if not already there and not allowed
  if (!isAllowed && to.path !== "/") {
    return navigateTo("/");
  }
  // If allowed, just return nothing to continue navigation
});
