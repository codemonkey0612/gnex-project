"use client";

import { REGION_GROUPS } from "@/lib/constants";

interface AreaSelectProps {
  selected: string[];
  onChange: (areas: string[]) => void;
}

export function AreaSelect({ selected, onChange }: AreaSelectProps) {
  function toggleArea(area: string) {
    if (selected.includes(area)) {
      onChange(selected.filter((a) => a !== area));
    } else {
      onChange([...selected, area]);
    }
  }

  function toggleRegion(prefectures: string[]) {
    const allSelected = prefectures.every((p) => selected.includes(p));
    if (allSelected) {
      onChange(selected.filter((a) => !prefectures.includes(a)));
    } else {
      const newAreas = new Set([...selected, ...prefectures]);
      onChange(Array.from(newAreas));
    }
  }

  function selectAll() {
    const all = Object.values(REGION_GROUPS).flat();
    onChange(all);
  }

  function clearAll() {
    onChange([]);
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={selectAll}
          className="text-xs text-secondary hover:underline"
        >
          全選択
        </button>
        <button
          type="button"
          onClick={clearAll}
          className="text-xs text-secondary hover:underline"
        >
          全解除
        </button>
        <span className="text-xs text-muted-foreground">
          {selected.length}件選択中
        </span>
      </div>
      <div className="max-h-64 space-y-3 overflow-y-auto rounded-md border p-3">
        {Object.entries(REGION_GROUPS).map(([region, prefectures]) => {
          const allSelected = prefectures.every((p) => selected.includes(p));
          const someSelected = prefectures.some((p) => selected.includes(p));
          return (
            <div key={region}>
              <label className="flex cursor-pointer items-center gap-2 font-medium text-sm">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = someSelected && !allSelected;
                  }}
                  onChange={() => toggleRegion(prefectures)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                {region}
              </label>
              <div className="ml-6 mt-1 flex flex-wrap gap-1">
                {prefectures.map((pref) => (
                  <button
                    key={pref}
                    type="button"
                    onClick={() => toggleArea(pref)}
                    className={`rounded px-2 py-0.5 text-xs transition-colors ${
                      selected.includes(pref)
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {pref}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
