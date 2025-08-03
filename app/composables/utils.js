export function formatDate(timestamp) {
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatDateFromString(dateStr) {
  if (!/^\d{8}$/.test(dateStr)) return "Invalid Date";

  const year = dateStr.substring(0, 4);
  const month = dateStr.substring(4, 6);
  const day = dateStr.substring(6, 8);

  const date = new Date(`${year}-${month}-${day}`);

  if (isNaN(date.getTime())) return "Invalid Date";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date); // returns "25 Oct 1995"
}

export function defaultStatusColor(status, map = {}) {
  return map[status] || "grey";
}

export function defaultTypeColor(type, map = {}) {
  return map[type] || "grey";
}

export const modalities = [
  "CR", // Computed Radiography
  "CT", // Computed Tomography
  "DX", // Digital Radiography
  "MG", // Mammography
  "MR", // Magnetic Resonance Imaging
  "NM", // Nuclear Medicine
  "OT", // Other
  "PT", // Positron Emission Tomography
  "RF", // Radio Fluoroscopy
  "RG", // Radiographic Imaging (fluoroscopy)
  "RTIMAGE", // Radiotherapy Image
  "SM", // Slide Microscopy
  "US", // Ultrasound
  "XA", // X-Ray Angiography
  "XC", // External Camera Photography
  "XR", // X-Ray (General)
];

export function parseMedicalReport(htmlContent) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, "text/html");

  const getTextAfterHeading = (headingText) => {
    const headings = Array.from(doc.querySelectorAll("h3"));
    for (const heading of headings) {
      if (
        heading.textContent.trim().toLowerCase() === headingText.toLowerCase()
      ) {
        let el = heading.nextElementSibling;
        if (el?.tagName === "P") return el.textContent.trim();
      }
    }
    return "";
  };

  const getListAfterHeading = (headingText) => {
    const headings = Array.from(doc.querySelectorAll("h3"));
    for (const heading of headings) {
      if (
        heading.textContent.trim().toLowerCase() === headingText.toLowerCase()
      ) {
        const ul = heading.nextElementSibling;
        if (ul?.tagName === "UL") {
          return Array.from(ul.querySelectorAll("li")).map((li) =>
            li.textContent.trim()
          );
        }
      }
    }
    return [];
  };

  const impression = getTextAfterHeading("Impression");
  const findings = getListAfterHeading("Detailed Findings");
  const recommendations = getListAfterHeading("Recommendations");

  return {
    impression,
    findings,
    recommendations,
  };
}
