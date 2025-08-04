import { ref } from "vue";
import { useApi } from "./useApi";
import { formatDate } from "./utils";

export function useDashboard() {
  const summary = ref("");
  const loading = ref(false);
  const barData = ref(null);
  const pieData = ref(null);
  const recentUploads = ref([]);
  const studiesWithoutReports = ref([]);

  const { apiFetch } = useApi();

  async function fetchSummary() {
    loading.value = true;
    try {
      const data = await apiFetch("/dashboard/summary", {
        includeUserId: false,
      });
      summary.value = {
        totalStudies: data.total_studies,
        reportsCreated: data.reports_created,
        pendingReports: data.pending_reports,
        totalShared: data.total_shared,
      };
    } catch (err) {
      console.error("Failed to fetch summary:", err);
    } finally {
      loading.value = false;
    }
  }

  async function fetchStudiesPerDay() {
    loading.value = true;
    try {
      const chartData = await apiFetch("/dashboard/studies-per-day", {
        includeUserId: false,
      });
      barData.value = {
        labels: chartData.labels,
        datasets: [
          {
            label: "Studies Uploaded",
            data: chartData.data,
            backgroundColor: "#aed027",
          },
        ],
      };
    } catch (err) {
      console.error("Failed to fetch studies per day:", err);
    } finally {
      loading.value = false;
    }
  }

  async function fetchReportStatus() {
    loading.value = true;
    try {
      const response = await apiFetch("/dashboard/report-status", {
        includeUserId: false,
      });
      pieData.value = {
        labels: response.labels,
        datasets: [
          {
            data: response.data,
            backgroundColor: ["#66BB6A", "#FFA726"],
          },
        ],
      };
    } catch (err) {
      console.error("Failed to fetch report status:", err);
    } finally {
      loading.value = false;
    }
  }

  async function fetchRecentUploads() {
    loading.value = true;
    try {
      const data = await apiFetch("/dashboard/recent-uploads", {
        includeUserId: false,
      });
      recentUploads.value = data.map((item) => ({
        study_id: item.study_id,
        timestamp: formatDate(item.timestamp),
        patient_name: item.patient_name || "N/A",
        modalities: item.modalities,
        anatomical_region: item.anatomical_region,
      }));
    } catch (err) {
      console.error("Failed to fetch recent uploads:", err);
    } finally {
      loading.value = false;
    }
  }

  async function fetchStudiesWithoutReports() {
    loading.value = true;
    try {
      const data = await apiFetch("/dashboard/studies-without-reports", {
        includeUserId: false,
      });
      studiesWithoutReports.value = data.map((item) => ({
        study_id: item.study_id,
        timestamp: formatDate(item.timestamp),
        patient_name: item.patient_name || "N/A",
        modalities: item.modalities,
        anatomical_region: item.anatomical_region,
      }));
    } catch (err) {
      console.error("Failed to fetch studies without reports:", err);
    } finally {
      loading.value = false;
    }
  }

  return {
    summary,
    barData,
    pieData,
    recentUploads,
    studiesWithoutReports,
    loading,
    fetchSummary,
    fetchStudiesPerDay,
    fetchReportStatus,
    fetchRecentUploads,
    fetchStudiesWithoutReports,
  };
}
