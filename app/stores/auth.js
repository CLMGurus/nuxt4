import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    session: null,
    isAuthenticated: false,
    isLoading: false,
    currentOrganization: null,
    personalOrganization: null,
    organizations: null,
  }),

  persist: {
    storage: piniaPluginPersistedstate.localStorage(),
    pick: [
      "user",
      "isAuthenticated",
      "currentOrganization",
      "personalOrganization",
      "organizations",
    ],
  },

  getters: {
    role: (state) => state.user?.role || null,
    email: (state) => state.user?.email || null,
  },

  actions: {
    async signIn(email, password) {
      this.isLoading = true;
      try {
        const supabase = useSupabaseClient();
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        const { session, user } = data;
        this.session = session;

        const profileResult = await this.fetchUserProfile(user);
        if (!profileResult.success) {
          throw new Error(profileResult.error);
        }

        await this.syncWithBackend();
        return { success: true };
      } catch (error) {
        console.error("Sign in failed:", error);
        return {
          success: false,
          error: error.message || "Authentication failed",
        };
      } finally {
        this.isLoading = false;
      }
    },

    async sendResetLink(email) {
      const supabase = useSupabaseClient();
      const url = useRequestURL();

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${url.href}/update-password`,
      });

      if (error) {
        console.error("Error sending reset email:", error.message);
        return { success: false, message: error.message };
      } else {
        return {
          success: true,
          message: "Password reset link sent to your email.",
        };
      }
    },

    async signOut() {
      try {
        const supabase = useSupabaseClient();
        await supabase.auth.signOut();
      } finally {
        this.user = null;
        this.session = null;
        this.isAuthenticated = null;
        this.currentOrganization = null;
        this.organizations = null;
        this.personalOrganization = null;
        await navigateTo("/login");
      }
    },

    async fetchUserProfile(user) {
      try {
        const supabase = useSupabaseClient();
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) throw error;

        this.user = {
          id: user.id,
          fullName: profile.full_name,
          email: user.email || "",
          role: profile.role,
        };

        this.isAuthenticated = true;
        return { success: true };
      } catch (error) {
        console.error("Fetch profile error:", error);
        return {
          success: false,
          error: error.message || "Failed to fetch profile",
        };
      }
    },

    async syncWithBackend() {
      if (!this.session || !this.user) return;

      try {
        const config = useRuntimeConfig();
        const token = this.session.access_token;

        const response = await $fetch(
          `${config.public.apiV1Endpoint}/sync-user`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: {
              user_id: this.user.id,
              name: this.user.fullName,
              email: this.user.email,
              role: this.user.role,
            },
          }
        );

        if (response?.user) {
          this.user = {
            id: response.user.user_id,
            fullName: response.user.name,
            email: response.user.email,
            role: response.user.role,
          };
          this.personalOrganization = response.user.personal_organization;
          this.organizations = response.user.organizations;
          this.selectCurrentOrganization(response.user.personal_organization);
        }

        console.log("Synced user:", this.user);
      } catch (error) {
        console.error("Backend sync failed:", error);
      }
    },

    selectCurrentOrganization(organization) {
      this.currentOrganization = organization;
    },

    // Optionally keep session updated after page refresh
    async initializeFromSupabase() {
      const supabaseUser = useSupabaseUser();
      const supabaseSession = useSupabaseSession();

      const user = supabaseUser.value;
      const session = supabaseSession.value;

      if (user && session) {
        this.session = session;
        const result = await this.fetchUserProfile(user);
        if (result.success) {
          this.isAuthenticated = true;
        }
      }
    },
  },
});
