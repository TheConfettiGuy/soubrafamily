"use server";

import fs from "fs/promises";
import path from "path";

/* ---------- Core blocks ---------- */

export type HeroBlock = {
  id: string;
  type: "hero";
  visible?: boolean;
  title: string;
  subtitle?: string;
};


export type TextBlock = {
  id: string;
  type: "text";
  visible?: boolean;
  text: string;
};

export type SectionBlock = {
  id: string;
  type: "section";
  visible?: boolean;
  title: string;
  paragraphs: string[];
};

export type ListBlock = {
  id: string;
  type: "list";
  visible?: boolean;
  title?: string;
  items: string[];
};

export type SpacerBlock = {
  id: string;
  type: "spacer";
  visible?: boolean;
  height?: number; // px
};

/* ---------- Timeline ---------- */

export type TimelineItem = {
  id: string;
  label: string; // year / period
  description: string;
  color?: "main" | "gray" | "black";
};

export type TimelineBlock = {
  id: string;
  type: "timeline";
  visible?: boolean;
  title?: string;
  items: TimelineItem[];
};

/* ---------- Key figures ---------- */

export type KeyFigure = {
  id: string;
  name: string;
  role: string;
};

export type KeyFiguresBlock = {
  id: string;
  type: "keyFigures";
  visible?: boolean;
  title?: string;
  figures: KeyFigure[];
};

/* ---------- Cards grid ---------- */

export type CardItem = {
  id: string;
  title: string;
  text: string;
};

export type CardsBlock = {
  id: string;
  type: "cards";
  visible?: boolean;
  title?: string;
  layout?: "2" | "3" | "4"; // columns
  cards: CardItem[];
};

/* ---------- Image & Gallery ---------- */

export type ImageBlock = {
  id: string;
  type: "image";
  visible?: boolean;
  src: string;
  alt?: string;
  caption?: string;
  fullWidth?: boolean;
};

export type GalleryImage = {
  id: string;
  src: string;
  alt?: string;
  caption?: string;
};

export type GalleryBlock = {
  id: string;
  type: "gallery";
  visible?: boolean;
  title?: string;
  images: GalleryImage[];
  columns?: 2 | 3 | 4;
};

/* ---------- Union ---------- */

export type DynamicBlock =
  | HeroBlock
  | TextBlock
  | SectionBlock
  | ListBlock
  | SpacerBlock
  | TimelineBlock
  | KeyFiguresBlock
  | CardsBlock
  | ImageBlock
  | GalleryBlock;

export type DynamicPageData = {
  title: string;
  subtitle?: string; // NEW: page subtitle
  showHeader?: boolean; // NEW: show / hide whole header
  showSubtitle?: boolean; // NEW: show / hide subtitle
  blocks: DynamicBlock[];
};

const DATA_PATH = path.join(process.cwd(), "src/data/dynamic.json");

/* ---------- Load & Save ---------- */

export async function getDynamicPage(): Promise<DynamicPageData> {
  const raw = await fs.readFile(DATA_PATH, "utf8");
  return JSON.parse(raw) as DynamicPageData;
}

export async function saveDynamicPage(formData: FormData) {
  try {
    const payload = formData.get("payload");
    if (!payload || typeof payload !== "string") {
      return { ok: false, error: "Payload is missing" };
    }

    const data = JSON.parse(payload) as DynamicPageData;
    await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2), "utf8");

    return { ok: true };
  } catch (err) {
    console.error("saveDynamicPage error:", err);
    return { ok: false, error: "حدث خطأ أثناء الحفظ" };
  }
}
