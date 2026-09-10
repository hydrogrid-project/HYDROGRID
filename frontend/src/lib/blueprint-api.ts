import { getDemoPayload, parseBlueprintPayload, payloadToModel, type AppModel } from "./hydrogrid";

const UPLOAD_URL = "http://127.0.0.1:8000/upload-blueprint";

export async function uploadBlueprint(file?: File | null): Promise<AppModel> {
  try {
    const body = new FormData();
    if (file) body.append("file", file);
    body.append("blueprint", file ?? "sample-2bhk");
    const res = await fetch(UPLOAD_URL, { method: "POST", body });
    if (!res.ok) throw new Error(`upload failed ${res.status}`);
    const json = await res.json();
    return payloadToModel(parseBlueprintPayload(json));
  } catch {
    return payloadToModel(getDemoPayload());
  }
}
