import { ref, computed } from "vue";
import {
  formatDate,
  defaultStatusColor,
  defaultTypeColor,
  modalities as modalitiesOptions,
} from "./utils";

import { useApi } from "./useApi";

export function useReports() {
  const { apiFetch } = useApi();

  const reports = ref([]);
  const loading = ref(true);

  const search = ref("");
  const filterStatus = ref([]);
  const filterTypes = ref([]);
  const filterModalities = ref([]);
  const filterRadiologist = ref(null);

  const statusOptions = ["draft", "approved", "rejected"];
  const typeOptions = ["preliminary", "addendum", "final"];
  const radiologistOptions = ref([]);

  const reportsEndpoint = "/reports";

  async function fetchReports() {
    loading.value = true;
    try {
      const data = await apiFetch(`${reportsEndpoint}`, {
        includeUserId: false,
      });

      const names = new Set();

      reports.value = (data.reports || []).map((report) => {
        if (report.radiologist_name) names.add(report.radiologist_name);

        return {
          report_id: report.report_id,
          study_id: report.study_id,
          radiologist_name: report.radiologist_name || "N/A",
          patient_name: report.patient_name || "N/A",
          modalities: report.modalities || "N/A",
          anatomical_region: report.anatomical_region || "N/A",
          clinical_findings: report.clinical_findings || "N/A",
          clinical_symptoms: report.clinical_symptoms || "N/A",
          report_content: report.report_html || "N/A",
          type: report.type || "N/A",
          status: report.status || "N/A",
          created_at: formatDate(report.created_at),
          updated_at: formatDate(report.updated_at),
        };
      });

      radiologistOptions.value = Array.from(names);
    } catch (err) {
      console.error("Error loading reports", err);
    } finally {
      loading.value = false;
    }
  }

  const filteredReports = computed(() => {
    return reports.value.filter((report) => {
      const matchStatus =
        !filterStatus.value.length ||
        filterStatus.value.includes(report.status);

      const matchType =
        !filterTypes.value.length || filterTypes.value.includes(report.type);

      const matchRadiologist =
        !filterRadiologist.value ||
        report.radiologist_name === filterRadiologist.value;

      const matchModality =
        !filterModalities.value.length ||
        filterModalities.value.some((mod) =>
          (Array.isArray(report.modalities)
            ? report.modalities
            : String(report.modalities).split(",")
          )
            .map((m) => m.trim().toLowerCase())
            .includes(mod.toLowerCase())
        );

      const matchSearch = search.value
        ? [
            report.patient_name,
            report.modalities,
            report.anatomical_region,
            report.clinical_findings,
            report.clinical_symptoms,
            report.radiologist_name,
          ]
            .join(" ")
            .toLowerCase()
            .includes(search.value.toLowerCase())
        : true;

      return (
        matchStatus &&
        matchType &&
        matchRadiologist &&
        matchModality &&
        matchSearch
      );
    });
  });

  function statusColor(status) {
    return defaultStatusColor(status, {
      approved: "green",
      draft: "blue",
      rejected: "red",
    });
  }

  function typeColor(type) {
    return defaultTypeColor(type, {
      preliminary: "blue",
      addendum: "purple",
      final: "green",
    });
  }

  return {
    reports,
    loading,
    search,
    filterStatus,
    filterTypes,
    filterModalities,
    filterRadiologist,
    statusOptions,
    modalitiesOptions,
    typeOptions,
    radiologistOptions,
    fetchReports,
    filteredReports,
    statusColor,
    typeColor,
  };
}
