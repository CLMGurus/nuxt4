<template>
  <v-container
    class="d-flex justify-center align-center"
    style="min-height: 100vh"
  >
    <v-card class="pa-6" width="400" elevation="8">
      <v-card-title class="text-h6">Reset Password</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="email"
          label="Email Address"
          prepend-inner-icon="mdi-email"
          variant="outlined"
          density="comfortable"
        />
        <p class="text-red text-caption mt-1">{{ error }}</p>
        <p class="text-green text-caption mt-1">{{ success }}</p>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn variant="text" @click="navigateTo('/login')"
          >Back to Login</v-btn
        >
        <v-btn color="primary" @click="sendResetEmail" :loading="loading">
          Send Link
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

definePageMeta({
  layout: false,
});

const router = useRouter();
const authStore = useAuthStore();

const email = ref("");
const error = ref("");
const success = ref("");
const loading = ref(false);

async function sendResetEmail() {
  error.value = "";
  success.value = "";
  loading.value = true;

  const result = await authStore.sendResetLink(email.value);
  loading.value = false;

  if (result.success) {
    success.value = result.message;
  } else {
    error.value = result.message;
  }
}
</script>
