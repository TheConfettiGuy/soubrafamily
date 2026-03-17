"use server";

import fs from "node:fs/promises";
import path from "node:path";

function jsonPath(rel: string) {
  return path.join(process.cwd(), "src", "data", rel);
}

/**
 * Save notifications configuration to src/data/notifications.json
 */
export async function saveNotificationsConfig(formData: FormData) {
  const payload = formData.get("payload");

  if (typeof payload !== "string") {
    throw new Error("Missing notifications payload");
  }

  await fs.writeFile(jsonPath("notifications.json"), payload, "utf8");
}
