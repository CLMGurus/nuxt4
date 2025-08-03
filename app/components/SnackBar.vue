<template>
  <v-snackbar v-model="model" :timeout="timeout" :color="color">
    {{ text }}

    <template v-slot:actions>
      <v-btn variant="text" @click="close">Close</v-btn>
    </template>
  </v-snackbar>
</template>

<script setup>
import { computed, watch } from "vue";

// Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  text: {
    type: String,
    default: "",
  },
  timeout: {
    type: Number,
    default: 2000,
  },
  color: {
    type: String,
    default: "primary",
  },
});

const emit = defineEmits(["update:modelValue"]);

const model = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

function close() {
  model.value = false;
}
</script>
