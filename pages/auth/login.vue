<template>
  <AuthFormWrapper
    title="Welcome back!"
    subtitle="Please fill your login details"
  >
    <v-form @submit.prevent="handleLogin" v-model="isValid">
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

      <v-text-field
        v-model="password"
        label="Password"
        variant="outlined"
        :append-inner-icon="isVisible ? 'mdi-eye-off' : 'mdi-eye'"
        :type="isVisible ? 'text' : 'password'"
        density="comfortable"
        placeholder="Password (at least 6 characters)"
        prepend-inner-icon="mdi-lock-outline"
        @click:append-inner="isVisible = !isVisible"
        :rules="passwordRules"
      />

      <div class="mt-n1 mb-4 d-flex justify-center text-caption mt-4">
        <a
          href="#"
          class="text-body-2 text-primary"
          @click.prevent="navigateTo('/auth/reset-password')"
        >
          Forgot Password?
        </a>
      </div>

      <v-btn
        type="submit"
        prepend-icon="mdi-account"
        color="primary"
        block
        size="large"
        class="mb-4 text-none"
        rounded="lg"
        :disabled="!isValid || authStore.isLoading"
        :loading="authStore.isLoading"
        flat
      >
        Sign In
      </v-btn>

      <p class="text-red">{{ error }}</p>
    </v-form>
  </AuthFormWrapper>
</template>

<script setup>
import { ref } from "vue";
import AuthFormWrapper from "~/components/AuthFormWrapper.vue";
import { useAuthStore } from "~/stores/auth";

definePageMeta({ layout: false });

const authStore = useAuthStore();
const email = ref("");
const password = ref("");
const isVisible = ref(false);
const isValid = ref(false);
const error = ref("");

const handleLogin = async () => {
  error.value = "";
  if (isValid.value) {
    const result = await authStore.signIn(email.value, password.value);
    if (result.success) {
      await navigateTo("/");
    } else {
      error.value = result.error;
    }
  }
};

const emailRules = [
  (value) => !!value || "Email is required",
  (value) =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i.test(value) ||
    "Email must be valid",
];

const passwordRules = [
  (value) => !!value || "Password is required",
  (value) => value.length >= 6 || "Password must be at least 6 characters",
];
</script>
