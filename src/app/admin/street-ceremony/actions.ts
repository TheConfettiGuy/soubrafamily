"use server";

import fs from "node:fs/promises";
import path from "node:path";
import { revalidatePath } from "next/cache";

const DATA_PATH = path.join(
  process.cwd(),
  "src",
  "data",
  "street-ceremony.json"
);

export type StreetCeremonyData = {
  visible?: boolean;
  title: string;
  description?: string;
  tabs?: { text?: string; photos?: string };
  text?: {
    heading?: string;
    visible?: boolean;
    paragraphs?: string[];
  };
  gallery?: {
    heading?: string;
    visible?: boolean;
    folder?: string;
  };
};

export async function getStreetCeremony(): Promise<StreetCeremonyData> {
  const raw = await fs.readFile(DATA_PATH, "utf8");
  return JSON.parse(raw) as StreetCeremonyData;
}

export async function saveStreetCeremony(formData: FormData) {
  const payload = formData.get("payload");
  if (typeof payload !== "string") {
    return { ok: false, error: "Invalid payload" };
  }

  // Basic sanity: must be valid JSON
  let parsed: any;
  try {
    parsed = JSON.parse(payload);
  } catch {
    return { ok: false, error: "JSON parse failed" };
  }

  await fs.writeFile(DATA_PATH, JSON.stringify(parsed, null, 2), "utf8");

  // Revalidate public + admin routes
  revalidatePath("/activities/street-ceremony");
  revalidatePath("/admin/street-ceremony");

  return { ok: true };
}

/* Recursively list images under /public */
export async function listPublicImages(): Promise<string[]> {
  const root = path.join(process.cwd(), "public");

  async function walk(dirAbs: string): Promise<string[]> {
    const entries = await fs.readdir(dirAbs, { withFileTypes: true });
    const out: string[] = [];

    for (const e of entries) {
      const abs = path.join(dirAbs, e.name);
      if (e.isDirectory()) {
        out.push(...(await walk(abs)));
      } else if (e.isFile() && /\.(jpe?g|png|webp|avif|gif)$/i.test(e.name)) {
        const rel = path.relative(root, abs).split(path.sep).join("/");
        out.push(rel.startsWith("/") ? rel : `/${rel}`); // return "/xxx/yyy.jpg"
      }
    }
    return out;
  }

  const all = await walk(root);
  return all.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}
