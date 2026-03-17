"use server";

import fs from "node:fs/promises";
import path from "node:path";

function jsonPath(rel: string) {
  return path.join(process.cwd(), "src", "data", rel);
}

export async function saveHeroConfig(formData: FormData) {
  const payload = formData.get("payload");
  if (typeof payload !== "string") {
    throw new Error("Missing hero payload");
  }

  await fs.writeFile(jsonPath("hero.json"), payload, "utf8");
}

export async function saveWelcomeConfig(formData: FormData) {
  const payload = formData.get("payload");
  if (typeof payload !== "string") {
    throw new Error("Missing welcome payload");
  }

  await fs.writeFile(jsonPath("welcoming-letter.json"), payload, "utf8");
}
