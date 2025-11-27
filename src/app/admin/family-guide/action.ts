"use server";

import fs from "node:fs/promises";
import path from "node:path";

export async function saveFamilyGuide(formData: FormData) {
  const payload = formData.get("payload");

  if (typeof payload !== "string") {
    throw new Error("Missing payload");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(payload);
  } catch {
    throw new Error("Invalid JSON payload");
  }

  const filePath = path.join(process.cwd(), "src", "data", "family-guide.json");

  await fs.writeFile(filePath, JSON.stringify(parsed, null, 2), "utf8");
}
