<template>
  <v-container class="pa-md-8" fluid>
    <v-breadcrumbs :items="items"></v-breadcrumbs>
    <v-card class="px-12 py-8" rounded="xl" flat v-if="report">
      <v-card-title class="text-h5 font-weight-bold">
        Diagnostic Report
      </v-card-title>
      <v-card-subtitle>Report ID: {{ id }}</v-card-subtitle>

      <v-divider class="my-4"></v-divider>

      <h4>Patient: {{ report.patient_name }}</h4>
      <v-row>
        <v-col cols="12" sm="6">
          <strong>Modality:</strong> {{ report.modality }}<br />
          <strong>Anatomical Region:</strong> {{ report.anatomical_region
          }}<br />
          <strong>Clinical Findings:</strong> {{ report.clinical_findings
          }}<br />
          <strong>Clinical Symptoms:</strong> {{ report.clinical_symptoms
          }}<br />
        </v-col>
        <v-col cols="12" sm="6">
          <strong>Status:</strong>
          <v-chip :color="statusColor(report.status)" class="ml-1" dark>{{
            report.status
          }}</v-chip
          ><br />
          <strong>Created:</strong> {{ formatDate(report.created_at) }}<br />
          <strong>Updated:</strong> {{ formatDate(report.updated_at) }}<br />
        </v-col>
      </v-row>

      <v-divider class="my-4"></v-divider>

      <div v-html="report.report_html"></div>

      <div class="mt-2" v-if="report.remark">
        <h3 class="text-subtitle-1 font-weight-bold">Remarks</h3>
        <p>{{ report.remark }}</p>
      </div>
    </v-card>

    <v-alert v-if="error" color="error" icon="mdi-alert">
      Report not found or failed to load.
    </v-alert>
  </v-container>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const config = useRuntimeConfig();
const route = useRoute();
const id = route.params.id;
const loading = ref(true);
const error = ref();

const report = ref(null);

const items = [
  {
    title: "All Reports",
    disabled: false,
    to: "/reports",
  },
  {
    title: "Report",
    disabled: true,
  },
];

onMounted(async () => {
  try {
    const res = await fetch(`${config.public.apiV1Endpoint}/reports/${id}`);
    if (!res.ok) throw new Error("Failed to load report");
    report.value = await res.json();
  } catch (err) {
    error.value = err;
    console.error("Error fetching report:", err);
  } finally {
    loading.value = false;
  }
});

function formatDate(dateStr) {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function statusColor(status) {
  return (
    {
      final: "green",
      draft: "blue",
      error: "red",
    }[status] || "grey"
  );
}
</script>
