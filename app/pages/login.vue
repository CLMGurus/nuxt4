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
        rounded="lg"
        width="450"
        title="Welcome back!"
        subtitle="Please fill your login details"
      >
        <v-card-text class="mt-2">
          <v-form @submit.prevent="handleLogin" v-model="isValid">
            <v-text-field
              autofocus
              v-model="email"
              label="Email"
              type="text"
              class="mb-1"
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
              aria-label="Password Input"
              :rules="passwordRules"
            />

            <div
              class="mt-n1 mb-4 d-flex flex-row justify-space-between align-center text-caption mt-4"
            >
              <v-checkbox
                color="primary"
                v-model="rememberMe"
                density="compact"
                hide-details
                ><template v-slot:label
                  ><span class="text-body-2">Remember me</span></template
                ></v-checkbox
              ><a
                href="#"
                class="text-body-2 text-primary text-decoration-none"
                @click.prevent="navigateTo('/reset-password')"
                >Forget Password?</a
              >
              <!-- <v-btn to="/reset-password">Reset</v-btn> -->
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
        </v-card-text>
      </v-card>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from "vue";

const rememberMe = ref(false);

definePageMeta({
  layout: false,
});

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
