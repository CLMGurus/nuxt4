<template>
  <v-sheet
    class="mt-4 ma-md-10 pa-6 pa-md-12"
    border="dashed md"
    color="grey-lighten-5"
    rounded="lg"
  >
    <v-file-input
      v-model="files"
      accept=".dcm,.dicom"
      color="primary"
      counter
      label="Select DICOM files"
      multiple
      prepend-icon="mdi-tray-arrow-up"
      variant="outlined"
      :show-size="1000"
    >
      <template v-slot:selection="{ fileNames }">
        <template v-for="(fileName, index) in fileNames" :key="fileName">
          <v-chip
            v-if="index < 2"
            class="me-2"
            color="primary"
            size="small"
            label
          >
            {{ fileName }}
          </v-chip>

          <span
            v-else-if="index === 2"
            class="text-overline text-grey-darken-3 mx-2"
          >
            +{{ files.length - 2 }} File(s)
          </span>
        </template>
      </template>
    </v-file-input>

    <div class="d-flex flex-column align-center ga-1">
      <v-btn
        color="primary"
        prepend-icon="mdi-file-multiple-outline"
        class="text-none"
        @click="uploadFiles"
        :disabled="!files || files.length === 0"
        :loading="uploading"
        rounded="lg"
        flat
      >
        Upload Files
      </v-btn>

      <p>or</p>

      <v-btn
        color="primary"
        class="text-none"
        @click="openFolderDialog"
        prepend-icon="mdi-folder-outline"
        rounded="lg"
        :disabled="uploading"
        flat
      >
        Select Folder
      </v-btn>

      <!-- Hidden file input for folder -->
      <input
        type="file"
        ref="folderInput"
        style="display: none"
        webkitdirectory
        @change="handleFolderUpload"
      />
    </div>
  </v-sheet>

  <div class="ma-10">
    <v-progress-linear
      class="mt-12"
      v-if="uploading"
      :model-value="progress"
      height="20"
      color="primary"
      striped
    >
      <strong>{{ uploaded.length }}/{{ files.length }}</strong>
    </v-progress-linear>

    <v-alert
      class="mt-8"
      v-if="uploaded.length && !uploading"
      type="success"
      closable
    >
      {{ uploaded.length }} File(s) uploaded successfully
    </v-alert>
  </div>

  <v-alert
    class="mt-8"
    v-if="errors.length && !uploading"
    type="error"
    closable
  >
    {{ errors.length }} File(s) failed to upload
  </v-alert>

  <div v-if="failedFiles.length">
    <h2>Previous Failed Files:</h2>
    <ul>
      <li class="text-error" v-for="(file, index) in failedFiles" :key="index">
        File: {{ file.filename }} -ERROR: {{ file.error }}
      </li>
    </ul>
  </div>

  <div v-if="failedFiles.length && lastFailedFileObjects.length && !uploading">
    <v-btn
      color="warning"
      prepend-icon="mdi-refresh"
      class="mt-4"
      @click="retryFailedFromMemory"
      flat
    >
      Retry Failed Files
    </v-btn>
    <p class="text-caption mt-2">
      ⚠️ If you refreshed the page, please re-select the same folder before
      retrying.
    </p>
  </div>

  <!-- <div v-if="uploaded.length" class="mt-6">
      <p class="font-weight-medium">Uploaded files: {{ uploaded.length }}</p>
      <ul>
        <li v-for="(name, index) in uploaded" :key="index">{{ name }}</li>
      </ul>
    </div> -->

  <!-- <div v-if="errors.length" class="mt-4">
      <p class="font-weight-medium text-error">Failed files:</p>
      <ul>
        <li v-for="(name, index) in errors" :key="index">{{ name }}</li>
      </ul>
    </div> -->
</template>

<script setup>
import { ref } from "vue";

const authStore = useAuthStore();
const emit = defineEmits(["upload-success"]);

