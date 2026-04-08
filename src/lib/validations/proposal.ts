import { z } from "zod";

export const createProposalSchema = z.object({
  content: z.string().min(1, "提案内容を入力してください").max(10000),
  priceMin: z.number().int().positive("金額は正の整数で入力してください").optional(),
  priceMax: z.number().int().positive("金額は正の整数で入力してください").optional(),
  cannotEstimate: z.string().max(2000).optional(),
  estimatedDays: z.number().int().positive("日数は正の整数で入力してください").optional(),
});

export const updateProposalStatusSchema = z.object({
  status: z.enum(["SHORTLISTED", "SELECTED", "REJECTED", "WITHDRAWN"], {
    message: "有効なステータスを選択してください",
  }),
});

export type CreateProposalInput = z.infer<typeof createProposalSchema>;
export type UpdateProposalStatusInput = z.infer<typeof updateProposalStatusSchema>;
