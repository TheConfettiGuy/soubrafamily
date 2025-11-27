// app/admin/actions.ts
"use server";

import fs from "node:fs/promises";
import path from "node:path";

// If you already have this helper / constants, reuse them instead of duplicating
const DATA_DIR = path.join(process.cwd(), "src", "data");

async function writeJsonFile(filename: string, data: unknown) {
  const fullPath = path.join(DATA_DIR, filename);
  const json = JSON.stringify(data, null, 2);
  await fs.writeFile(fullPath, json, "utf8");
}

/* ------------------------------------------------------------------ */
/*  NEW: saveFamilyTree                                               */
/* ------------------------------------------------------------------ */
export async function saveFamilyTree(formData: FormData) {
  const raw = formData.get("payload");
  if (typeof raw !== "string") {
    throw new Error("Invalid payload");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("Payload is not valid JSON");
  }

  await writeJsonFile("family-tree.json", parsed);
}