const files = ref([]);
const uploaded = ref([]);
const errors = ref([]);
const uploading = ref(false);
const progress = ref(0);
const failedFiles = ref([]);
const lastFailedFileObjects = ref([]);
const parentStudyId = ref(null);

const folderInput = ref(null);
const userId = authStore.user.id;
const userName = authStore.user.fullName;

const config = useRuntimeConfig();

const currentUserEndPoint = config.public.apiV1Endpoint + "/users";
const uploadEndpoint = config.public.apiV1Endpoint + "/studies/uploads";
const logEndpoint = config.public.apiV1Endpoint + "/studies/sessions";
const failedUploadId = `${config.public.apiV1Endpoint}/users/${userId}/failed-upload-id`;
const statusEndpoint = `${config.public.apiV1Endpoint}/users/${userId}/failed-uploads`;

function openFolderDialog() {
  folderInput.value?.click();
}

function handleFolderUpload(event) {
  const folderFiles = Array.from(event.target.files);

  const storedFailed = JSON.parse(localStorage.getItem("failedFiles") || "[]");

  if (storedFailed.length) {
    const failedPaths = new Set(storedFailed.map((f) => f.relative_path));
    const folderPaths = folderFiles.map(
      (file) => file.webkitRelativePath || file.name
    );

    const allMatch =
      storedFailed.length === folderFiles.length &&
      [...failedPaths].every((p) => folderPaths.includes(p));

    if (!allMatch) {
      alert(
        `❌ The folder does not match the originally failed files. Please select the same folder.`
      );
      return;
    }

    files.value = folderFiles;
    lastFailedFileObjects.value = folderFiles;
  } else {
    // fallback if nothing failed
    files.value = folderFiles;
  }
}

function retryFailedFromMemory() {
  if (!lastFailedFileObjects.value.length) {
    alert("No previously failed file objects found in memory.");
    return;
  }

  files.value = [...lastFailedFileObjects.value];
  uploadFiles(); // trigger reupload
}

onMounted(async () => {
  try {
    const response = await fetch(statusEndpoint);
    if (!response.ok) throw new Error("User not found");

    const data = await response.json();
    const backendFailed = data.failed_files || [];

    failedFiles.value = backendFailed;

    // Restore localStorage if cleared
    const localStoredFailed = localStorage.getItem("failedFiles");
    if (!localStoredFailed || localStoredFailed === "[]") {
      if (backendFailed.length) {
        localStorage.setItem("failedFiles", JSON.stringify(backendFailed));
        console.log("💾 Restored failedFiles from backend");
      }
    }

    // Also restore uploadId if missing
    if (!localStorage.getItem("uploadId") && backendFailed.length) {
      const uploadIdResponse = await fetch(failedUploadId);
      const { upload_id } = await uploadIdResponse.json();
      if (upload_id) {
        localStorage.setItem("uploadId", upload_id);
        console.log("💾 Restored uploadId from backend");
      }
    }
  } catch (err) {
    console.error("Error restoring state from backend:", err);
  }
});

