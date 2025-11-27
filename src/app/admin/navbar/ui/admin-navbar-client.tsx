"use client";

import { useMemo, useState } from "react";
import { saveNavbar } from "@/app/admin/navbar/action";

type TopBarLink = { id: string; label: string; href: string };
type SocialItem = { id: string; label: string; href: string; icon: string };
type DropdownItem = { id: string; label: string; href: string; icon: string };
type NavItem = {
  id: string;
  label: string;
  href?: string;
  icon: string;
  dropdown?: DropdownItem[];
};
type NavbarData = {
  topBar: { links: TopBarLink[]; socialMedia: SocialItem[] };
  items: NavItem[];
};

const blueBtn = "bg-main-100 text-white cursor-pointer  px-3 py-2";
const redBtn =
  "bg-red-50 text-red-700 cursor-pointer px-3 py-2 text-sm whitespace-nowrap pointer";
const neutralBtn = " px-3 py-2 border cursor-pointer";

function uid(prefix = "id") {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

function slugifyArabic(s: string) {
  // simple slug (Arabic letters kept; spaces -> '-', remove punctuation)
  return (
    s
      .trim()
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s_-]/gu, "")
      .replace(/\s+/g, "-")
      .slice(0, 40) || uid("item")
  );
}

function ensureUniqueId(base: string, existing: string[]) {
  if (!existing.includes(base)) return base;
  let i = 2;
  let cur = `${base}-${i}`;
  while (existing.includes(cur)) {
    i++;
    cur = `${base}-${i}`;
  }
  return cur;
}

function Toast({ open, text }: { open: boolean; text: string }) {
  return (
    <div
      className={[
        "fixed bottom-4 right-4 z-[1000] transition-all duration-300",
        open
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-3 pointer-events-none",
      ].join(" ")}
      dir="rtl"
    >
      <div className=" px-4 py-3 bg-gray-900 text-white shadow-lg">{text}</div>
    </div>
  );
}

