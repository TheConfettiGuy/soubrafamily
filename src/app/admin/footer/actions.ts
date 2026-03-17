"use server";

import fs from "node:fs/promises";
import path from "node:path";

const FOOTER_JSON = path.join(process.cwd(), "src", "data", "footer.json");

export async function saveFooterConfig(formData: FormData) {
  try {
    const payload = formData.get("payload");
    if (!payload || typeof payload !== "string") {
      throw new Error("Invalid payload");
    }

    await fs.writeFile(FOOTER_JSON, payload, "utf8");

    return { success: true };
  } catch (err) {
    console.error("Error saving footer config:", err);
    return {
      success: false,
      message: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
