"use client";

import { useState } from "react";
import Image from "next/image";
import { saveFooterConfig } from "../actions";

/* ====================== Types (match footer.json) ====================== */

export type FooterLink = {
  id: string;
  label: string;
  href: string;
  visible?: boolean;
};

export type FooterContactItem = {
  id: string;
  icon: string; // "MapPin" | "Phone" | "Mail" ...
  text: string;
  visible?: boolean;
};

export type FooterSection = {
  id: string;
  title: string;
  visible?: boolean;
  links?: FooterLink[];
  contact?: FooterContactItem[];
};

export type SocialMediaLink = {
  id: string;
  name: string;
  icon: string; // "Facebook" | "Twitter" ...
  url: string;
  visible?: boolean;
};

export type FooterConfig = {
  logo: {
    src: string;
    alt: string;
    visible?: boolean;
  };
  description: string;
  sections: FooterSection[];
  socialMedia: SocialMediaLink[];
  copyright: string;
};

type Props = {
  initialData: FooterConfig;
};

/* ====================== Small helpers & styles ====================== */

const blueBtn =
  "bg-main-100 text-white cursor-pointer px-3 py-2 text-sm whitespace-nowrap";
const grayBtn =
  "border border-gray-300 text-gray-700 cursor-pointer px-3 py-2 text-sm whitespace-nowrap bg-white";
const redBtn =
  "bg-red-50 text-red-700 cursor-pointer px-3 py-2 text-sm whitespace-nowrap";

function ensureVisible<T extends { visible?: boolean }>(obj: T): T {
  if (typeof obj.visible === "undefined") return { ...obj, visible: true };
  return obj;
}

function normalizeConfig(data: FooterConfig): FooterConfig {
  return {
    ...data,
    logo: ensureVisible(data.logo),
    sections: (data.sections ?? []).map((s) => ({
      ...ensureVisible(s),
      links: (s.links ?? []).map(ensureVisible),
      contact: (s.contact ?? []).map(ensureVisible),
    })),
    socialMedia: (data.socialMedia ?? []).map(ensureVisible),
  };
}

const generateId = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2);

/* =========================== Main Component =========================== */

