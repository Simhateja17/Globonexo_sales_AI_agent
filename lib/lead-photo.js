import { normalizeUrl } from "./validation";

// The photo Apollo gave us for a lead, or "" when there is none. Only https
// links pass, so an imported value can never load over plain http.
export function leadPhoto(lead) {
  const raw = lead?.rawData;
  const candidate = lead?.photoUrl
    || (raw && typeof raw === "object" ? raw.photo_url || raw.photoUrl || raw["Photo Url"] : "");
  let url = "";
  try {
    url = normalizeUrl(candidate);
  } catch {
    return "";
  }
  return url.startsWith("https://") ? url : "";
}
