import { fetchAndRedirect, errorHtml } from "#imports";

export default defineEventHandler(async (event) => {
  const { studyUId } = event.context.params!;
  const fastApiBase = process.env.NUXT_PUBLIC_API_V1_BASE;

  if (!studyUId) return errorHtml("Missing study UID");

  return await fetchAndRedirect(
    `${fastApiBase}/dicom-view/study/${studyUId}`,
    event
  );
});
