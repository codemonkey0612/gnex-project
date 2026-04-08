import { z } from "zod";

export const createProjectSchema = z.object({
  serviceUnit: z.enum(["UNIT_A", "UNIT_B", "UNIT_C", "UNIT_D"], {
    message: "サービスUnitを選択してください",
  }),
  requestType: z.enum(["CONSTRUCTION", "EXPERT_CONSULT"]).default("CONSTRUCTION"),
  buildingType: z.enum([
    "FACTORY_WAREHOUSE",
    "HOSPITAL_CARE",
    "STORE_COMMERCIAL",
    "HOTEL_RYOKAN",
    "BUILDING_MANSION",
    "OTHER",
  ], {
    message: "建物種別を選択してください",
  }),
  prefecture: z.string().min(1, "都道府県を選択してください").optional(),
  city: z.string().max(100).optional(),
  address: z.string().max(200).optional(),
  budgetMin: z.number().int().positive().optional(),
  budgetMax: z.number().int().positive().optional(),
  description: z.string().max(5000).optional(),
  formResponses: z.record(z.string(), z.unknown()).optional(),
  isPrivate: z.boolean().default(false),
  isPhotoPrivate: z.boolean().default(false),
  leadSubsidy: z.boolean().default(false),
  leadFinance: z.boolean().default(false),
  leadWaste: z.boolean().default(false),
  publish: z.boolean().default(false),
});

export const updateProjectSchema = z.object({
  serviceUnit: z.enum(["UNIT_A", "UNIT_B", "UNIT_C", "UNIT_D"]).optional(),
  requestType: z.enum(["CONSTRUCTION", "EXPERT_CONSULT"]).optional(),
  buildingType: z.enum([
    "FACTORY_WAREHOUSE",
    "HOSPITAL_CARE",
    "STORE_COMMERCIAL",
    "HOTEL_RYOKAN",
    "BUILDING_MANSION",
    "OTHER",
  ]).optional(),
  prefecture: z.string().max(10).optional(),
  city: z.string().max(100).optional(),
  address: z.string().max(200).optional(),
  budgetMin: z.number().int().positive().nullable().optional(),
  budgetMax: z.number().int().positive().nullable().optional(),
  description: z.string().max(5000).optional(),
  formResponses: z.record(z.string(), z.unknown()).optional(),
  isPrivate: z.boolean().optional(),
  isPhotoPrivate: z.boolean().optional(),
  leadSubsidy: z.boolean().optional(),
  leadFinance: z.boolean().optional(),
  leadWaste: z.boolean().optional(),
  status: z.enum(["DRAFT", "OPEN", "IN_REVIEW", "IN_PROGRESS", "COMPLETED", "CANCELLED"]).optional(),
});

export const projectQuerySchema = z.object({
  status: z.enum(["DRAFT", "OPEN", "IN_REVIEW", "IN_PROGRESS", "COMPLETED", "CANCELLED"]).optional(),
  serviceUnit: z.enum(["UNIT_A", "UNIT_B", "UNIT_C", "UNIT_D"]).optional(),
  prefecture: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type ProjectQuery = z.infer<typeof projectQuerySchema>;
