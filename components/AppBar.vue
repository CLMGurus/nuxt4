<template>
  <v-navigation-drawer
    class="bg-primary"
    v-if="authStore.email"
    elevation="2"
    v-model="menuDrawer"
    :rail="rail"
    @click="rail = false"
    permanent
  >
    <v-list>
      <v-list-item
        class="py-4"
        title="huRAD"
        subtitle="Cloud Radiology Platform"
      >
        <template v-slot:prepend>
          <v-avatar
            image="/logo/humantics_symbol_light.png"
            rounded="0"
          ></v-avatar>
        </template>
      </v-list-item>
    </v-list>
    <v-list>
      <v-list-item
        v-for="(item, i) in filteredMenuItems"
        :key="i"
        :to="item.route"
        rounded="xl"
      >
        <template v-slot:prepend>
          <v-icon :icon="item.icon" />
        </template>
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>

      <v-divider> </v-divider>
    </v-list>
    <template v-slot:append>
      <v-divider></v-divider>
      <ClientOnly>
        <v-list-item
          class="mx-2 mb-2"
          lines="two"
          :title="authStore.user?.fullName"
          :subtitle="authStore.user?.email"
          prepend-avatar="https://cdn.vuetifyjs.com/images/john.png"
        >
          <template v-slot:append>
            <v-menu>
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  color="grey-lighten-1"
                  icon="mdi-unfold-more-horizontal"
                  variant="text"
                ></v-btn>
              </template>

              <v-list>
                <v-list-subheader>Switch organization</v-list-subheader>
                <v-list-item
                  v-for="(item, index) in authStore.organizations"
                  :key="index"
                  @click="authStore.selectCurrentOrganization(item)"
                >
                  <template v-slot:prepend>
                    <v-icon icon="mdi-account-group"></v-icon>
                  </template>
                  <v-list-item-title>{{ item.name }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
        </v-list-item>
      </ClientOnly>

      <div class="ma-4">
        <v-btn
          v-if="!rail"
          class="rounded-lg text-none"
          prepend-icon="mdi-logout"
          color="secondary"
          rounded="lg"
          block
          flat
          @click="signOut"
        >
          Sign Out
        </v-btn>
        <v-btn
          v-else
          class="bg-transparent"
          icon="mdi-logout"
          size="large"
          @click="signOut"
          density="compact"
          flat
        ></v-btn>
      </div>
    </template>
  </v-navigation-drawer>
  <v-app-bar class="border-b" flat v-if="authStore.email">
    <template v-slot:prepend>
      <v-app-bar-nav-icon
        :icon="rail ? 'mdi-menu-open' : 'mdi-menu-close'"
        @click="rail = !rail"
      ></v-app-bar-nav-icon>
    </template>
    <v-app-bar-title class="text-capitalize">{{
      displayRouteName
    }}</v-app-bar-title>

    <template v-slot:append>
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn
            prepend-icon="mdi-account-group"
            class="text-none"
            color="primary"
            v-bind="props"
          >
            {{ authStore.currentOrganization?.name }}
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="(item, index) in authStore.organizations"
            :key="index"
            :value="index"
            @click="authStore.selectCurrentOrganization(item)"
          >
            <v-list-item-title>{{ item.name }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <!-- <v-btn size="small" variant="text" flat>
        <v-badge color="error" dot>
          <v-icon size="large">mdi-bell-outline</v-icon>
        </v-badge>
      </v-btn> -->

      <!-- <v-btn
        size="small"
        variant="text"
        :icon="
          theme.global.current.value.dark
            ? 'mdi-white-balance-sunny'
            : 'mdi-moon-waning-crescent'
        "
        flat
        @click="toggleTheme"
      ></v-btn> -->

      <!-- <v-btn
        size="small"
        variant="text"
        icon="mdi-dock-right"
        @click="toggleDrawer"
      ></v-btn> -->

      <v-btn
        size="small"
        variant="text"
        icon="mdi-logout"
        @click="signOut"
      ></v-btn>
    </template>
  </v-app-bar>
  <v-navigation-drawer v-model="drawerOpen" location="right" temporary>
  </v-navigation-drawer>
</template>

<script setup>
import { ref, shallowRef, onMounted, computed } from "vue";
import { useTheme } from "vuetify";
import { useAuthStore } from "~/stores/auth";

const authStore = useAuthStore();
const config = useRuntimeConfig();
const user = authStore.user;

const theme = useTheme();
const route = useRoute();

const menuDrawer = shallowRef(true);
const rail = shallowRef(false);
const drawerOpen = ref(false);

const toggleDrawer = () => {
  drawerOpen.value = !drawerOpen.value;
};

const regex = /^\/studies\/\d+$/;

const items = ref([
  { title: "Click Me" },
  { title: "Click Me" },
  { title: "Click Me" },
  { title: "Click Me 2" },
]);

// const currentOrganizationName = computed(() => {
//   return (
//     organizationList.value.find(
//       (org) => org.id === authStore.currentOrganization
//     )?.name || authStore.currentOrganization
//   );
// });

const displayRouteName = computed(() => {
  const segments = route.path.split("/").filter(Boolean);
  if (segments.length === 0) return "Home";
  return segments[0];
});

const filteredMenuItems = computed(() => {
  if (!authStore.role) return [];

  return menuItems.value.filter((item) => item.roles.includes(authStore.role));
});

const menuItems = ref([
  {
    title: "Dashboard",
    route: "/",
    icon: "mdi-view-dashboard",
    roles: ["technician", "radiologist", "doctor", "admin"],
  },
  {
    title: "Studies",
    route: "/studies",
    icon: "mdi-microscope",
    roles: ["technician"],
  },
  {
    title: "Reports",
    route: "/reports",
    icon: "mdi-clipboard-text",
    roles: ["technician", "radiologist", "doctor"],
  },
  {
    title: "Shared",
    route: "/shared",
    icon: "mdi-share-all",
    roles: ["technician"],
  },
]);

function toggleTheme() {
  const currentTheme = theme.global.current.value.dark ? "light" : "dark";
  theme.change(currentTheme);
  localStorage.setItem("theme", theme.global.name.value);
}

onMounted(async () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    theme.change(savedTheme);
    // theme.global.name.value = savedTheme;
  }

  // Default workspace selection
  // if (!authStore.currentOrganization && organizationList.value.length) {
  //   const personal = authStore.personalOrganization;

  //   const defaultOrg =
  //     organizationList.value.find((org) => org.id === personal) ||
  //     organizationList.value[0];

  //   authStore.selectCurrentOrganization(defaultOrg.id);
  // }
});

function signOut() {
  authStore.signOut();
}
</script>
