export async function fetchAndRedirect(url: string, event: any) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to get URL");

    const weasisUrl = await res.text();
    return sendRedirect(event, weasisUrl, 302);
  } catch (err) {
    console.error("Weasis launch error:", err);
    return errorHtml("Unable to launch viewer");
  }
}

export function errorHtml(message: string) {
  return `<html><body><h3>${message}</h3></body></html>`;
}
