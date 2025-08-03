import { fetchAndRedirect, errorHtml } from "#imports";

export default defineEventHandler(async (event) => {
  const { patientId } = event.context.params!;
  const fastApiBase = process.env.NUXT_PUBLIC_API_V1_BASE;

  if (!patientId) return errorHtml("Missing patient ID");

  return await fetchAndRedirect(
    `${fastApiBase}/dicom-view/patient/${patientId}`,
    event
  );
});
