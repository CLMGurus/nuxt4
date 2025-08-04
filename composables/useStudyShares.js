import { ref, computed } from "vue";
import { formatDate } from "./utils";
import { useApi } from "./useApi";

export function useStudyShares(user, config) {
  const { apiFetch } = useApi();

  const sharedItems = ref([]);
  const loading = ref(false);
  const search = ref("");
  const filterByMobile = ref(null);
  const filterType = ref([]);

  const typeOptions = ["link", "report"];

  const sharedItemsEndpoint = "/study_shares";

  async function fetchSharedItems() {
    loading.value = true;
    try {
      const data = await apiFetch(`${sharedItemsEndpoint}`, {
        includeUserId: false,
      });

      sharedItems.value = data.study_shares.map((sharedItem) => ({
        shareId: sharedItem.share_id,
        sharedBy: sharedItem.shared_by,
        sharedToMobile: sharedItem.shared_to_mobile,
        type: sharedItem.type,
        reportId: sharedItem.report_id,
        studyId: sharedItem.study_id,
        reportUrl: sharedItem.report_url,
        weasisUrl: sharedItem.weasis_url,
        ohifUrl: sharedItem.ohif_url,
        message: sharedItem.message,
        sharedAt: formatDate(sharedItem.shared_at),
      }));
    } catch (err) {
      console.error("Failed to load shared items", err);
    } finally {
      loading.value = false;
    }
  }

  const filteredSharedItems = computed(() => {
    return sharedItems.value.filter((sharedItem) => {
      const matchType =
        !filterType.value.length || filterType.value.includes(sharedItem.type);

      // const matchType = filterType.value
      //   ? sharedItem.type.toLowerCase() === filterType.value.toLowerCase()
      //   : true;
      const matchMobile = filterByMobile.value
        ? sharedItem.sharedToMobile &&
          sharedItem.sharedToMobile.includes(filterByMobile.value)
        : true;
      return matchType && matchMobile;
    });
  });

  return {
    filteredSharedItems,
    fetchSharedItems,
    loading,
    search,
    typeOptions,
    filterByMobile,
    filterType,
    sharedItems,
  };
}
