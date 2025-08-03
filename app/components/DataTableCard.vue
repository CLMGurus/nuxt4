<template>
  <v-card rounded="xl" class="pa-6">
    <v-card-title class="text-h6 font-weight-bold">
      <v-list-item class="pa-0" :subtitle="subtitle" :title="title">
        <template #prepend>
          <slot name="prepend">
            <v-avatar color="accent" size="large">
              <v-icon color="primary" :icon="icon"></v-icon>
            </v-avatar>
          </slot>
        </template>
        <template #append>
          <div class="d-flex flex-row ga-1">
            <slot name="actions">
              <v-btn
                class="text-none"
                color="primary"
                rounded="lg"
                prepend-icon="mdi-refresh"
                @click="onReload"
                :loading="loading"
                flat
                >Reload</v-btn
              >
              <v-btn
                v-if="newItemLink"
                class="text-none"
                color="primary"
                rounded="lg"
                prepend-icon="mdi-plus"
                :to="newItemLink"
                flat
                >New</v-btn
              >
            </slot>
          </div>
        </template>
      </v-list-item>
    </v-card-title>

    <v-row class="my-4" align="center" justify="center">
      <slot name="filters"></slot>
    </v-row>

    <v-data-table
      :headers="headers"
      :items="items"
      :search="search"
      :loading="loading"
    >
      <template #item.status="{ item }">
        <slot name="status" :item="item">
          <v-chip class="text-lowercase" :color="statusColor(item.status)">
            {{ item.status }}
          </v-chip>
        </slot>
      </template>
      <template #item.priority="{ item }">
        <slot name="status" :item="item">
          <v-chip class="text-lowercase" :color="priorityColor(item.priority)">
            {{ item.priority }}
          </v-chip>
        </slot>
      </template>

      <template #item.type="{ item }">
        <slot name="type" :item="item">
          <v-chip class="text-lowercase" :color="typeColor(item.type)">
            {{ item.type }}
          </v-chip>
        </slot>
      </template>

      <template #item.modalities="{ item }">
        <div
          class="d-flex"
          v-if="Array.isArray(item.modalities) && item.modalities.length"
        >
          <v-chip
            color="primary"
            v-for="mod in item.modalities"
            :key="mod"
            class="ma-1"
            small
          >
            {{ mod }}
          </v-chip>
        </div>
        <span v-else>N/A</span>
      </template>

      <template #item.actions="{ item }">
        <slot name="row-actions" :item="item"></slot>
      </template>
    </v-data-table>
    <slot name="dialog"></slot>
  </v-card>
</template>

<script setup>
defineProps({
  title: String,
  subtitle: String,
  icon: { type: String, default: "mdi-circle" },
  headers: Array,
  items: Array,
  search: String,
  loading: Boolean,
  newItemLink: String,
  onReload: Function,
  statusColor: Function,
  priorityColor: Function,
  typeColor: Function,
});
</script>
