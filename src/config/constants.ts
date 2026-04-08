// ============================================
// G-NEX Platform Constants
// ============================================

export const SITE_NAME = "G-NEX";
export const SITE_DESCRIPTION =
  "建物のコスト削減マッチングプラットフォーム";

// Brand colors
export const COLORS = {
  primary: "#1F3864",
  secondary: "#2E75B6",
} as const;

// Service Units
export const SERVICE_UNITS = {
  unit_a: {
    key: "unit_a",
    name: "創エネ・蓄エネ",
    description: "太陽光発電、大型蓄電池、自家消費型エネルギー、ソーラーカーポート",
  },
  unit_b: {
    key: "unit_b",
    name: "省エネ・効率化",
    description: "LED化、高効率空調・ボイラー更新、遮熱塗装、EMS/デマンド監視",
  },
  unit_c: {
    key: "unit_c",
    name: "モビリティ",
    description: "EV充電器設置、V2H、EV関連補助金対応",
  },
  unit_d: {
    key: "unit_d",
    name: "運用・循環",
    description: "産廃処理費の適正化、有価物買取、マニフェスト管理",
  },
} as const;

// Building categories
export const BUILDING_CATEGORIES = {
  factory_warehouse: { name: "工場・倉庫", priority: "highest" },
  hospital_care: { name: "病院・介護施設", priority: "highest" },
  store_commercial: { name: "店舗・商業施設", priority: "high" },
  hotel_ryokan: { name: "ホテル・旅館", priority: "medium" },
  building_mansion: { name: "ビル・マンション", priority: "medium" },
  other: { name: "その他施設", priority: "low" },
} as const;

// Upload limits
export const UPLOAD_LIMITS = {
  maxFileSizeMB: 10,
  maxTotalSizeMB: 100,
} as const;
