"use client";

import { useState, useTransition } from "react";
import {
  ImageTree,
  ImageFolder,
  ImageFile,
  listImages,
  deleteItem,
  createFolder,
  renameItem,
  uploadImage,
} from "../actions";

const blueBtn =
  "bg-main-100 text-white cursor-pointer px-3 py-2 text-sm whitespace-nowrap";
const redBtn =
  "bg-red-50 text-red-700 cursor-pointer px-3 py-2 text-sm whitespace-nowrap";

type Props = { initialTree: ImageTree };

function findFolder(tree: ImageFolder, path: string): ImageFolder | null {
  if (tree.path === path) return tree;
  for (const ch of tree.children) {
    if (ch.type === "dir") {
      const found = findFolder(ch, path);
      if (found) return found;
    }
  }
  return null;
}

export default function ImagesAdminClient({ initialTree }: Props) {
  const [tree, setTree] = useState<ImageTree>(initialTree);
  const [currentPath, setCurrentPath] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  const currentFolder = findFolder(tree, currentPath) ?? (tree as ImageFolder);

  async function refresh() {
    const fresh = await listImages("");
    setTree(fresh);
  }

  function handleSelectFolder(path: string) {
    setCurrentPath(path);
  }

  function handleDelete(item: ImageFolder | ImageFile) {
    if (
      !confirm(
        item.type === "dir"
          ? `حذف المجلد "${item.name}" مع كل ما يحتويه؟`
          : `حذف الصورة "${item.name}"؟`
      )
    )
      return;

    startTransition(async () => {
      await deleteItem(item.path);
      await refresh();
    });
  }

  function handleCreateFolder() {
    const name = prompt("اسم المجلد الجديد:");
    if (!name) return;
    startTransition(async () => {
      await createFolder(currentFolder.path, name);
      await refresh();
    });
  }

  function handleRename(item: ImageFolder | ImageFile) {
    const name = prompt("اسم جديد:", item.name);
    if (!name || name === item.name) return;
    startTransition(async () => {
      await renameItem(item.path, name);
      await refresh();
    });
  }

  async function handleUpload(formData: FormData) {
    formData.set("parent", currentFolder.path);
    await uploadImage(formData);
    await refresh();
  }

  /* ---------- UI helpers ---------- */

  const breadCrumbs = (() => {
    const parts = currentFolder.path ? currentFolder.path.split("/") : [];
    const crumbs = [{ name: "public", path: "" }];
    let acc = "";
    for (const p of parts) {
      acc = acc ? `${acc}/${p}` : p;
      crumbs.push({ name: p, path: acc });
    }
    return crumbs;
  })();

  function renderFolderTree(folder: ImageFolder, depth = 0) {
    const isActive = folder.path === currentPath;
    return (
      <div key={folder.path || "root"} className="mb-1">
        <button
          type="button"
          onClick={() => handleSelectFolder(folder.path)}
          className={`w-full text-right px-2 py-1 text-sm ${
            isActive ? "bg-main-100 text-white" : "hover:bg-gray-100"
          }`}
          style={{ paddingRight: 8 + depth * 12 }}
        >
          {folder.name === "public" ? "public/" : folder.name + "/"}
        </button>
        {folder.children
          .filter((c) => c.type === "dir")
          .map((c) => renderFolderTree(c as ImageFolder, depth + 1))}
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <section className="border bg-white p-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold mb-1">مدير الصور</h1>
          <p className="text-sm text-gray-600">
            إدارة كل الصور والمجلدات داخل <code>public/</code>
          </p>
        </div>
        {isPending && (
          <span className="text-xs text-gray-500">جاري التنفيذ…</span>
        )}
      </section>

      {/* Layout */}
      <section className="grid md:grid-cols-[260px_1fr] gap-4">
        {/* Sidebar: folders */}
        <div className="border bg-white p-3">
          <h2 className="text-sm font-medium mb-2">المجلدات</h2>
          <div className="text-xs text-gray-500 mb-2">
            اختر مجلداً من القائمة
          </div>
          <div className="max-h-[480px] overflow-auto text-sm">
            {renderFolderTree(tree)}
          </div>
        </div>

        {/* Main panel */}
        <div className="border bg-white p-4 space-y-4">
          {/* Breadcrumb + actions */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm text-gray-600 flex flex-wrap gap-1">
              {breadCrumbs.map((c, i) => (
                <span key={c.path || "root"} className="flex items-center">
                  {i > 0 && <span className="mx-1 text-gray-400">/</span>}
                  <button
                    type="button"
                    onClick={() => handleSelectFolder(c.path)}
                    className="hover:underline"
                  >
                    {c.name || "public"}
                  </button>
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className={blueBtn}
                onClick={handleCreateFolder}
              >
                + مجلد جديد
              </button>

              {/* Upload form */}
              <form action={handleUpload} className="flex items-center gap-2">
                <input
                  name="file"
                  type="file"
                  accept="image/*"
                  className={blueBtn}
                  required
                  
                />
                <button type="submit" className={blueBtn}>
                  رفع صورة
                </button>
              </form>
            </div>
          </div>

          {/* Folder content */}
          <div className="border-t pt-4">
            <h3 className="text-sm font-medium mb-3">
              محتويات:{" "}
              <span className="font-normal text-gray-700">
                {currentFolder.path || "public/"}
              </span>
            </h3>

            {currentFolder.children.length === 0 && (
              <p className="text-sm text-gray-500">
                لا يوجد عناصر في هذا المجلد.
              </p>
            )}

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentFolder.children.map((item) => {
                if (item.type === "dir") {
                  const f = item as ImageFolder;
                  return (
                    <div
                      key={f.path}
                      className="border p-3 flex flex-col justify-between"
                    >
                      <div>
                        <div className="font-medium text-sm mb-1">
                          📁 {f.name}
                        </div>
                        <div className="text-xs text-gray-500 mb-2">
                          مجلد فرعي
                        </div>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <button
                          type="button"
                          className={blueBtn}
                          onClick={() => handleSelectFolder(f.path)}
                        >
                          فتح
                        </button>
                        <button
                          type="button"
                          className={blueBtn}
                          onClick={() => handleRename(f)}
                        >
                          إعادة تسمية
                        </button>
                        <button
                          type="button"
                          className={redBtn}
                          onClick={() => handleDelete(f)}
                        >
                          حذف
                        </button>
                      </div>
                    </div>
                  );
                }

                const file = item as ImageFile;
                const url = "/" + file.path.replace(/^\/+/, "");

                return (
                  <div key={file.path} className="border p-3 flex flex-col">
                    <div className="mb-2 overflow-hidden h-32 flex items-center justify-center bg-gray-50">
                      {/* eslint-disable @next/next/no-img-element */}
                      <img
                        src={url}
                        alt={file.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div
                      className="text-sm font-medium truncate"
                      title={file.name}
                    >
                      {file.name}
                    </div>
                    <div className="text-xs text-gray-500 mb-2">
                      {(file.size / 1024).toFixed(1)} ك.ب
                    </div>
                    <div className="flex gap-2 mt-auto">
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={blueBtn}
                      >
                        عرض
                      </a>
                      <button
                        type="button"
                        className={blueBtn}
                        onClick={() => handleRename(file)}
                      >
                        إعادة تسمية
                      </button>
                      <button
                        type="button"
                        className={redBtn}
                        onClick={() => handleDelete(file)}
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
