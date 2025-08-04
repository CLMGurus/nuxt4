<template>
  <v-app>
    <v-main class="bg-primary d-flex align-center justify-center px-4">
      <v-img
        class="position-absolute left-0 top-0 ml-16 mt-8"
        src="/logo/humantics_light.png"
        lazy-src="/logo/humantics_light.png"
        alt="Humantics Logo"
        :width="200"
        aspect-ratio="16/9"
        contain
      />
      <v-card
        class="pa-4 rounded-lg login-card"
        elevation="10"
        width="450"
        :title="title"
        :subtitle="subtitle"
      >
        <v-card-text class="mt-2">
          <slot />
        </v-card-text>
      </v-card>
    </v-main>
  </v-app>
</template>

<script setup>
defineProps({
  title: String,
  subtitle: String,
});
</script>
