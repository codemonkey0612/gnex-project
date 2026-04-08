import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .email("有効なメールアドレスを入力してください")
    .max(255),
  password: z
    .string()
    .min(8, "パスワードは8文字以上で入力してください")
    .max(128),
});

// Base fields shared by all registration forms
const baseRegistrationFields = {
  email: z
    .string()
    .email("有効なメールアドレスを入力してください")
    .max(255),
  password: z
    .string()
    .min(8, "パスワードは8文字以上で入力してください")
    .max(128)
    .regex(
      /^(?=.*[a-zA-Z])(?=.*\d)/,
      "パスワードには英字と数字を含めてください",
    ),
  confirmPassword: z.string(),
  contactName: z.string().min(1, "担当者名を入力してください").max(100),
};

// Object schemas (without refine) - used for discriminated union
const clientObjectSchema = z.object({
  ...baseRegistrationFields,
  role: z.literal("CLIENT"),
  companyName: z.string().max(200).optional(),
  buildingType: z.enum([
    "FACTORY_WAREHOUSE",
    "HOSPITAL_CARE",
    "STORE_COMMERCIAL",
    "HOTEL_RYOKAN",
    "BUILDING_MANSION",
    "OTHER",
  ]),
  prefecture: z.string().min(1, "都道府県を選択してください").optional(),
});

const contractorObjectSchema = z.object({
  ...baseRegistrationFields,
  role: z.literal("CONTRACTOR"),
  companyName: z.string().min(1, "企業名を入力してください").max(200),
  phone: z
    .string()
    .min(1, "電話番号を入力してください")
    .regex(/^[\d-]+$/, "有効な電話番号を入力してください"),
  description: z.string().max(2000).optional(),
  serviceUnits: z
    .array(z.enum(["UNIT_A", "UNIT_B", "UNIT_C", "UNIT_D"]))
    .min(1, "対応Unitを1つ以上選択してください"),
  serviceAreas: z
    .array(z.string())
    .min(1, "対応エリアを1つ以上選択してください"),
});

const leadBuyerObjectSchema = z.object({
  ...baseRegistrationFields,
  role: z.literal("LEAD_BUYER"),
  companyName: z.string().min(1, "企業名を入力してください").max(200),
  phone: z
    .string()
    .min(1, "電話番号を入力してください")
    .regex(/^[\d-]+$/, "有効な電話番号を入力してください"),
  category: z.enum(["LEGAL", "FINANCE", "WASTE"], {
    message: "属性を選択してください",
  }),
  serviceAreas: z
    .array(z.string())
    .min(1, "対応エリアを1つ以上選択してください"),
});

// Refined schemas with password matching (for client-side validation)
const passwordMatch = (data: { password: string; confirmPassword: string }) =>
  data.password === data.confirmPassword;

const passwordMatchError = {
  message: "パスワードが一致しません",
  path: ["confirmPassword"] as string[],
};

export const registerClientSchema = clientObjectSchema.refine(
  passwordMatch,
  passwordMatchError,
);
export const registerContractorSchema = contractorObjectSchema.refine(
  passwordMatch,
  passwordMatchError,
);
export const registerLeadBuyerSchema = leadBuyerObjectSchema.refine(
  passwordMatch,
  passwordMatchError,
);

// Union schema for API route - uses object schemas (password match checked in route)
export const registerSchema = z.discriminatedUnion("role", [
  clientObjectSchema,
  contractorObjectSchema,
  leadBuyerObjectSchema,
]);

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email("有効なメールアドレスを入力してください")
    .max(255),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1),
    password: z
      .string()
      .min(8, "パスワードは8文字以上で入力してください")
      .max(128)
      .regex(
        /^(?=.*[a-zA-Z])(?=.*\d)/,
        "パスワードには英字と数字を含めてください",
      ),
    confirmPassword: z.string(),
  })
  .refine(passwordMatch, passwordMatchError);

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterClientInput = z.infer<typeof registerClientSchema>;
export type RegisterContractorInput = z.infer<typeof registerContractorSchema>;
export type RegisterLeadBuyerInput = z.infer<typeof registerLeadBuyerSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
