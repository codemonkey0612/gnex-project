// ============================================
// G-NEX Platform Type Definitions
// ============================================

// User types
export type UserRole = "client" | "contractor" | "lead_buyer" | "admin";

export type ContractorType = "standard" | "lead_purchase";

export type LeadBuyerCategory = "legal" | "finance" | "waste";

// Service categories (4 Units)
export type ServiceUnit = "unit_a" | "unit_b" | "unit_c" | "unit_d";

// Building types
export type BuildingType =
  | "factory_warehouse"
  | "hospital_care"
  | "store_commercial"
  | "hotel_ryokan"
  | "building_mansion"
  | "other";

// Project status
export type ProjectStatus =
  | "draft"
  | "open"
  | "in_progress"
  | "completed"
  | "cancelled";

// Simulator pattern types
export type SimulatorPattern = "pattern_a" | "pattern_b";
