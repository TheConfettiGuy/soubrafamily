"use server";

import fs from "node:fs";
import path from "node:path";

const PUBLIC_ROOT = path.join(process.cwd(), "public");

const IMAGE_EXT = /\.(png|jpe?g|webp|gif|svg|avif)$/i;

function safeResolve(rel: string) {
  const cleaned = rel.replace(/^\/+/, "");
  const full = path.join(PUBLIC_ROOT, cleaned);
  if (!full.startsWith(PUBLIC_ROOT)) {
    throw new Error("Path outside public/");
  }
  return full;
}

/* ---------- Types ---------- */

export type ImageFile = {
  type: "file";
  name: string;
  path: string; // relative to public
  size: number;
};

export type ImageFolder = {
  type: "dir";
  name: string;
  path: string; // relative to public
  children: Array<ImageFolder | ImageFile>;
};

export type ImageTree = ImageFolder;

/* ---------- Helpers ---------- */

function readFolder(relPath = ""): ImageFolder {
  const abs = safeResolve(relPath);
  const name = relPath === "" ? "public" : path.basename(relPath);
  const children: Array<ImageFolder | ImageFile> = [];

  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(abs, { withFileTypes: true });
  } catch {
    return { type: "dir", name, path: relPath, children: [] };
  }

  for (const e of entries) {
    if (e.name.startsWith(".")) continue;
    const childRel = path.posix.join(relPath, e.name);

    if (e.isDirectory()) {
      children.push(readFolder(childRel));
    } else if (IMAGE_EXT.test(e.name)) {
      const stat = fs.statSync(path.join(abs, e.name));
      children.push({
        type: "file",
        name: e.name,
        path: childRel,
        size: stat.size,
      });
    }
  }

  children.sort((a, b) => {
    if (a.type !== b.type) return a.type === "dir" ? -1 : 1;
    return a.name.localeCompare(b.name, "ar");
  });

  return { type: "dir", name, path: relPath, children };
}

/* ---------- Actions ---------- */

export async function listImages(root: string = ""): Promise<ImageTree> {
  return readFolder(root);
}

export async function deleteItem(relPath: string) {
  const abs = safeResolve(relPath);
  try {
    const stat = fs.statSync(abs);
    if (stat.isDirectory()) {
      fs.rmSync(abs, { recursive: true, force: true });
    } else {
      fs.unlinkSync(abs);
    }
  } catch {
    // ignore
  }
}

export async function createFolder(parentRel: string, folderName: string) {
  const safeName = folderName.trim().replace(/[\/\\]/g, "-");
  if (!safeName) return;

  const rel = path.posix.join(parentRel, safeName);
  const abs = safeResolve(rel);

  if (!fs.existsSync(abs)) {
    fs.mkdirSync(abs, { recursive: true });
  }
}

export async function renameItem(relPath: string, newName: string) {
  const safeName = newName.trim().replace(/[\/\\]/g, "-");
  if (!safeName) return;

  const oldAbs = safeResolve(relPath);
  const dirRel = path.posix.dirname(relPath);
  const newRel = path.posix.join(dirRel, safeName);
  const newAbs = safeResolve(newRel);

  if (oldAbs === newAbs) return;

  fs.renameSync(oldAbs, newAbs);
}

/** Upload a single image into the given parent folder */
export async function uploadImage(formData: FormData) {
  const parentRel = (formData.get("parent") as string) ?? "";
  const file = formData.get("file") as File | null;

  if (!file) return;

  const buf = Buffer.from(await file.arrayBuffer());
  const safeName = file.name.replace(/[\/\\]/g, "-");
  const rel = path.posix.join(parentRel, safeName);
  const abs = safeResolve(rel);

  const parentAbs = path.dirname(abs);
  if (!fs.existsSync(parentAbs)) {
    fs.mkdirSync(parentAbs, { recursive: true });
  }

  fs.writeFileSync(abs, buf);
}