export default function AdminNavbarClient({
  initialData,
}: {
  initialData: NavbarData;
}) {
  const [data, setData] = useState<NavbarData>(initialData);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastText, setToastText] = useState("تم الحفظ وتحديث القائمة.");

  // Quick-add temp state
  const [qaLabel, setQaLabel] = useState("");
  const [qaHref, setQaHref] = useState("");
  const [qaIcon, setQaIcon] = useState("");

  const jsonString = useMemo(() => JSON.stringify(data, null, 2), [data]);

  // ---------- top bar links ----------
  const addTopLink = () =>
    setData((d) => ({
      ...d,
      topBar: {
        ...d.topBar,
        links: [...d.topBar.links, { id: uid("link"), label: "", href: "" }],
      },
    }));

  const updateTopLink = (i: number, patch: Partial<TopBarLink>) =>
    setData((d) => {
      const links = [...d.topBar.links];
      links[i] = { ...links[i], ...patch };
      return { ...d, topBar: { ...d.topBar, links } };
    });

  const removeTopLink = (i: number) =>
    setData((d) => {
      const links = [...d.topBar.links];
      links.splice(i, 1);
      return { ...d, topBar: { ...d.topBar, links } };
    });

  const moveTopLink = (i: number, dir: -1 | 1) =>
    setData((d) => {
      const links = [...d.topBar.links];
      const to = i + dir;
      if (to < 0 || to >= links.length) return d;
      [links[i], links[to]] = [links[to], links[i]];
      return { ...d, topBar: { ...d.topBar, links } };
    });

  // ---------- social ----------
  const addSocial = () =>
    setData((d) => ({
      ...d,
      topBar: {
        ...d.topBar,
        socialMedia: [
          ...d.topBar.socialMedia,
          { id: uid("sm"), label: "", href: "", icon: "" },
        ],
      },
    }));

  const updateSocial = (i: number, patch: Partial<SocialItem>) =>
    setData((d) => {
      const s = [...d.topBar.socialMedia];
      s[i] = { ...s[i], ...patch };
      return { ...d, topBar: { ...d.topBar, socialMedia: s } };
    });

  const removeSocial = (i: number) =>
    setData((d) => {
      const s = [...d.topBar.socialMedia];
      s.splice(i, 1);
      return { ...d, topBar: { ...d.topBar, socialMedia: s } };
    });

  const moveSocial = (i: number, dir: -1 | 1) =>
    setData((d) => {
      const s = [...d.topBar.socialMedia];
      const to = i + dir;
      if (to < 0 || to >= s.length) return d;
      [s[i], s[to]] = [s[to], s[i]];
      return { ...d, topBar: { ...d.topBar, socialMedia: s } };
    });

  // ---------- items (NEW: quick add + insert above/below) ----------
  const createItem = (label = "", href = "", icon = ""): NavItem => {
    const baseId = slugifyArabic(label || "new");
    const ids = data.items.map((x) => x.id);
    const id = ensureUniqueId(baseId, ids);
    return { id, label, href, icon };
  };

  const addItem = () =>
    setData((d) => ({
      ...d,
      items: [...d.items, createItem()],
    }));

  const addItemQuick = () =>
    setData((d) => {
      const item = createItem(qaLabel, qaHref, qaIcon);
      // reset fields
      setQaLabel("");
      setQaHref("");
      setQaIcon("");
      return { ...d, items: [...d.items, item] };
    });

  const insertItemAt = (index: number, position: "above" | "below") =>
    setData((d) => {
      const items = [...d.items];
      const at = position === "above" ? index : index + 1;
      items.splice(at, 0, createItem());
      return { ...d, items };
    });

  const updateItem = (i: number, patch: Partial<NavItem>) =>
    setData((d) => {
      const items = [...d.items];
      items[i] = { ...items[i], ...patch };
      return { ...d, items };
    });

  const removeItem = (i: number) =>
    setData((d) => {
      const items = [...d.items];
      items.splice(i, 1);
      return { ...d, items };
    });

  const moveItem = (i: number, dir: -1 | 1) =>
    setData((d) => {
      const items = [...d.items];
      const to = i + dir;
      if (to < 0 || to >= items.length) return d;
      [items[i], items[to]] = [items[to], items[i]];
      return { ...d, items };
    });

  // ---------- dropdowns ----------
  const addDropdown = (i: number) =>
    setData((d) => {
      const items = [...d.items];
      const dd = [...(items[i].dropdown ?? [])];
      dd.push({ id: uid("dd"), label: "", href: "", icon: "" });
      items[i] = { ...items[i], dropdown: dd };
      return { ...d, items };
    });

  const updateDropdown = (i: number, j: number, patch: Partial<DropdownItem>) =>
    setData((d) => {
      const items = [...d.items];
      const dd = [...(items[i].dropdown ?? [])];
      dd[j] = { ...dd[j], ...patch };
      items[i] = { ...items[i], dropdown: dd };
      return { ...d, items };
    });

  const removeDropdown = (i: number, j: number) =>
    setData((d) => {
      const items = [...d.items];
      const dd = [...(items[i].dropdown ?? [])];
      dd.splice(j, 1);
      if (dd.length === 0) {
        const { dropdown, ...rest } = items[i] as any;
        items[i] = { ...rest };
      } else {
        items[i] = { ...items[i], dropdown: dd };
      }
      return { ...d, items };
    });

  const moveDropdown = (i: number, j: number, dir: -1 | 1) =>
    setData((d) => {
      const items = [...d.items];
      const dd = [...(items[i].dropdown ?? [])];
      const to = j + dir;
      if (to < 0 || to >= dd.length) return d;
      [dd[j], dd[to]] = [dd[to], dd[j]];
      items[i] = { ...items[i], dropdown: dd };
      return { ...d, items };
    });

  // ---------- sanitize before save ----------
  const cleanse = (nav: NavbarData): NavbarData => {
    const cleanItems = (items: NavItem[]): NavItem[] =>
      items.map((it) => {
        const has = Array.isArray(it.dropdown) && it.dropdown.length > 0;
        if (!has) {
          const { dropdown, ...rest } = it as any;
          return { ...rest };
        }
        return { ...it, dropdown: it.dropdown!.map((d) => ({ ...d })) };
      });

    return {
      topBar: {
        links: nav.topBar.links.map((l) => ({ ...l })),
        socialMedia: nav.topBar.socialMedia.map((s) => ({ ...s })),
      },
      items: cleanItems(nav.items),
    };
  };

  return (
    <div className="space-y-8" dir="rtl">
      {/* Quick add panel */}
      <section className=" border bg-white p-4 space-y-3">
        <h2 className="text-lg font-medium">+ عنصر جديد سريع</h2>
        <div className="grid sm:grid-cols-4 gap-2">
          <input
            className=" border px-3 py-2"
            placeholder="label (العنوان)"
            value={qaLabel}
            onChange={(e) => setQaLabel(e.target.value)}
          />
          <input
            className=" border px-3 py-2"
            placeholder="href (مثال: /news)"
            value={qaHref}
            onChange={(e) => setQaHref(e.target.value)}
          />
          <input
            className=" border px-3 py-2"
            placeholder="icon (مثال: home)"
            value={qaIcon}
            onChange={(e) => setQaIcon(e.target.value)}
          />
          <div className="flex items-center">
            <button type="button" className={blueBtn} onClick={addItemQuick}>
              إضافة إلى نهاية القائمة
            </button>
          </div>
        </div>
      </section>

      {/* TopBar Links */}
      <section className=" border bg-white p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">روابط الشريط العلوي</h2>
          <button className={blueBtn} onClick={addTopLink} type="button">
            + إضافة رابط
          </button>
        </div>

        {data.topBar.links.map((l, i) => (
          <div key={l.id} className="grid sm:grid-cols-4 gap-2 border  p-3">
            <input
              className=" border px-3 py-2"
              value={l.id}
              onChange={(e) => updateTopLink(i, { id: e.target.value })}
              placeholder="id"
            />
            <input
              className=" border px-3 py-2"
              value={l.label}
              onChange={(e) => updateTopLink(i, { label: e.target.value })}
              placeholder="label"
            />
            <input
              className=" border px-3 py-2"
              value={l.href}
              onChange={(e) => updateTopLink(i, { href: e.target.value })}
              placeholder="href"
            />
            <div className="flex items-center gap-2">
              <button
                className={neutralBtn}
                onClick={() => moveTopLink(i, -1)}
                disabled={i === 0}
                type="button"
              >
                ↑
              </button>
              <button
                className={neutralBtn}
                onClick={() => moveTopLink(i, +1)}
                disabled={i === data.topBar.links.length - 1}
                type="button"
              >
                ↓
              </button>
              <button
                className={redBtn}
                onClick={() => removeTopLink(i)}
                type="button"
              >
                حذف
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* Social accounts */}
      <section className=" border bg-white p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">حسابات التواصل</h2>
          <button className={blueBtn} onClick={addSocial} type="button">
            + إضافة حساب
          </button>
        </div>

        {data.topBar.socialMedia.map((s, i) => (
          <div key={s.id} className="grid sm:grid-cols-5 gap-2 border  p-3">
            <input
              className=" border px-3 py-2"
              value={s.id}
              onChange={(e) => updateSocial(i, { id: e.target.value })}
              placeholder="id"
            />
            <input
              className=" border px-3 py-2"
              value={s.label}
              onChange={(e) => updateSocial(i, { label: e.target.value })}
              placeholder="label"
            />
            <input
              className=" border px-3 py-2"
              value={s.href}
              onChange={(e) => updateSocial(i, { href: e.target.value })}
              placeholder="href"
            />
            <input
              className=" border px-3 py-2"
              value={s.icon}
              onChange={(e) => updateSocial(i, { icon: e.target.value })}
              placeholder="icon"
            />
            <div className="flex items-center gap-2">
              <button
                className={neutralBtn}
                onClick={() => moveSocial(i, -1)}
                disabled={i === 0}
                type="button"
              >
                ↑
              </button>
              <button
                className={neutralBtn}
                onClick={() => moveSocial(i, +1)}
                disabled={i === data.topBar.socialMedia.length - 1}
                type="button"
              >
                ↓
              </button>
              <button
                className={redBtn}
                onClick={() => removeSocial(i)}
                type="button"
              >
                حذف
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* Main items */}
      <section className=" border bg-white p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">عناصر القائمة الرئيسية</h2>
          <button className={blueBtn} onClick={addItem} type="button">
            + إضافة عنصر (فارغ)
          </button>
        </div>

        {data.items.map((item, i) => (
          <div key={item.id} className=" border p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-sm text-gray-500">
                id: <code>{item.id}</code>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {/* NEW: insert above/below */}
                <button
                  className={neutralBtn}
                  type="button"
                  onClick={() => insertItemAt(i, "above")}
                >
                  إضافة فوق
                </button>
                <button
                  className={neutralBtn}
                  type="button"
                  onClick={() => insertItemAt(i, "below")}
                >
                  إضافة تحت
                </button>

                <button
                  className={neutralBtn}
                  onClick={() => moveItem(i, -1)}
                  disabled={i === 0}
                  type="button"
                >
                  ↑
                </button>
                <button
                  className={neutralBtn}
                  onClick={() => moveItem(i, +1)}
                  disabled={i === data.items.length - 1}
                  type="button"
                >
                  ↓
                </button>

                {/* convert to regular item (removes dropdown) */}
                <button
                  className={neutralBtn}
                  type="button"
                  onClick={() =>
                    setData((d) => {
                      const items = [...d.items];
                      const { dropdown, ...rest } = items[i] as any;
                      items[i] = { ...rest };
                      return { ...d, items };
                    })
                  }
                >
                  تحويل إلى عنصر عادي
                </button>

                <button
                  className={redBtn}
                  onClick={() => removeItem(i)}
                  type="button"
                >
                  حذف
                </button>
              </div>
            </div>

            <div className="grid sm:grid-cols-4 gap-2">
              <input
                className=" border px-3 py-2"
                value={item.id}
                onChange={(e) => updateItem(i, { id: e.target.value })}
                placeholder="id"
              />
              <input
                className=" border px-3 py-2"
                value={item.label}
                onChange={(e) => updateItem(i, { label: e.target.value })}
                placeholder="label"
              />
              <input
                className=" border px-3 py-2"
                value={item.href ?? ""}
                onChange={(e) => updateItem(i, { href: e.target.value })}
                placeholder="href (اختياري)"
              />
              <input
                className=" border px-3 py-2"
                value={item.icon}
                onChange={(e) => updateItem(i, { icon: e.target.value })}
                placeholder="icon"
              />
            </div>

            <div className="flex items-center justify-between mt-2">
              <h3 className="font-medium">القائمة المنسدلة</h3>
              <button
                className={blueBtn}
                onClick={() => addDropdown(i)}
                type="button"
              >
                + إضافة عنصر فرعي
              </button>
            </div>

            {Array.isArray(item.dropdown) && item.dropdown.length === 0 && (
              <p className="text-sm text-gray-500">لا يوجد عناصر فرعية.</p>
            )}

            {(item.dropdown ?? []).map((dd, j) => (
              <div
                key={dd.id}
                className="grid sm:grid-cols-5 gap-2 border  p-3 mt-2"
              >
                <input
                  className=" border px-3 py-2"
                  value={dd.id}
                  onChange={(e) => updateDropdown(i, j, { id: e.target.value })}
                  placeholder="id"
                />
                <input
                  className=" border px-3 py-2"
                  value={dd.label}
                  onChange={(e) =>
                    updateDropdown(i, j, { label: e.target.value })
                  }
                  placeholder="label"
                />
                <input
                  className=" border px-3 py-2"
                  value={dd.href}
                  onChange={(e) =>
                    updateDropdown(i, j, { href: e.target.value })
                  }
                  placeholder="href"
                />
                <input
                  className=" border px-3 py-2"
                  value={dd.icon}
                  onChange={(e) =>
                    updateDropdown(i, j, { icon: e.target.value })
                  }
                  placeholder="icon"
                />
                <div className="flex items-center gap-2">
                  <button
                    className={neutralBtn}
                    onClick={() => moveDropdown(i, j, -1)}
                    disabled={j === 0}
                    type="button"
                  >
                    ↑
                  </button>
                  <button
                    className={neutralBtn}
                    onClick={() => moveDropdown(i, j, +1)}
                    disabled={j === (item.dropdown?.length ?? 1) - 1}
                    type="button"
                  >
                    ↓
                  </button>
                  <button
                    className={redBtn}
                    onClick={() => removeDropdown(i, j)}
                    type="button"
                  >
                    حذف
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </section>

      {/* Save */}
      <section className=" border bg-white p-4">
        <form
          action={async (fd) => {
            const sanitized = cleanse(data);
            fd.set("payload", JSON.stringify(sanitized, null, 2));
            await saveNavbar(fd);
            setToastText("تم الحفظ وتحديث القائمة.");
            setToastOpen(true);
            setTimeout(() => setToastOpen(false), 2200);
          }}
          className="flex items-center justify-between gap-3"
        >
          <input type="hidden" name="payload" value={jsonString} readOnly />
          <div className="text-xs text-gray-500">
            سيتم الكتابة إلى: <code>src/data/navbar.json</code>
          </div>
          <button className={blueBtn} type="submit">
            حفظ
          </button>
        </form>
      </section>

      <Toast open={toastOpen} text={toastText} />
    </div>
  );
}
