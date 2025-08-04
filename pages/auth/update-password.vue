<template>
  <AuthFormWrapper
    title="Set a New Password"
    subtitle="Please fill your new password"
  >
    <v-form @submit.prevent="handleUpdate" v-model="isValid">
      <v-text-field
        v-model="password"
        label="New Password"
        variant="outlined"
        :append-inner-icon="isVisible ? 'mdi-eye-off' : 'mdi-eye'"
        :type="isVisible ? 'text' : 'password'"
        density="comfortable"
        placeholder="Password (at least 6 characters)"
        prepend-inner-icon="mdi-lock-outline"
        @click:append-inner="isVisible = !isVisible"
        :rules="passwordRules"
      />

      <v-btn
        type="submit"
        prepend-icon="mdi-check"
        color="primary"
        size="large"
        class="text-none mt-4"
        rounded="lg"
        block
        :disabled="!isValid || authStore.isLoading"
        :loading="authStore.isLoading"
      >
        Update Password
      </v-btn>

      <p v-if="error" class="text-red mt-2">{{ error }}</p>
    </v-form>
  </AuthFormWrapper>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "~/stores/auth";

definePageMeta({ layout: false });

const authStore = useAuthStore();
const password = ref("");
const isValid = ref(false);
const isVisible = ref(false);
const error = ref("");

const handleUpdate = async () => {
  error.value = "";

  if (isValid.value) {
    const result = await authStore.updatePassword(password.value);
    if (!result.success) {
      error.value = result.error;
    } else {
      await navigateTo("/auth/login");
    }
  }
};

const passwordRules = [
  (value) => !!value || "Password is required",
  (value) => value.length >= 6 || "Password must be at least 6 characters",
];
</script>