async function uploadFiles() {
  if (!files.value.length) return;

  // ❌ Filter out .zip files BEFORE anything else
  files.value = files.value.filter(
    (file) => !file.name.toLowerCase().endsWith(".zip")
  );

  if (!files.value.length) {
    alert(
      "ZIP files are not supported for upload. Please provide the files individually."
    );
    return;
  }

  const filtered = files.value.filter((file) => {
    const name = file.name.toLowerCase();
    const path = (file.webkitRelativePath || file.name).toLowerCase();

    return (
      !name.endsWith(".zip") && // skip .zip files
      !name.startsWith("._") && // skip macOS resource forks
      !path.includes("__macosx") && // skip __MACOSX folder content
      name.endsWith(".dcm") // only allow DICOM files
    );
  });

  if (!filtered.length) {
    alert(
      "❌ No valid DICOM files found. ZIPs and macOS system files were skipped."
    );
    return;
  }

  if (filtered.length !== files.value.length) {
    alert(
      "⚠️ Some files were skipped because they were not valid DICOM files."
    );
  }

  files.value = filtered;

  // 🚫 Strict Retry Validation
  const storedFailed = JSON.parse(localStorage.getItem("failedFiles") || "[]");

  if (storedFailed.length && localStorage.getItem("uploadId")) {
    const failedPaths = new Set(storedFailed.map((f) => f.relative_path));
    const currentPaths = new Set(
      files.value.map((f) => f.webkitRelativePath || f.name)
    );

    const allMatch =
      storedFailed.length === files.value.length &&
      [...failedPaths].every((p) => currentPaths.has(p));

    if (!allMatch) {
      alert(
        `❌ Please re-upload all the originally failed files (${storedFailed.length}). You uploaded ${files.value.length}.`
      );
      return;
    }
  }

  uploading.value = true;
  progress.value = 0;
  uploaded.value = [];
  errors.value = [];

  const allUploadResults = [];
  const BATCH_SIZE = 10;
  const fileList = [...files.value];
  let completed = 0;

  const runBatch = async (batch) => {
    const formData = new FormData();
    for (let file of batch) {
      formData.append("files", file);
      formData.append("paths", file.webkitRelativePath || file.name);
    }

    formData.append("user_id", userId);

    try {
      const response = await fetch(uploadEndpoint, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result?.detail || "Upload failed");

      // Save file upload metadata
      for (let f of result.files) {
        allUploadResults.push(f);
        if (f.status === "uploaded") {
          uploaded.value.push(f.filename);
          if (!parentStudyId.value && f.parent_study) {
            parentStudyId.value = f.parent_study;
          }
        } else {
          errors.value.push(f.filename);
        }
      }
    } catch (err) {
      console.error(err);
      // Mark all batch files as failed if error in network
      for (let file of batch) {
        errors.value.push(file.name);
        allUploadResults.push({
          filename: file.name,
          relative_path: file.webkitRelativePath || file.name,
          status: "failed",
          orthanc_id: null,
          error: err.message,
        });
      }
    } finally {
      completed += batch.length;
      progress.value = Math.round((completed / fileList.length) * 100);
    }
  };

  for (let i = 0; i < fileList.length; i += BATCH_SIZE) {
    const batch = fileList.slice(i, i + BATCH_SIZE);
    await runBatch(batch);
  }

  // 🔁 After all batches are done, send to /log-upload/
  try {
    const uploadid = localStorage.getItem("uploadId");

    const logResponse = await fetch(logEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        user_name: userName,
        upload_id: localStorage.getItem("uploadId") || "",
        organization_id: authStore.currentOrganization.id,
        files: allUploadResults,
      }),
    });

    const logResult = await logResponse.json();
    localStorage.setItem("uploadId", logResult.upload_id);

    if (!logResponse.ok) throw new Error(logResult?.detail || "Log failed");
    console.log("✅ Upload metadata saved:", logResult);
  } catch (e) {
    console.error("❌ Failed to log upload metadata:", e.message);
  }

  uploading.value = false;

  lastFailedFileObjects.value = files.value.filter((file) =>
    errors.value.includes(file.name)
  );

  // Save to localStorage
  const failedMetadata = allUploadResults.filter((f) => f.status === "failed");

  if (failedMetadata.length === 0) {
    // ✅ All files uploaded successfully — cleanup localStorage
    localStorage.removeItem("failedFiles");
    localStorage.removeItem("uploadId");
    failedFiles.value = [];
    lastFailedFileObjects.value = [];
    emit("upload-success");
  } else {
    // ❌ Still have failed files — store for retry
    localStorage.setItem("failedFiles", JSON.stringify(failedMetadata));
    failedFiles.value = failedMetadata;
    lastFailedFileObjects.value = files.value.filter((file) =>
      errors.value.includes(file.name)
    );
  }

  files.value = [];
}
</script>
