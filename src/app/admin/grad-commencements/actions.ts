"use server";

import fs from "node:fs/promises";
import path from "node:path";
import { revalidatePath } from "next/cache";

/* ---------- Types (match graduation.json) ---------- */

export type YearList = {
  key: string; // e.g. "cat1"
  title: string; // e.g. "المتفوقون"
  names: string[]; // array of names
};

export type YearBlock = {
  year: string; // e.g. "2024"
  lists: YearList[];
  /** إذا كانت false صراحةً → لا تظهر السنة في واجهة الموقع */
  visible?: boolean;
};

export type GraduationData = {
  years: YearBlock[];
};

/* ---------- JSON path ---------- */

const DATA_PATH = path.join(process.cwd(), "src", "data", "graduation.json");

/* ---------- Helpers ---------- */

async function readFileSafe(): Promise<string | null> {
  try {
    return await fs.readFile(DATA_PATH, "utf8");
  } catch {
    return null;
  }
}

/* ---------- Actions ---------- */

export async function getGraduationData(): Promise<GraduationData> {
  const raw = await readFileSafe();
  if (!raw) {
    return { years: [] };
  }

  try {
    const parsed = JSON.parse(raw) as GraduationData;
    if (!parsed.years || !Array.isArray(parsed.years)) {
      return { years: [] };
    }
    return parsed;
  } catch {
    return { years: [] };
  }
}

/**
 * Save graduation.json from a FormData payload
 * - expects "payload" field containing the JSON as string
 */
export async function saveGraduation(formData: FormData) {
  const payload = formData.get("payload");
  if (typeof payload !== "string") {
    return { ok: false, error: "لم يتم إرسال بيانات صالحة." };
  }

  try {
    const parsed = JSON.parse(payload) as GraduationData;

    if (!parsed.years || !Array.isArray(parsed.years)) {
      throw new Error("Missing 'years' array in payload");
    }

    await fs.writeFile(DATA_PATH, JSON.stringify(parsed, null, 2), "utf8");
    revalidatePath("/activities/grad-commencements");

    return { ok: true };
  } catch (err: any) {
    console.error("Failed to save graduation.json:", err);
    return {
      ok: false,
      error: "تعذّر حفظ الملف. تأكد من صحة البيانات.",
    };
  }
}
