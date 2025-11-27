"use server";

import fs from "node:fs/promises";
import path from "node:path";

const DATA_PATH = path.join(process.cwd(), "src", "data", "rules.json");

export async function saveRules(formData: FormData) {
  const payload = formData.get("payload");
  if (typeof payload !== "string") {
    throw new Error("Missing payload");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(payload);
  } catch (err) {
    console.error("Invalid JSON payload for rules:", err);
    throw new Error("Invalid JSON");
  }

  const pretty = JSON.stringify(parsed, null, 2);
  await fs.writeFile(DATA_PATH, pretty, "utf8");

  return { ok: true };
}
