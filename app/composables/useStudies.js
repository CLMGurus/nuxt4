import { ref, computed } from "vue";
import { formatDate, defaultStatusColor, formatDateFromString } from "./utils";
import { useApi } from "./useApi";

export function useStudies() {
  const { apiFetch } = useApi();

  const records = ref([]);
  const loading = ref(false);
  const search = ref("");
  const filterStatus = ref([]);
  const filterPriority = ref([]);
  const filterModalities = ref([]);

  const statusOptions = ["Ready", "Archived"];

  const studiesEndpoint = "/studies";

  async function fetchStudies() {
    loading.value = true;
    try {
      const data = await apiFetch(`${studiesEndpoint}`, {
        includeUserId: false,
      });

      const studiesArray = Array.isArray(data.studies) ? data.studies : [];

      records.value = studiesArray.map((item) => ({
        studyId: item.id,
        patientId: item.patient_info?.patient_id || "N/A",
        patientName: item.patient_info?.patient_name || "N/A",
        patientDOB:
          item.patient_info?.patient_birth_date &&
          /^\d{8}$/.test(item.patient_info.patient_birth_date)
            ? formatDateFromString(item.patient_info.patient_birth_date)
            : "N/A",
        patientSex: item.patient_info?.patient_sex || "N/A",
        studyInstanceUid: item.patient_info?.study_instance_uid || "N/A",
        studyDescription: item.patient_info?.study_description || "N/A",
        studyDate: item.patient_info?.study_date || "N/A",
        modalities: item.patient_info?.modalities || "N/A",
        uploadedBy: item.user_name,
        uploadedDate: formatDate(item.timestamp),
        status: item.status,
        archived: item.archived ?? false,
      }));
    } catch (err) {
      console.error("Failed to fetch studies:", err);
    } finally {
      loading.value = false;
    }
  }

  function statusColor(status) {
    return defaultStatusColor(status, {
      uploaded: "teal",
      ready: "blue",
      assigned: "orange",
      reported: "green",
      rejected: "deep-orange",
      archived: "gray",
      deleted: "red",
      failed: "red",
    });
  }

  const filteredRecords = computed(() => {
    return records.value.filter((record) => {
      const matchStatus = filterStatus.value.length
        ? filterStatus.value
            .map((s) => s.toLowerCase())
            .includes(record.status.toLowerCase())
        : true;

      const matchModality =
        !filterModalities.value.length ||
        filterModalities.value.some((mod) =>
          (Array.isArray(record.modalities)
            ? record.modalities
            : String(record.modalities).split(",")
          )
            .map((m) => m.trim().toLowerCase())
            .includes(mod.toLowerCase())
        );

      const matchSearch = search.value
        ? [
            record.patientName,
            record.patientId,
            Array.isArray(record.modalities)
              ? record.modalities.join(", ")
              : record.modalities,
            record.studyDescription,
          ]
            .join(" ")
            .toLowerCase()
            .includes(search.value.toLowerCase())
        : true;

      return matchStatus && matchModality && matchSearch;
    });
  });

  return {
    records,
    loading,
    search,
    filterStatus,
    filterPriority,
    filterModalities,
    statusOptions,
    fetchStudies,
    filteredRecords,
    statusColor,
  };
}
