<template>
  <v-container class="pa-md-8" fluid>
    <DataTableCard
      title="Studies"
      subtitle="View and share the studies"
      icon="mdi-microscope"
      :headers="headers"
      :items="filteredRecords"
      :search="search"
      :loading="loading"
      :newItemLink="'/studies/upload'"
      :onReload="fetchStudies"
      :statusColor="statusColor"
    >
      <template #filters>
        <v-col cols="12" sm="6" md="3">
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
        <v-col cols="12" sm="6" md="3">
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
          />
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
          <v-btn icon @click="shareOnWhatsApp(item)" density="compact" flat>
            <v-icon size="x-small">mdi-whatsapp</v-icon>
            <v-tooltip activator="parent" location="top"
              >Share the Study</v-tooltip
            >
          </v-btn>
          <v-menu open-on-click>
            <template #activator="{ props }">
              <v-btn v-bind="props" icon density="compact" flat>
                <v-icon size="x-small">mdi-eye-outline</v-icon>
                <v-tooltip activator="parent" location="top"
                  >View the study</v-tooltip
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
            :to="{
              path: '/reports/create',
              query: {
                study_id: item.studyId,
                modality: item.modalities,
                patient_name: item.patientName,
              },
            }"
            density="compact"
            flat
          >
            <v-icon size="x-small">mdi-file-document-plus-outline</v-icon>
            <v-tooltip activator="parent" location="top"
              >Create Report</v-tooltip
            >
          </v-btn>
        </div>
      </template>

      <template #dialog>
        <ShareDialog
          v-model="showShareDialog"
          :mode="'link'"
          :payloadData="{
            studyId: selectedStudy.studyId,
            patientName: selectedStudy.patientName,
            modality: selectedStudy.modality,
            anatomicalRegion: selectedStudy.anatomicalRegion,
            weasisUrl: selectedStudy.weasisURL,
            ohifUrl: selectedStudy.ohifURL,
          }"
        />
      </template>
    </DataTableCard>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useStudies } from "~/composables/useStudies";
import { modalities } from "~/composables/utils";
import { useAuthStore } from "~/stores/auth";

const authStore = useAuthStore();
const config = useRuntimeConfig();

const user = authStore.user;

const {
  records,
  loading,
  search,
  filterStatus,
  filterPriority,
  filterModalities,
  statusOptions,
  modalitiesOptions,
  priorityOptions,
  fetchStudies,
  filteredRecords,
  statusColor,
} = useStudies();

const headers = [
  { title: "StudyID", key: "studyId" },
  { title: "Patient ID", key: "patientId" },
  { title: "Patient Name", key: "patientName" },
  { title: "Patient DOB", key: "patientDOB" },
  { title: "Patient Sex", key: "patientSex" },
  // { title: "Study Instance UID", key: "studyInstanceUid" },
  // { title: "Study Description", key: "studyDescription" },
  // { title: "Study Date", key: "studyDate" },
  { title: "Modalities", key: "modalities" },
  { title: "Status", key: "status" },
  { title: "Uploaded By", key: "uploadedBy" },
  { title: "Uploaded On", key: "uploadedDate" },
  { title: "Actions", key: "actions", sortable: false },
];

const items = [
  { title: "Click Me", to: "/settings" },
  { title: "Click Me" },
  { title: "Click Me" },
  { title: "Click Me 2" },
];

const showShareDialog = ref(false);
const selectedStudy = ref({});

const url = useRequestURL();

onMounted(() => {
  if (user?.id) fetchStudies();
});

watch(
  () => authStore.currentOrganization,
  (newOrg, oldOrg) => {
    if (newOrg && newOrg !== oldOrg) {
      console.log("Organization changed. Reloading dashboard...");
      fetchStudies();
    }
  }
);

async function viewDICOM(item) {
  try {
    const weasisURL = await $fetch(
      `${config.public.apiV1Base}/dicom-view/study/${item.studyInstanceUid}`,
      {
        method: "GET",
        responseType: "text",
      }
    );
    window.location.href = weasisURL;
  } catch (err) {
    console.error("Failed to open Weasis:", err);
  }
}

function openOHIFViewer(item) {
  const studyUID = item.studyInstanceUid;
  const ohifURL = `/ohif/viewer?StudyInstanceUIDs=${encodeURIComponent(
    studyUID
  )}`;
  window.open(ohifURL, "_blank");
}

async function shareOnWhatsApp(item) {
  try {
    const studyUid = item.studyInstanceUid;

    const ohifURL = `${url.origin}/api/ohif-launch/${studyUid}`;

    const weasisURL = `${url.origin}/api/launch/study/${studyUid}`;

    selectedStudy.value = {
      studyId: item.studyId,
      patientName: item.patientName,
      modality: item.modalities.toString(),
      anatomicalRegion: item.studyDescription || item.anatomicalRegion || "N/A",
      weasisURL,
      ohifURL,
    };

    showShareDialog.value = true;
  } catch (err) {
    console.error("❌ Failed to generate Weasis link:", err);
  }
}
</script>
