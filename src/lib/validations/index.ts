import { z } from "zod";

// Re-export all validation schemas
export * from "./project";
export * from "./proposal";
export * from "./message";

// Simulator
export const simulatorInputSchema = z.object({
  configId: z.string().min(1, "設定IDを指定してください"),
  inputValue: z.number().positive("入力値は正の数で入力してください"),
});

export type SimulatorInput = z.infer<typeof simulatorInputSchema>;

// Lead Purchase
export const leadPurchaseSchema = z.object({
  leadType: z.enum(["SUBSIDY", "FINANCE", "WASTE"], {
    message: "リード種別を選択してください",
  }),
});

export type LeadPurchaseInput = z.infer<typeof leadPurchaseSchema>;

// Admin: User Update
export const adminUserUpdateSchema = z.object({
  status: z.enum(["ACTIVE", "SUSPENDED"], {
    message: "有効なステータスを選択してください",
  }),
});

export type AdminUserUpdateInput = z.infer<typeof adminUserUpdateSchema>;

// Admin: Lead Pricing Update
export const leadPricingUpdateSchema = z.object({
  leadType: z.enum(["SUBSIDY", "FINANCE", "WASTE"]),
  priceYen: z.number().int().positive("単価は正の整数で入力してください"),
  isActive: z.boolean().optional(),
});

export type LeadPricingUpdateInput = z.infer<typeof leadPricingUpdateSchema>;

// Notification
export const markNotificationReadSchema = z.object({
  isRead: z.boolean().default(true),
});
