<template>
  {{ props.error }}
  <v-btn to="/">Go home</v-btn>
</template>
<script setup>
const props = defineProps(["error"]);
</script>
