<template>
  <AuthFormWrapper title="Reset Password" subtitle="Please fill your email">
    <v-form @submit.prevent="handleReset" v-model="isValid">
      <v-text-field
        autofocus
        v-model="email"
        label="Email"
        type="text"
        variant="outlined"
        density="comfortable"
        prepend-inner-icon="mdi-email-outline"
        placeholder="your@yourcompany.com"
        :rules="emailRules"
        required
      />

      <div class="d-flex justify-space-between align-center">
        <v-btn
          to="/auth/login"
          prepend-icon="mdi-arrow-left"
          variant="outlined"
          color="primary"
          size="large"
          class="text-none"
          rounded="lg"
        >
          Back to Login
        </v-btn>

        <v-btn
          type="submit"
          prepend-icon="mdi-link"
          color="primary"
          size="large"
          class="text-none"
          rounded="lg"
          :disabled="!isValid || authStore.isLoading"
          :loading="authStore.isLoading"
        >
          Send Link
        </v-btn>
      </div>

      <p v-if="error" class="text-red mt-2">{{ error }}</p>
      <p v-if="success" class="text-green mt-2">{{ success }}</p>
    </v-form></AuthFormWrapper
  >
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "~/stores/auth";

definePageMeta({ layout: false });

const authStore = useAuthStore();
const email = ref("");
const isValid = ref(false);
const error = ref("");
const success = ref("");

const handleReset = async () => {
  error.value = "";
  success.value = "";

  if (isValid.value) {
    const result = await authStore.sendPasswordResetLink(email.value);
    if (!result.success) {
      error.value = result.error;
    } else {
      success.value = "Reset link has been sent to your email.";
      email.value = "";
    }
  }
};

const emailRules = [
  (value) => !!value || "Email is required",
  (value) =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i.test(value) ||
    "Email must be valid",
];
</script>
