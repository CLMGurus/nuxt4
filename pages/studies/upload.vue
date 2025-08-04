<template>
  <v-container class="pa-md-8" fluid>
    <v-breadcrumbs :items="items"></v-breadcrumbs>
    <v-card rounded="xl" flat class="pa-6">
      <v-card-title>
        <v-list-item
          class="pa-0"
          subtitle="Upload and manage the DICOM files"
          title="Upload studies"
        >
          <template v-slot:prepend>
            <v-avatar color="accent" size="large">
              <v-icon
                color="primary"
                icon="mdi-file-upload"
                size="small"
              ></v-icon>
            </v-avatar>
          </template>
        </v-list-item>
      </v-card-title>

      <DicomUploader @upload-success="goToStudies" />
    </v-card>
  </v-container>
</template>

<script setup>
import DicomUploader from "~/components/DicomUploader.vue";

const items = [
  {
    title: "All Studies",
    disabled: false,
    to: "/studies",
  },
  {
    title: "Upload",
    disabled: true,
  },
];

function goToStudies() {
  setTimeout(() => {
    navigateTo(`/studies`);
  }, 1000);
}
</script>
