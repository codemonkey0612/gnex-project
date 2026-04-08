"use client";

import { SERVICE_UNITS } from "@/config/constants";

const UNIT_MAP = {
  UNIT_A: SERVICE_UNITS.unit_a,
  UNIT_B: SERVICE_UNITS.unit_b,
  UNIT_C: SERVICE_UNITS.unit_c,
  UNIT_D: SERVICE_UNITS.unit_d,
} as const;

interface ServiceUnitSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function ServiceUnitSelector({ value, onChange }: ServiceUnitSelectorProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {Object.entries(UNIT_MAP).map(([key, unit]) => (
        <button
          key={key}
          type="button"
          onClick={() => onChange(key)}
          className={`rounded-lg border p-4 text-left transition-colors ${
            value === key
              ? "border-primary bg-primary/5 ring-2 ring-primary/20"
              : "border-border hover:border-primary/50"
          }`}
        >
          <p className="text-sm font-semibold text-foreground">
            {key.replace("UNIT_", "Unit ")}：{unit.name}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{unit.description}</p>
        </button>
      ))}
    </div>
  );
}
