<!-- pages/update-password.vue -->
<template>
  <v-container
    class="d-flex justify-center align-center"
    style="min-height: 100vh"
  >
    <v-card class="pa-6" width="400" elevation="8">
      <v-card-title class="text-h6">Set a New Password</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="newPassword"
          label="New Password"
          :type="showPassword ? 'text' : 'password'"
          :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append-inner="showPassword = !showPassword"
        />
        <p class="text-red text-caption mt-1">{{ error }}</p>
        <p class="text-green text-caption mt-1">{{ success }}</p>
      </v-card-text>
      <v-card-actions>
        <v-btn block color="primary" @click="updatePassword" :loading="loading"
          >Update Password</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";

definePageMeta({
  layout: false,
});

const supabase = useSupabaseClient();

const newPassword = ref("");
const showPassword = ref(false);
const error = ref("");
const success = ref("");
const loading = ref(false);

async function updatePassword() {
  error.value = "";
  success.value = "";
  loading.value = true;

  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword.value,
  });

  loading.value = false;

  if (updateError) {
    error.value = updateError.message;
  } else {
    success.value = "Password updated successfully. You can now log in.";
  }
}
</script>
