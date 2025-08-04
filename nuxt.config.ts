// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  ssr: true,
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  modules: [
    "@pinia/nuxt",
    "pinia-plugin-persistedstate/nuxt",
    "vuetify-nuxt-module",
    "@nuxtjs/supabase",
    "nuxt-tiptap-editor",
  ],
  tiptap: {
    prefix: "Tiptap",
  },
  nitro: {
    routeRules: {
      "/ohif/**": { static: true },
    },
  },
  supabase: {
    redirectOptions: {
      login: "/auth/login",
      callback: "/confirm",
      include: undefined,
      exclude: ["/auth/*", "/ohif/*"],
      saveRedirectToCookie: false,
    },
  },
  vuetify: {
    moduleOptions: {},
    vuetifyOptions: {
      theme: {
        defaultTheme: "light",
        themes: {
          light: {
            colors: {
              primary: "#024230",
              secondary: "#aed027",
            },
          },
          dark: {
            colors: {
              primary: "#4cd1ac",
            },
          },
        },
      },
    },
  },
  runtimeConfig: {
    public: {
      supabaseUrl: "",
      supabaseKey: "",
      apiV1Endpoint: "",
      apiV1Base: "",
    },
  },
});
