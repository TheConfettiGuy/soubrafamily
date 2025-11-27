"use server";

import { revalidatePath } from "next/cache";
import { writeFile } from "node:fs/promises";
import path from "node:path";

// If you're using NextAuth protection, uncomment these and add the check below:
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";

function navbarPath() {
  return path.join(process.cwd(), "src", "data", "navbar.json");
}

export async function saveNavbar(fd: FormData) {
  // // 🔒 Optional auth gate:
  // const session = await getServerSession(authOptions);
  // if (!session || (session as any).user?.role !== "admin") {
  //   throw new Error("Unauthorized");
  // }

  const raw = fd.get("payload");
  if (typeof raw !== "string") throw new Error("Missing payload");

  let parsed: any;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("Invalid JSON");
  }

  if (
    !parsed ||
    typeof parsed !== "object" ||
    !parsed.topBar ||
    !Array.isArray(parsed.items)
  ) {
    throw new Error("Invalid navbar shape");
  }

  await writeFile(navbarPath(), JSON.stringify(parsed, null, 2), "utf-8");

  // Revalidate layout (so the public NavBar updates) and the admin page
  revalidatePath("/", "layout");
  revalidatePath("/admin/navbar");
}
