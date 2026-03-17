"use server";

import fs from "fs/promises";
import path from "path";
import type { ContactData } from "./ui/ContactAdminClientPage";

const CONTACT_JSON_PATH = path.join(
  process.cwd(),
  "src",
  "data",
  "contact.json"
);

export async function saveContactData(formData: FormData) {
  const payload = formData.get("payload");

  if (!payload || typeof payload !== "string") {
    throw new Error("Invalid payload");
  }

  const parsed: ContactData = JSON.parse(payload);

  // Optional: basic safety checks
  if (!parsed.pageTitle || !parsed.organization?.name) {
    throw new Error("Missing required fields in contact data");
  }

  await fs.writeFile(
    CONTACT_JSON_PATH,
    JSON.stringify(parsed, null, 2),
    "utf8"
  );
}
