<template>
  <v-container class="pa-md-8" fluid>
    <div class="d-flex justify-space-between mb-4">
      <div>
        <h1 class="text-h4 font-weight-bold">Welcome, {{ user.fullName }}!</h1>
        <p class="text-body-2 text-medium-emphasis mt-2">
          {{ user.email }}
        </p>
      </div>
    </div>

    <!-- Summary Cards -->
    <v-row class="mb-6" dense>
      <v-col cols="12" md="6" lg="3" v-for="(card, i) in summaryCards" :key="i">
        <v-card rounded="lg" class="pa-4" outlined>
          <div class="d-flex justify-space-between align-center">
            <div>
              <div class="text-subtitle-2">{{ card.title }}</div>
              <div class="text-h5 font-weight-bold">{{ card.value }}</div>
            </div>
            <v-icon size="32">{{ card.icon }}</v-icon>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Chart and Quick Actions -->
    <v-row dense>
      <v-col cols="12" lg="6">
        <!-- Upload Trends Chart -->
        <v-card
          rounded="lg"
          class="pa-4 mb-4"
          outlined
          title="Study upload trends"
          subtitle="Last 7 days of breakdown of uploaded studies"
        >
          <v-card-text>
            <BaseChart
              v-if="barData"
              :chart-type="'bar'"
              :chart-data="barData"
            />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" lg="6">
        <!-- Upload Trends Chart -->
        <v-card
          rounded="lg"
          class="pa-4 mb-4"
          outlined
          title="Report Completion Status"
          subtitle="Comparison of completed vs. pending reports"
        >
          <v-card-text>
            <BaseChart
              v-if="pieData"
              :chart-type="'doughnut'"
              :chart-data="pieData"
            />
          </v-card-text>
          <!-- <div class="text-subtitle-1 font-weight-medium mb-2">
            Study Upload Trends
          </div> -->
        </v-card>
      </v-col>
    </v-row>

    <!-- Recent Activity Table -->
    <DataTableCard
      class="mt-4"
      title="Recent Study Uploads"
      subtitle="List of recent uploaded studies"
      icon="mdi-microscope"
      :items="recentUploads"
      :headers="recentHeaders"
      :loading="loading"
      :onReload="fetchRecentUploads"
    ></DataTableCard>

    <!-- Pending Reports -->
    <DataTableCard
      class="mt-8"
      title="Reports Pending Creation"
      subtitle="List of studies without reports"
      icon="mdi-microscope"
      :items="studiesWithoutReports"
      :headers="pendingHeaders"
      :loading="loading"
      :onReload="fetchStudiesWithoutReports"
      ><template #row-actions="{ item }">
        <v-btn
          prepend-icon="mdi-file-document-plus"
          class="text-none"
          rounded="lg"
          flat
          color="secondary"
          @click="goToCreateReport(item)"
          >Create Report</v-btn
        >
      </template></DataTableCard
    >
  </v-container>
</template>

<script setup>
import { onMounted } from "vue";
import { useDashboard } from "~/composables/useDashboard";
import { useAuthStore } from "~/stores/auth";

const authStore = useAuthStore();

const router = useRouter();
const config = useRuntimeConfig();

const user = authStore.user;

const {
  loading,
  summary,
  barData,
  pieData,
  recentUploads,
  studiesWithoutReports,
  fetchSummary,
  fetchStudiesPerDay,
  fetchReportStatus,
  fetchRecentUploads,
  fetchStudiesWithoutReports,
} = useDashboard(user, config);

onMounted(() => {
  if (user?.id) {
    fetchSummary();
    fetchStudiesPerDay();
    fetchReportStatus();
    fetchRecentUploads();
    fetchStudiesWithoutReports();
  }
});

watch(
  () => authStore.currentOrganization,
  (newOrg, oldOrg) => {
    if (newOrg && newOrg !== oldOrg) {
      console.log("Organization changed. Reloading dashboard...");
      fetchSummary();
      fetchStudiesPerDay();
      fetchReportStatus();
      fetchRecentUploads();
      fetchStudiesWithoutReports();
    }
  }
);

const summaryCards = computed(() => [
  {
    title: "Total Studies",
    value: summary.value?.totalStudies ?? 0,
    icon: "mdi-folder-multiple",
    color: "primary",
  },
  {
    title: "Reports Created",
    value: summary.value?.reportsCreated ?? 0,
    icon: "mdi-file-document-outline",
    color: "green",
  },
  {
    title: "Pending Reports",
    value: summary.value?.pendingReports ?? 0,
    icon: "mdi-timer-sand",
    color: "orange",
  },
  {
    title: "Total Shared",
    value: summary.value?.totalShared ?? 0,
    icon: "mdi-share-variant",
    color: "blue",
  },
]);

const recentHeaders = [
  { title: "Study ID", key: "study_id" },
  { title: "Patient Name", key: "patient_name" },
  { title: "Uploaded At", key: "timestamp" },
  { title: "Modalities", key: "modalities" },
  // { title: "Actions", key: "actions", sortable: false },
];

const pendingHeaders = [
  { title: "Study ID", key: "study_id" },
  { title: "Patient Name", key: "patient_name" },
  { title: "Uploaded At", key: "timestamp" },
  { title: "Modalities", key: "modalities" },
  { title: "Actions", key: "actions", sortable: false },
];

function goToCreateReport(item) {
  console.log(item);
  router.push({
    path: "/reports/create",
    query: {
      study_id: item.study_id,
      modality: item.modalities,
      patient_name: item.patient_name,
    },
  });
}
</script>
