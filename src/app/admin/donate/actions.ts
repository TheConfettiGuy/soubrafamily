// src/app/admin/donate/actions.ts
"use server";

import { promises as fs } from "fs";
import path from "path";
import { revalidatePath } from "next/cache";

export type DonateData = {
  pageTitle: string;
  verse: {
    bismillah: string;
    text: string;
    footer: string;
  };
  paragraphs: string[];
  donationInfo: {
    title: string;
    arabic: {
      label: string;
      methods: string[];
      bankTransfer: string;
    };
    bankDetails: {
      accountName: string;
      accountNameEn: string;
      accountNumber: string;
      bank: string;
      bankEn: string;
      branch: string;
      branchEn: string;
      swift: string;
    };
    english: string;
  };
};

const donateJsonPath = path.join(process.cwd(), "src", "data", "donate.json");

export async function saveDonate(formData: FormData) {
  const raw = formData.get("payload");
  if (typeof raw !== "string") {
    console.error("saveDonate: missing payload");
    return;
  }

  let data: DonateData;
  try {
    data = JSON.parse(raw) as DonateData;
  } catch (err) {
    console.error("saveDonate: invalid JSON", err);
    return;
  }

  const json = JSON.stringify(data, null, 2);
  await fs.writeFile(donateJsonPath, json, "utf8");

  // Revalidate public + admin pages if you want
  revalidatePath("/donate");
  revalidatePath("/admin/donate");
}
