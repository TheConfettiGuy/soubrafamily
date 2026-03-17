"use server";

import fs from "node:fs/promises";
import path from "node:path";

export async function saveHonoringConfig(formData: FormData) {
  const raw = formData.get("payload");
  if (!raw || typeof raw !== "string") {
    throw new Error("Missing honoring payload");
  }

  const jsonPath = path.join(process.cwd(), "src/data/honoring.json");
  await fs.writeFile(jsonPath, raw, "utf8");

  return { success: true };
}

/** Collect gallery images from /public/honoring/... like other admin pages */
export async function listHonoringImages() {
  const base = path.join(process.cwd(), "public", "honoring");

  async function walk(dir: string): Promise<string[]> {
    const out: string[] = [];
    let entries;
    try {
      entries = await fs.readdir(dir, { withFileTypes: true });
    } catch {
      return [];
    }
    for (const e of entries) {
      const abs = path.join(dir, e.name);
      if (e.isDirectory()) {
        out.push(...(await walk(abs)));
      } else if (/\.(jpg|jpeg|png|webp|avif)$/i.test(e.name)) {
        const rel = abs.split("public")[1].replace(/\\/g, "/");
        out.push(rel.startsWith("/") ? rel : "/" + rel);
      }
    }
    return out;
  }

  return walk(base);
}
