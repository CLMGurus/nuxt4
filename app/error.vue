<script setup lang="ts">
import type { NuxtError } from "#app";

const props = defineProps({
  error: Object as () => NuxtError,
});
</script>

<template>
  <v-container
    style="height: 100vh"
    class="d-flex flex-column justify-center align-center"
  >
    <h1>{{ error?.statusCode }}</h1>
    <v-btn class="text-none" rounded="lg" color="primary" flat to="/"
      >Go back home</v-btn
    >
  </v-container>
</template>
