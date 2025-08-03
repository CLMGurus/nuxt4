// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
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
  // devServer: {
  //   https: true,
  //   host: "0.0.0.0",
  //   port: 3000,
  // },
  runtimeConfig: {
    public: {
      supabaseUrl: "",
      supabaseKey: "",
      apiV1Endpoint: "",
      apiV1Base: "",
    },
  },
});
