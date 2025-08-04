<template>
  <v-container class="pa-md-8" fluid>
    <DataTableCard
      title="Shared"
      subtitle="View all the shared studies and reports"
      icon="mdi-share-all"
      :headers="headers"
      :items="filteredSharedItems"
      :search="search"
      :loading="loading"
      :onReload="fetchSharedItems"
      :typeColor="getTypeColor"
    >
      <template #filters>
        <v-col cols="12" sm="6" md="3">
          <v-select
            v-model="filterType"
            :items="typeOptions"
            label="Filter by Type"
            variant="solo-filled"
            density="compact"
            rounded="xl"
            hide-details
            flat
            multiple
            clearable
          />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <!-- <v-select
            v-model="filterStatus"
            :items="statusOptions"
            label="Filter by Doctor"
            variant="solo-filled"
            rounded="xl"
            density="compact"
            hide-details
            flat
            clearable
          /> -->
        </v-col>
        <v-col cols="12" sm="12" md="6">
          <v-text-field
            v-model="search"
            label="Search by Patient Name, ID or Modalities..."
            prepend-inner-icon="mdi-magnify"
            variant="solo-filled"
            density="compact"
            rounded="xl"
            single-line
            hide-details
            flat
          />
        </v-col>
      </template>

      <template #row-actions="{ item }">
        <div class="d-flex flex-row">
          <v-menu open-on-click v-if="item.type === 'link'">
            <template #activator="{ props }">
              <v-btn v-bind="props" icon density="compact" flat>
                <v-icon size="x-small">mdi-eye</v-icon>
                <v-tooltip activator="parent" location="top"
                  >View the Study</v-tooltip
                >
              </v-btn>
            </template>

            <v-list>
              <v-list-item @click="viewDICOM(item)">
                <v-list-item-title>View in Desktop (Weasis)</v-list-item-title>
              </v-list-item>
              <v-list-item @click="openOHIFViewer(item)">
                <v-list-item-title>View in Browser (OHIF)</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

          <v-btn
            icon
            :to="`/reports/${item.reportId}`"
            density="compact"
            flat
            v-if="item.type === 'report'"
          >
            <v-icon size="x-small">mdi-file-document-multiple</v-icon>
            <v-tooltip activator="parent" location="top"
              >View the Report</v-tooltip
            >
          </v-btn>
        </div>
      </template>
    </DataTableCard>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useStudyShares } from "~/composables/useStudyShares";
import { modalities } from "~/composables/utils";
import { useAuthStore } from "~/stores/auth";

const authStore = useAuthStore();
const config = useRuntimeConfig();

const user = authStore.user;

const {
  filteredSharedItems,
  fetchSharedItems,
  loading,
  search,
  typeOptions,
  filterByMobile,
  filterType,
  sharedItems,
} = useStudyShares(user, config);

const headers = [
  { title: "ShareID", key: "shareId" },
  { title: "Mobile", key: "sharedToMobile" },
  { title: "Type", key: "type" },
  // { title: "ReportID", key: "reportId" },
  // { title: "ReportUrl", key: "reportUrl" },
  // { title: "Weasis", key: "weasisUrl" },
  // { title: "OHIF", key: "ohifUrl" },
  { title: "Message", key: "message" },
  { title: "Shared By", key: "sharedBy" },
  { title: "Shared At", key: "sharedAt" },
  { title: "Actions", key: "actions", sortable: false },
];

onMounted(() => {
  if (user?.id) fetchSharedItems();
});

watch(
  () => authStore.currentOrganization,
  (newOrg, oldOrg) => {
    if (newOrg && newOrg !== oldOrg) {
      console.log("Organization changed. Reloading dashboard...");
      fetchSharedItems();
    }
  }
);

function getTypeColor(type) {
  if (!type) return "grey";
  const t = type.toLowerCase();
  if (t === "link") return "info";
  if (t === "report") return "success";
  return "grey";
}

async function viewDICOM(item) {
  window.location.href = item.weasisUrl;
}

function openOHIFViewer(item) {
  window.open(item.ohifUrl, "_blank");
}
</script>
