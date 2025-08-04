<template>
  <v-container class="pa-md-8" fluid>
    <v-breadcrumbs :items="items"></v-breadcrumbs>
    <v-card class="pa-6" rounded="xl" flat :loading="submitting">
      <v-card-title>
        <v-list-item
          class="pa-0"
          title="Generate Report"
          subtitle="Generate diagnostic report"
        >
          <template #prepend>
            <v-avatar color="accent" size="large">
              <v-icon icon="mdi-note-plus" color="primary"></v-icon>
            </v-avatar>
          </template>
        </v-list-item>
      </v-card-title>

      <v-card-text>
        <v-form class="mt-6" ref="formRef" v-model="formValid">
          <v-row>
            <v-col cols="12" md="6">
              <v-autocomplete
                v-model="form.study_id"
                :items="studies"
                item-title="study_description"
                item-value="id"
                label="Select Study"
                variant="outlined"
                :rules="required"
                clearable
              />
              <v-text-field
                v-model="form.patient_name"
                label="Patient Name"
                variant="outlined"
                :rules="required"
              />
              <v-select
                v-model="form.modalities"
                :items="modalities"
                label="Modalities"
                :rules="required"
                variant="outlined"
                multiple
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.anatomical_region"
                label="Anatomical Region"
                :rules="required"
                variant="outlined"
              />
              <v-select
                v-model="form.type"
                :items="['preliminary', 'addendum', 'final']"
                label="Type"
                :rules="required"
                variant="outlined"
              />

              <v-select
                v-model="form.status"
                :items="['draft', 'approved', 'rejected']"
                label="Status"
                :rules="required"
                variant="outlined"
              />
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="form.clinical_findings"
                rows="9"
                label="Observations"
                :rules="required"
                variant="outlined"
              />
              <v-textarea
                v-model="form.clinical_symptoms"
                rows="9"
                label="Clinical Symptoms"
                variant="outlined"
              />
              <v-autocomplete
                v-model="selectedTemplate"
                :items="chestXrayTemplates"
                item-title="name"
                item-value="name"
                label="Select Chest X-ray Template"
                variant="outlined"
                class="mb-4"
              />
              <TipTapEditor
                class="mb-8"
                v-model:modelValue="form.report_html"
              />

              <v-textarea
                v-model="form.remark"
                label="Remarks"
                rows="4"
                variant="outlined"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions class="justify-end">
        <v-btn
          class="text-none"
          color="primary"
          variant="tonal"
          rounded="lg"
          :loading="submitting"
          @click="submitReport"
          :disabled="!formValid || submitting"
        >
          Save Report
        </v-btn>
      </v-card-actions>
    </v-card>

    <SnackBar
      v-model="snackbar"
      :text="snackbarText"
      :color="snackbarColor"
      :timeout="3000"
    />
  </v-container>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { modalities } from "@/composables/utils";
import { chestXrayTemplates } from "~/data/report-templates";
import { useAuthStore } from "~/stores/auth";

const config = useRuntimeConfig();
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const reportStore = useReportStore();

const selectedTemplate = ref("");
const editorContent = ref("Select a template to begin.");

const formRef = ref(null);
const formValid = ref(false);
const submitting = ref(false);
const snackbar = ref(false);
const snackbarText = ref("");
const snackbarColor = ref("success");
const studies = ref([]);

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

const form = ref({
  user_id: "",
  radiologist_name: "",
  organization_id: "",
  study_id: "",
  patient_name: "",
  modalities: "",
  anatomical_region: "",
  remark: "",
  report_html: "Select a template to begin.",
  type: "",
  status: "",
});

const required = [(v) => !!v || "This field is required."];

watch(
  () => form.value.study_id,
  (selectedId) => {
    if (!selectedId) {
      // 🧹 Clear prefilled fields when study is cleared
      form.value.patient_name = "";
      form.value.modalities = "";
      return;
    }

    const selectedStudy = studies.value.find((s) => s.id === selectedId);
    if (selectedStudy) {
      form.value.patient_name = selectedStudy.patient_name || "";
      form.value.modalities = selectedStudy.modalities || "";
    }
  }
);

watch(selectedTemplate, (name) => {
  const template = chestXrayTemplates.find((t) => t.name === name);
  if (!template || !template.template) return;

  const t = template.template;
  const report = `
<b>EXAMINATION:</b><br>${t.EXAMINATION}<br><br>
<b>TECHNIQUE:</b><br>${t.TECHNIQUE}<br><br>
<b>FINDINGS:</b><br>
<ul>
  <li><b>Cardiomediastinal:</b> ${t.FINDINGS.Cardiomediastinal}</li>
  <li><b>Lungs:</b> ${t.FINDINGS.Lungs}</li>
  <li><b>Pleura:</b> ${t.FINDINGS.Pleura}</li>
  <li><b>Diaphragm:</b> ${t.FINDINGS.Diaphragm}</li>
  <li><b>Bones:</b> ${t.FINDINGS.Bones}</li>
</ul><br>
<b>IMPRESSION:</b><br>${t.IMPRESSION}
`;
  form.value.report_html = report;
});

watch(
  () => authStore.currentOrganization,
  (newOrg, oldOrg) => {
    if (newOrg && newOrg !== oldOrg) {
      console.log("Organization changed.");
      form.value.organization_id = authStore.currentOrganization?.id || null;
    }
  }
);

onMounted(async () => {
  try {
    await loadStudies();

    // Pre-fill study_id from query
    const queryStudyId = route.query.study_id;
    const queryModalities = route.query.modalities;
    const queryPatientName = route.query.patient_name;

    if (queryStudyId) {
      form.value.study_id = queryStudyId;
    }

    if (queryModalities) {
      form.value.modalities = queryModalities;
    }
    if (queryPatientName) {
      form.value.patient_name = queryPatientName;
    }

    form.value.user_id = authStore.user?.id || null;
    form.value.radiologist_name = authStore.user?.fullName || null;
    form.value.organization_id = authStore.currentOrganization?.id || null;
  } catch (e) {
    console.error("error:", e);
  }
});

async function loadStudies() {
  const res = await fetch(
    `${config.public.apiV1Endpoint}/studies?user_id=${authStore.user.id}`
  );
  const data = await res.json();

  studies.value = data.studies.map((s) => ({
    id: s.id,
    study_description: s.patient_info?.study_description || `Study ${s.id}`,
    patient_name: s.patient_info?.patient_name || "",
    modalities: s.patient_info?.modalities || "",
  }));
}

async function submitReport() {
  const { valid } = await formRef.value.validate();
  if (!valid) return;
  console.log("Saving the form:", form.value);

  submitting.value = true;

  try {
    const res = await fetch(`${config.public.apiV1Endpoint}/reports/save`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form.value),
    });
    if (!res.ok) throw new Error("Failed to save report");
    const result = await res.json();

    snackbarText.value = "✅ Report saved successfully";
    snackbarColor.value = "success";
    snackbar.value = true;
    // Update Pinia store with new report_id if present
    reportStore.setReport({ ...form.value, report_id: result.report_id });
    setTimeout(() => {
      router.push(`/reports/${result.report_id}`);
    }, 1000);
  } catch (err) {
    snackbarText.value = "❌ " + err.message;
    snackbarColor.value = "error";
    snackbar.value = true;
  } finally {
    submitting.value = false;
  }
}
</script>
