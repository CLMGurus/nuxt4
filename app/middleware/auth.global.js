export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore();

  if (!authStore.isAuthenticated && !authStore.user) {
    await authStore.initializeFromSupabase();
  }

  if (to.path === "/login" && authStore.isAuthenticated) {
    return navigateTo("/");
  }

  const publicRoutePrefixes = [
    "/login",
    "/reset-password",
    "/update-password",
    "/ohif",
  ];
  const isPublic = publicRoutePrefixes.some((prefix) =>
    to.path.startsWith(prefix)
  );
  if (isPublic) return;

  if (!authStore.isAuthenticated) {
    return navigateTo("/login");
  }

  // Role-based access control (optional)
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

  const allowedPaths = roleBasedRoutes[role] || [];
  const isAllowed = allowedPaths.some((path) => to.path.startsWith(path));
  if (!isAllowed && to.path !== "/") {
    return navigateTo("/");
  }
});
