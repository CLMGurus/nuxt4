<template>
  <v-container class="pa-md-8" fluid>
    <DataTableCard
      title="Reports"
      subtitle="View all generated reports"
      icon="mdi-file-chart"
      :headers="headers"
      :items="filteredReports"
      :search="search"
      :loading="loading"
      :newItemLink="'/reports/create'"
      :onReload="fetchReports"
      :statusColor="statusColor"
      :typeColor="typeColor"
    >
      <template #filters>
        <v-col cols="12" md="6" lg="2">
          <v-select
            v-model="filterStatus"
            :items="statusOptions"
            label="Filter by Status"
            variant="solo-filled"
            rounded="xl"
            density="compact"
            hide-details
            multiple
            flat
            clearable
          />
        </v-col>
        <v-col cols="12" md="6" lg="2">
          <v-select
            v-model="filterTypes"
            :items="typeOptions"
            label="Filter by Type"
            variant="solo-filled"
            density="compact"
            rounded="xl"
            hide-details
            multiple
            flat
            clearable
          />
        </v-col>
        <v-col cols="12" md="4" lg="2">
          <v-select
            v-model="filterModalities"
            :items="modalities"
            label="Filter by Modalities"
            variant="solo-filled"
            density="compact"
            rounded="xl"
            hide-details
            multiple
            flat
            clearable
        /></v-col>
        <v-col cols="12" md="8" lg="6">
          <v-text-field
            v-model="search"
            label="Search by modality, region or finding..."
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
          <v-btn icon flat @click="shareOnWhatsApp(item)" density="compact">
            <v-icon size="x-small">mdi-whatsapp</v-icon>
            <v-tooltip activator="parent" location="top"
              >Share Report</v-tooltip
            >
          </v-btn>
          <v-btn icon flat @click="viewReport(item)" density="compact">
            <v-icon size="x-small">mdi-file-find-outline</v-icon>
            <v-tooltip activator="parent" location="top">View Report</v-tooltip>
          </v-btn>
          <v-btn icon flat @click="editReport(item)" density="compact">
            <v-icon size="x-small">mdi-file-document-edit-outline</v-icon>
            <v-tooltip activator="parent" location="top">Edit Report</v-tooltip>
          </v-btn>
        </div>
      </template>

      <template #dialog>
        <ShareDialog
          v-model="showShareDialog"
          :mode="'report'"
          :payloadData="selectedReport"
        />
      </template>
    </DataTableCard>
  </v-container>
</template>

<script setup>
import { useReports } from "@/composables/useReports";
import { parseMedicalReport } from "@/composables/utils";
import { useAuthStore } from "~/stores/auth";

const authStore = useAuthStore();
const user = authStore.user;
const config = useRuntimeConfig();

const showShareDialog = ref(false);
const selectedReport = ref({});

const url = useRequestURL();

const {
  reports,
  search,
  filterStatus,
  filterTypes,
  filterModalities,
  fetchReports,
  filterRadiologist,
  radiologistOptions,
  loading,
  filteredReports,
  statusColor,
  typeColor,
  statusOptions,
  typeOptions,
} = useReports();

const headers = [
  { title: "Report ID", key: "report_id" },
  { title: "Radiologist", key: "radiologist_name" },
  { title: "Modalities", key: "modalities" },
  { title: "Anatomical Region", key: "anatomical_region" },
  // { title: "Clinical Findings", key: "clinical_findings" },
  // { title: "Clinical Symptoms", key: "clinical_symptoms" },
  { title: "Status", key: "status" },
  { title: "type", key: "type" },
  { title: "Created On", key: "created_at" },
  { title: "Updated At", key: "updated_at" },
  { title: "Actions", key: "actions", sortable: false },
];

onMounted(() => {
  if (user?.id) fetchReports();
});

watch(
  () => authStore.currentOrganization,
  (newOrg, oldOrg) => {
    if (newOrg && newOrg !== oldOrg) {
      console.log("Organization changed. Reloading dashboard...");
      fetchReports();
    }
  }
);
function viewReport(report) {
  navigateTo(`/reports/${report.report_id}`);
}
function editReport(report) {
  navigateTo(`/reports/edit/${report.report_id}`);
}

async function shareOnWhatsApp(item) {
  try {
    const result = parseMedicalReport(item.report_content);

    selectedReport.value = {
      reportId: item.report_id,
      studyId: item.study_id,
      anatomicalRegion: item.anatomical_region,
      reportUrl: `${url.origin}/reports/${item.report_id}`,
      modality: item.modalities.toString(),
      patientName: item.patient_name,
      detailedFindings: result.findings,
      impressions: result.impression,
      recommendations: result.recommendations,
    };

    showShareDialog.value = true;
  } catch (err) {
    console.error("❌ Failed to generate Weasis link:", err);
  }
}
</script>