export default function ClientPage({ initialData }: Props) {
  const [data, setData] = useState<FooterConfig>(() =>
    normalizeConfig(initialData)
  );
  const [toast, setToast] = useState<string | null>(null);

  /* ------------------------ Root updates ------------------------ */

  const updateRoot = <K extends keyof FooterConfig>(
    key: K,
    value: FooterConfig[K]
  ) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const updateLogo = (patch: Partial<FooterConfig["logo"]>) => {
    setData((prev) => ({ ...prev, logo: { ...prev.logo, ...patch } }));
  };

  /* ------------------------ Sections helpers ------------------------ */

  const updateSection = (index: number, patch: Partial<FooterSection>) => {
    setData((prev) => {
      const sections = [...prev.sections];
      sections[index] = { ...sections[index], ...patch };
      return { ...prev, sections };
    });
  };

  const moveSection = (index: number, dir: -1 | 1) => {
    setData((prev) => {
      const sections = [...prev.sections];
      const target = index + dir;
      if (target < 0 || target >= sections.length) return prev;
      [sections[index], sections[target]] = [sections[target], sections[index]];
      return { ...prev, sections };
    });
  };

  const addSection = () => {
    setData((prev) => ({
      ...prev,
      sections: [
        ...prev.sections,
        {
          id: generateId(),
          title: "قسم جديد",
          visible: true,
          links: [],
          contact: [],
        },
      ],
    }));
  };

  const removeSection = (index: number) => {
    setData((prev) => {
      const sections = [...prev.sections];
      sections.splice(index, 1);
      return { ...prev, sections };
    });
  };

  /* ------------------------ Links helpers ------------------------ */

  const updateLink = (
    sectionIndex: number,
    linkIndex: number,
    patch: Partial<FooterLink>
  ) => {
    setData((prev) => {
      const sections = [...prev.sections];
      const section = { ...sections[sectionIndex] };
      const links = [...(section.links ?? [])];
      links[linkIndex] = { ...links[linkIndex], ...patch };
      section.links = links;
      sections[sectionIndex] = section;
      return { ...prev, sections };
    });
  };

  const addLink = (sectionIndex: number) => {
    setData((prev) => {
      const sections = [...prev.sections];
      const section = { ...sections[sectionIndex] };
      const links = [...(section.links ?? [])];
      links.push({
        id: generateId(),
        label: "رابط جديد",
        href: "/",
        visible: true,
      });
      section.links = links;
      sections[sectionIndex] = section;
      return { ...prev, sections };
    });
  };

  const removeLink = (sectionIndex: number, linkIndex: number) => {
    setData((prev) => {
      const sections = [...prev.sections];
      const section = { ...sections[sectionIndex] };
      const links = [...(section.links ?? [])];
      links.splice(linkIndex, 1);
      section.links = links;
      sections[sectionIndex] = section;
      return { ...prev, sections };
    });
  };

  const moveLink = (sectionIndex: number, linkIndex: number, dir: -1 | 1) => {
    setData((prev) => {
      const sections = [...prev.sections];
      const section = { ...sections[sectionIndex] };
      const links = [...(section.links ?? [])];
      const target = linkIndex + dir;
      if (target < 0 || target >= links.length) return prev;
      [links[linkIndex], links[target]] = [links[target], links[linkIndex]];
      section.links = links;
      sections[sectionIndex] = section;
      return { ...prev, sections };
    });
  };

  /* ------------------------ Contact helpers ------------------------ */

  const updateContact = (
    sectionIndex: number,
    contactIndex: number,
    patch: Partial<FooterContactItem>
  ) => {
    setData((prev) => {
      const sections = [...prev.sections];
      const section = { ...sections[sectionIndex] };
      const contact = [...(section.contact ?? [])];
      contact[contactIndex] = { ...contact[contactIndex], ...patch };
      section.contact = contact;
      sections[sectionIndex] = section;
      return { ...prev, sections };
    });
  };

  const addContact = (sectionIndex: number) => {
    setData((prev) => {
      const sections = [...prev.sections];
      const section = { ...sections[sectionIndex] };
      const contact = [...(section.contact ?? [])];
      contact.push({
        id: generateId(),
        icon: "MapPin",
        text: "نص جديد",
        visible: true,
      });
      section.contact = contact;
      sections[sectionIndex] = section;
      return { ...prev, sections };
    });
  };

  const removeContact = (sectionIndex: number, contactIndex: number) => {
    setData((prev) => {
      const sections = [...prev.sections];
      const section = { ...sections[sectionIndex] };
      const contact = [...(section.contact ?? [])];
      contact.splice(contactIndex, 1);
      section.contact = contact;
      sections[sectionIndex] = section;
      return { ...prev, sections };
    });
  };

  const moveContact = (
    sectionIndex: number,
    contactIndex: number,
    dir: -1 | 1
  ) => {
    setData((prev) => {
      const sections = [...prev.sections];
      const section = { ...sections[sectionIndex] };
      const contact = [...(section.contact ?? [])];
      const target = contactIndex + dir;
      if (target < 0 || target >= contact.length) return prev;
      [contact[contactIndex], contact[target]] = [
        contact[target],
        contact[contactIndex],
      ];
      section.contact = contact;
      sections[sectionIndex] = section;
      return { ...prev, sections };
    });
  };

  /* ------------------------ Social Media helpers ------------------------ */

  const updateSocial = (index: number, patch: Partial<SocialMediaLink>) => {
    setData((prev) => {
      const socialMedia = [...prev.socialMedia];
      socialMedia[index] = { ...socialMedia[index], ...patch };
      return { ...prev, socialMedia };
    });
  };

  const addSocial = () => {
    setData((prev) => ({
      ...prev,
      socialMedia: [
        ...prev.socialMedia,
        {
          id: generateId(),
          name: "New",
          icon: "Facebook",
          url: "https://",
          visible: true,
        },
      ],
    }));
  };

  const removeSocial = (index: number) => {
    setData((prev) => {
      const socialMedia = [...prev.socialMedia];
      socialMedia.splice(index, 1);
      return { ...prev, socialMedia };
    });
  };

  const moveSocial = (index: number, dir: -1 | 1) => {
    setData((prev) => {
      const socialMedia = [...prev.socialMedia];
      const target = index + dir;
      if (target < 0 || target >= socialMedia.length) return prev;
      [socialMedia[index], socialMedia[target]] = [
        socialMedia[target],
        socialMedia[index],
      ];
      return { ...prev, socialMedia };
    });
  };

  /* ------------------------ Save handler ------------------------ */

  const handleSave = async (formData: FormData) => {
    formData.set("payload", JSON.stringify(data));
    const res = await saveFooterConfig(formData);
    if (res && "success" in res && !res.success) {
      setToast("حدث خطأ أثناء الحفظ");
    } else {
      setToast("تم الحفظ وتحديث بيانات الفوتر بنجاح");
    }
    setTimeout(() => setToast(null), 2500);
  };

  /* ============================== Render ============================== */

  return (
    <div className="space-y-8" dir="rtl">
      {/* Header info */}
      <section className="border bg-white p-4 space-y-4">
        <h2 className="text-lg font-medium">إعدادات الفوتر</h2>

        <div className="grid sm:grid-cols-2 gap-4">
          {/* Logo controls */}
          <div className="space-y-2">
            <label className="block text-sm mb-1">مسار الشعار (logo src)</label>
            <input
              className="w-full border px-3 py-2"
              value={data.logo.src}
              onChange={(e) => updateLogo({ src: e.target.value })}
              placeholder="/logo.png"
            />

            <label className="block text-sm mb-1">النص البديل للشعار</label>
            <input
              className="w-full border px-3 py-2"
              value={data.logo.alt}
              onChange={(e) => updateLogo({ alt: e.target.value })}
            />

            <div className="flex items-center gap-2 mt-2 text-sm">
              <span>حالة الشعار:</span>
              <span
                className={
                  data.logo.visible !== false
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                {data.logo.visible !== false ? "ظاهر" : "مخفي"}
              </span>
              <button
                type="button"
                className={grayBtn}
                onClick={() =>
                  updateLogo({
                    visible: data.logo.visible === false ? true : false,
                  })
                }
              >
                {data.logo.visible === false ? "إظهار الشعار" : "إخفاء الشعار"}
              </button>
            </div>

            {data.logo.src && (
              <div className="mt-2 inline-block border">
                <Image
                  src={data.logo.src}
                  alt={data.logo.alt || "logo preview"}
                  width={160}
                  height={50}
                  className="object-contain bg-white p-1"
                />
              </div>
            )}
          </div>

          {/* Description + copyright */}
          <div className="space-y-3">
            <div>
              <label className="block text-sm mb-1">وصف مختصر</label>
              <textarea
                className="w-full border px-3 py-2 min-h-20"
                value={data.description}
                onChange={(e) => updateRoot("description", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">نص حقوق النشر</label>
              <input
                className="w-full border px-3 py-2"
                value={data.copyright}
                onChange={(e) => updateRoot("copyright", e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Sections header */}
      <section className="border bg-white p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">الأقسام وروابط الفوتر</h2>
          <button type="button" className={blueBtn} onClick={addSection}>
            + إضافة قسم جديد
          </button>
        </div>
      </section>

      {/* Sections list */}
      <section className="space-y-6">
        {data.sections.map((section, sIdx) => {
          const visible = section.visible !== false;
          return (
            <div
              key={section.id || sIdx}
              className="border bg-white p-4 space-y-4 shadow-sm"
            >
              {/* Section header row */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  <div>
                    <span className="text-sm text-gray-600">قسم:</span>{" "}
                    <span className="font-bold">
                      {section.title || "بدون عنوان"}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    الحالة:{" "}
                    <span
                      className={visible ? "text-green-600" : "text-red-600"}
                    >
                      {visible ? "ظاهر" : "مخفي"}
                    </span>
                  </div>
                  <button
                    type="button"
                    className={visible ? grayBtn : blueBtn}
                    onClick={() => updateSection(sIdx, { visible: !visible })}
                  >
                    {visible ? "إخفاء هذا القسم" : "إظهار هذا القسم"}
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className={grayBtn}
                    disabled={sIdx === 0}
                    onClick={() => moveSection(sIdx, -1)}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    className={grayBtn}
                    disabled={sIdx === data.sections.length - 1}
                    onClick={() => moveSection(sIdx, +1)}
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    className={redBtn}
                    onClick={() => removeSection(sIdx)}
                  >
                    حذف
                  </button>
                </div>
              </div>

              {/* Section fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-1">عنوان القسم</label>
                  <input
                    className="w-full border px-3 py-2"
                    value={section.title}
                    onChange={(e) =>
                      updateSection(sIdx, { title: e.target.value })
                    }
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    ID القسم: <code>{section.id || "لم يتم التعيين"}</code>
                  </p>
                </div>

                {/* Links */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-sm">الروابط</h3>
                    <button
                      type="button"
                      className={grayBtn}
                      onClick={() => addLink(sIdx)}
                    >
                      + إضافة رابط
                    </button>
                  </div>

                  {(section.links ?? []).length === 0 && (
                    <p className="text-xs text-gray-500">
                      لا توجد روابط في هذا القسم حالياً.
                    </p>
                  )}

                  {(section.links ?? []).map((link, lIdx) => {
                    const linkVisible = link.visible !== false;
                    return (
                      <div
                        key={link.id || lIdx}
                        className="border border-gray-200 p-3 space-y-2"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="text-xs text-gray-600">
                            الحالة:{" "}
                            <span
                              className={
                                linkVisible ? "text-green-600" : "text-red-600"
                              }
                            >
                              {linkVisible ? "ظاهر" : "مخفي"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              className={grayBtn}
                              disabled={lIdx === 0}
                              onClick={() => moveLink(sIdx, lIdx, -1)}
                            >
                              ↑
                            </button>
                            <button
                              type="button"
                              className={grayBtn}
                              disabled={
                                (section.links ?? []).length - 1 === lIdx
                              }
                              onClick={() => moveLink(sIdx, lIdx, +1)}
                            >
                              ↓
                            </button>
                            <button
                              type="button"
                              className={grayBtn}
                              onClick={() =>
                                updateLink(sIdx, lIdx, {
                                  visible: !linkVisible,
                                })
                              }
                            >
                              {linkVisible ? "إخفاء" : "إظهار"}
                            </button>
                            <button
                              type="button"
                              className={redBtn}
                              onClick={() => removeLink(sIdx, lIdx)}
                            >
                              حذف
                            </button>
                          </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs mb-1">النص</label>
                            <input
                              className="w-full border px-2 py-1 text-sm"
                              value={link.label}
                              onChange={(e) =>
                                updateLink(sIdx, lIdx, {
                                  label: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div>
                            <label className="block text-xs mb-1">
                              الرابط (href)
                            </label>
                            <input
                              className="w-full border px-2 py-1 text-sm"
                              value={link.href}
                              onChange={(e) =>
                                updateLink(sIdx, lIdx, { href: e.target.value })
                              }
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Contact items */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-sm">معلومات الاتصال</h3>
                    <button
                      type="button"
                      className={grayBtn}
                      onClick={() => addContact(sIdx)}
                    >
                      + إضافة بند اتصال
                    </button>
                  </div>

                  {(section.contact ?? []).length === 0 && (
                    <p className="text-xs text-gray-500">
                      لا توجد بنود اتصال في هذا القسم حالياً.
                    </p>
                  )}

                  {(section.contact ?? []).map((item, cIdx) => {
                    const cVisible = item.visible !== false;
                    return (
                      <div
                        key={item.id || cIdx}
                        className="border border-gray-200 p-3 space-y-2"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="text-xs text-gray-600">
                            الحالة:{" "}
                            <span
                              className={
                                cVisible ? "text-green-600" : "text-red-600"
                              }
                            >
                              {cVisible ? "ظاهر" : "مخفي"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              className={grayBtn}
                              disabled={cIdx === 0}
                              onClick={() => moveContact(sIdx, cIdx, -1)}
                            >
                              ↑
                            </button>
                            <button
                              type="button"
                              className={grayBtn}
                              disabled={
                                (section.contact ?? []).length - 1 === cIdx
                              }
                              onClick={() => moveContact(sIdx, cIdx, +1)}
                            >
                              ↓
                            </button>
                            <button
                              type="button"
                              className={grayBtn}
                              onClick={() =>
                                updateContact(sIdx, cIdx, {
                                  visible: !cVisible,
                                })
                              }
                            >
                              {cVisible ? "إخفاء" : "إظهار"}
                            </button>
                            <button
                              type="button"
                              className={redBtn}
                              onClick={() => removeContact(sIdx, cIdx)}
                            >
                              حذف
                            </button>
                          </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs mb-1">
                              الأيقونة (MapPin / Phone / Mail...)
                            </label>
                            <input
                              className="w-full border px-2 py-1 text-sm"
                              value={item.icon}
                              onChange={(e) =>
                                updateContact(sIdx, cIdx, {
                                  icon: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div>
                            <label className="block text-xs mb-1">النص</label>
                            <input
                              className="w-full border px-2 py-1 text-sm"
                              value={item.text}
                              onChange={(e) =>
                                updateContact(sIdx, cIdx, {
                                  text: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Social media */}
      <section className="border bg-white p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">
            حسابات وسائل التواصل الاجتماعي
          </h2>
          <button type="button" className={grayBtn} onClick={addSocial}>
            + إضافة حساب جديد
          </button>
        </div>

        {(data.socialMedia ?? []).length === 0 && (
          <p className="text-xs text-gray-500 mt-2">
            لا توجد حسابات حالياً في الفوتر.
          </p>
        )}

        <div className="space-y-3 mt-3">
          {data.socialMedia.map((sm, idx) => {
            const smVisible = sm.visible !== false;
            return (
              <div
                key={sm.id || idx}
                className="border border-gray-200 p-3 space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="text-xs text-gray-600">
                    {sm.name} –{" "}
                    <span
                      className={smVisible ? "text-green-600" : "text-red-600"}
                    >
                      {smVisible ? "ظاهر" : "مخفي"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className={grayBtn}
                      disabled={idx === 0}
                      onClick={() => moveSocial(idx, -1)}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      className={grayBtn}
                      disabled={idx === data.socialMedia.length - 1}
                      onClick={() => moveSocial(idx, +1)}
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      className={grayBtn}
                      onClick={() => updateSocial(idx, { visible: !smVisible })}
                    >
                      {smVisible ? "إخفاء" : "إظهار"}
                    </button>
                    <button
                      type="button"
                      className={redBtn}
                      onClick={() => removeSocial(idx)}
                    >
                      حذف
                    </button>
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs mb-1">
                      الاسم (Facebook..)
                    </label>
                    <input
                      className="w-full border px-2 py-1 text-sm"
                      value={sm.name}
                      onChange={(e) =>
                        updateSocial(idx, { name: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-xs mb-1">
                      الأيقونة (Facebook/Instagram..)
                    </label>
                    <input
                      className="w-full border px-2 py-1 text-sm"
                      value={sm.icon}
                      onChange={(e) =>
                        updateSocial(idx, { icon: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-xs mb-1">الرابط (URL)</label>
                    <input
                      className="w-full border px-2 py-1 text-sm"
                      value={sm.url}
                      onChange={(e) =>
                        updateSocial(idx, { url: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Save section */}
      <section className="border bg-white p-4">
        <form
          action={async (fd) => {
            await handleSave(fd);
          }}
          className="flex items-center justify-between gap-3"
        >
          <input
            type="hidden"
            name="payload"
            value={JSON.stringify(data)}
            readOnly
          />
          <div className="text-xs text-gray-500">
            سيتم الكتابة إلى: <code>src/data/footer.json</code>
          </div>
          <button className={blueBtn} type="submit">
            حفظ
          </button>
        </form>
      </section>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-4 py-3 shadow-lg z-40">
          {toast}
        </div>
      )}
    </div>
  );
}
