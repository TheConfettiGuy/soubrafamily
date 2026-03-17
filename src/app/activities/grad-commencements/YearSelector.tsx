"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type React from "react";

type Props = {
  years: string[];
  selectedYear: string;
  view: "photos" | "lists";
};

export default function YearSelector({ years, selectedYear, view }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const y = e.target.value;

    // keep other query params, only update y + view
    const params = new URLSearchParams(searchParams.toString());
    params.set("y", y);
    params.set("view", view);

    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex items-center gap-3">
      <label className="text-sm text-main-100 font-semibold">
        اختر السنة:
      </label>
      <select
        value={selectedYear}
        onChange={handleChange}
        className="border border-main-100 text-main-100 px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-main-100/40"
      >
        {years.map((y) => (
          <option key={y} value={y}>
             {y}
          </option>
        ))}
      </select>
    </div>
  );
}
