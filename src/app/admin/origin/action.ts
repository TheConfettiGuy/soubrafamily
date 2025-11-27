"use server";

import { revalidatePath } from "next/cache";
import { writeFile } from "node:fs/promises";
import path from "node:path";

function resolveOriginJsonPath() {
  // Your app imports it as "@/data/origin.json" → that’s usually "src/data/origin.json"
  // If your project root differs, tweak this to match.
  return path.join(process.cwd(), "src", "data", "origin.json");
}

export async function saveOrigin(formData: FormData) {
  const raw = formData.get("payload");
  if (typeof raw !== "string" || !raw.trim()) {
    throw new Error("Missing payload");
  }

  // Basic validation: must parse to an object with sections array
  let parsed: any;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("Invalid JSON payload");
  }
  if (
    !parsed ||
    typeof parsed !== "object" ||
    !Array.isArray(parsed.sections)
  ) {
    throw new Error("Payload shape is invalid");
  }

  const filePath = resolveOriginJsonPath();
  await writeFile(filePath, JSON.stringify(parsed, null, 2), "utf-8");

  // Revalidate public page and this admin page
  revalidatePath("/family/origin"); // your public route
  revalidatePath("/admin/origin");
}
