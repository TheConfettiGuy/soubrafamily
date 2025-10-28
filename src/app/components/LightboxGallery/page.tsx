"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";

type Props = {
  images: string[];
  yearLabel?: string; // for alt text
};

export default function LightboxGallery({ images, yearLabel }: Props) {
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);

  const total = images.length;
  const current = useMemo(
    () => (total ? images[idx] : ""),
    [images, idx, total]
  );

  const openAt = (i: number) => {
    setIdx(i);
    setOpen(true);
  };
  const close = () => setOpen(false);

  const next = useCallback(() => setIdx((i) => (i + 1) % total), [total]);
  const prev = useCallback(
    () => setIdx((i) => (i - 1 + total) % total),
    [total]
  );

  // Keyboard controls + lock body scroll while open
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, next, prev]);

  if (!total) {
    return <p className="text-gray-500">لا توجد صور في الألبوم بعد.</p>;
  }

  return (
    <>
      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => openAt(i)}
            className="relative aspect-[6/4] overflow-hidden focus:outline-none focus:ring-2 focus:ring-main-100"
            aria-label={`افتح الصورة رقم ${i + 1}`}
          >
            <Image
              src={src}
              alt={`صورة من ألبوم ${yearLabel ?? ""}`}
              fill
              className="object-cover hover:cursor-pointer"
              loading="lazy"
            />
          </button>
        ))}
      </div>

      {/* Lightbox / Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          onClick={close}
        >
          {/* Stop click from bubbling so inner clicks don’t close */}
          <div
            className="relative w-full max-w-5xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image container */}
            <div className="relative w-full aspect-[6/4]">
              <Image
                src={current}
                alt={`صورة مكبرة من ألبوم ${yearLabel ?? ""}`}
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Controls */}
            <div className="absolute inset-0 flex items-center justify-between px-2 md:px-4">
              <button
                type="button"
                onClick={prev}
                className="rounded-full bg-white/20 hover:bg-white/30 backdrop-blur px-3 py-2 text-white"
                aria-label="السابق"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={next}
                className="rounded-full bg-white/20 hover:bg-white/30 backdrop-blur px-3 py-2 text-white"
                aria-label="التالي"
              >
                ›
              </button>
            </div>

            {/* Close button */}
            <button
              type="button"
              onClick={close}
              className="absolute -top-3 -right-3 md:-top-4 md:-right-4 rounded-full bg-white text-black w-8 h-8 md:w-10 md:h-10 grid place-content-center shadow"
              aria-label="إغلاق"
            >
              ✕
            </button>

            {/* Counter */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded bg-black/60 text-white px-2 py-1 text-sm">
              {idx + 1} / {total}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
