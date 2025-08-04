<template>
  <v-dialog v-model="props.modelValue" max-width="500">
    <v-card prepend-icon="mdi-share-all" :title="dialogTitle" rounded="lg">
      <v-divider class="mb-4"></v-divider>
      <v-card-text>
        <v-text-field
          prepend-inner-icon="mdi-doctor"
          variant="outlined"
          v-model="localDoctorName"
          label="Doctor Name"
          density="comfortable"
        />
        <v-text-field
          prepend-inner-icon="mdi-whatsapp"
          variant="outlined"
          v-model="localDoctorPhone"
          label="WhatsApp Number"
          prefix="+91"
          type="tel"
          density="comfortable"
        />
        <v-textarea
          variant="outlined"
          v-model="message"
          label="Message"
          hide-details
        />
      </v-card-text>

      <v-card-actions class="mb-2">
        <v-spacer />
        <v-btn
          class="text-none"
          rounded="lg"
          @click="$emit('update:modelValue', false)"
        >
          Close
        </v-btn>
        <v-btn
          variant="flat"
          rounded="lg"
          color="primary"
          class="text-none"
          @click="sendWhatsAppMessage"
          :loading="sending"
        >
          Send
        </v-btn>
      </v-card-actions>
    </v-card>

    <SnackBar
      v-model="snackbar"
      :text="snackbarText"
      :color="snackbarColor"
      :timeout="3000"
    />
  </v-dialog>
</template>
<script setup>
import { ref, computed } from "vue";
import { useAuthStore } from "~/stores/auth";

const emit = defineEmits(["update:modelValue"]);

const config = useRuntimeConfig();
const authStore = useAuthStore();

// Props
const props = defineProps({
  modelValue: Boolean,
  mode: { type: String, required: true }, // "link" or "report"
  payloadData: { type: Object, required: true }, // holds props for either mode
});

// Local state
const localDoctorName = ref("");
const localDoctorPhone = ref("");
const message = ref("");

const snackbar = ref(false);
const snackbarText = ref("");
const snackbarColor = ref("success");
const sending = ref(false);

// Computed dialog title
const dialogTitle = computed(() =>
  props.mode === "link" ? "Share Study Link" : "Share Report"
);

// Send message handler
async function sendWhatsAppMessage() {
  if (!localDoctorPhone.value || !localDoctorName.value) {
    snackbarText.value = "Please enter doctor name and phone.";
    snackbarColor.value = "warning";
    snackbar.value = true;
    return;
  }

  try {
    sending.value = true;

    console.log(props);

    const payload =
      props.mode === "link"
        ? {
            study_id: props.payloadData.studyId,
            patient_name: props.payloadData.patientName,
            doctor_name: localDoctorName.value,
            doctor_number: localDoctorPhone.value,
            modality: props.payloadData.modality,
            anatomical_region: props.payloadData.anatomicalRegion,
            desktop_url: props.payloadData.weasisUrl,
            mobile_url: props.payloadData.ohifUrl,
          }
        : {
            report_id: props.payloadData.reportId,
            study_id: props.payloadData.studyId,
            patient_name: props.payloadData.patientName,
            doctor_name: localDoctorName.value,
            doctor_number: localDoctorPhone.value,
            anatomical_region: props.payloadData.anatomicalRegion,
            modality: props.payloadData.modality,
            detailed_findings: props.payloadData.detailedFindings,
            impressions: props.payloadData.impressions,
            recommendations: props.payloadData.recommendations,
          };

    const shareEndpoint =
      props.mode === "link"
        ? `${config.public.apiV1Endpoint}/share/whatsapp/link`
        : `${config.public.apiV1Endpoint}/share/whatsapp/report`;

    console.log(payload);

    const res = await fetch(shareEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.detail || "Failed to send message");
    }

    // Save log to DB
    const savePayload =
      props.mode === "link"
        ? {
            user_id: authStore.user.id,
            organization_id: authStore.currentOrganization.id,
            shared_by: authStore.user.fullName,
            shared_to_mobile: localDoctorPhone.value,
            type: "link",
            study_id: props.payloadData.studyId,
            weasis_url: props.payloadData.weasisUrl,
            ohif_url: props.payloadData.ohifUrl,
            message: `Study shared with Dr. ${localDoctorName.value}`,
          }
        : {
            user_id: authStore.user.id,
            organization_id: authStore.currentOrganization.id,
            shared_by: authStore.user.fullName,
            shared_to_mobile: localDoctorPhone.value,
            type: "report",
            report_id: props.payloadData.reportId,
            report_url: props.payloadData.reportUrl,
            message: message.value,
          };

    await fetch(`${config.public.apiV1Endpoint}/study_shares`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(savePayload),
    });

    snackbarText.value = "✅ WhatsApp message sent!";
    snackbarColor.value = "success";
    snackbar.value = true;
    setTimeout(() => {
      sending.value = false;
      emit("update:modelValue", false);
    }, 1000);
  } catch (err) {
    snackbarText.value = `❌ ${err.message}`;
    snackbarColor.value = "error";
    snackbar.value = true;
    sending.value = false;
  }
}
</script>
