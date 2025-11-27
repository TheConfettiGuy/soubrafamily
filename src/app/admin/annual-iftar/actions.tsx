"use server";

import path from "path";
import fs from "node:fs";
import fsp from "node:fs/promises";

/* ---------- Types ---------- */

export type AnnualIftarEvent = {
  id: string;
  year: string;
  date?: string;
  location?: string;
  image?: string;
  visible?: boolean;
  type?: string; // ✅ NEW (optional)
};

export type AnnualIftarData = {
  title: string;
  description?: string;
  events: AnnualIftarEvent[];
};

/* ---------- Paths ---------- */

const DATA_PATH = path.join(process.cwd(), "src", "data", "annual-iftar.json");

const PUBLIC_ROOT = path.join(process.cwd(), "public");

/* ---------- Helpers ---------- */

function ensureAnnualIftarShape(raw: any): AnnualIftarData {
  if (!raw || typeof raw !== "object") {
    return { title: "الإفطار السنوي", description: "", events: [] };
  }

  return {
    title: String(raw.title ?? "الإفطار السنوي"),
    description: typeof raw.description === "string" ? raw.description : "",
    events: Array.isArray(raw.events)
      ? raw.events.map(
          (ev: any): AnnualIftarEvent => ({
            id: String(ev.id ?? ""),
            year: String(ev.year ?? ""),
            date: String(ev.date ?? ""),
            location: String(ev.location ?? ""),
            image:
              typeof ev.image === "string" && ev.image.length > 0
                ? ev.image
                : undefined,
            visible: typeof ev.visible === "boolean" ? ev.visible : true,
          })
        )
      : [],
  };
}

/* ---------- Public API ---------- */

export async function getAnnualIftar(): Promise<AnnualIftarData> {
  try {
    const raw = await fsp.readFile(DATA_PATH, "utf8");
    const parsed = JSON.parse(raw);
    return ensureAnnualIftarShape(parsed);
  } catch (err) {
    console.error("getAnnualIftar: using fallback", err);
    return { title: "الإفطار السنوي", description: "", events: [] };
  }
}

export async function saveAnnualIftar(formData: FormData) {
  const payload = formData.get("payload");

  if (typeof payload !== "string") {
    return { ok: false as const, error: "البيانات (payload) مفقودة." };
  }

  try {
    const parsed = JSON.parse(payload);
    const data = ensureAnnualIftarShape(parsed);

    await fsp.writeFile(DATA_PATH, JSON.stringify(data, null, 2), "utf8");

    return { ok: true as const };
  } catch (err) {
    console.error("saveAnnualIftar error", err);
    return {
      ok: false as const,
      error: "تعذّر حفظ ملف annual-iftar.json (تأكد من صحة البيانات).",
    };
  }
}

/**
 * Recursively list images under /public/annual-iftar (and subfolders).
 * Returns paths relative to /public, e.g. "annual-iftar/2024/cover.jpg".
 */
export async function listPublicImages(): Promise<string[]> {
  const results: string[] = [];

  function walk(absDir: string, webPrefix: string) {
    const entries = fs.readdirSync(absDir, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory()) {
        // descend into subfolder
        const nextAbs = path.join(absDir, entry.name);
        const nextWeb = webPrefix
          ? path.posix.join(webPrefix, entry.name)
          : entry.name;
        walk(nextAbs, nextWeb);
      } else {
        // keep only image extensions
        if (!/\.(jpe?g|png|webp|gif|avif|svg)$/i.test(entry.name)) continue;

        const webPath = webPrefix
          ? path.posix.join(webPrefix, entry.name)
          : entry.name;

        results.push("/" + webPath); // ensure leading slash for <img src>
      }
    }
  }

  walk(PUBLIC_ROOT, "");

  // sort for nicer UX
  results.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  return results;
}
