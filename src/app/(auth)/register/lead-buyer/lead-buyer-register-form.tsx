"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { WizardSteps } from "@/components/ui/wizard-steps";
import { AreaSelect } from "@/components/ui/area-select";
import { LEAD_BUYER_CATEGORY_LABELS } from "@/lib/constants";

const STEPS = ["企業情報", "属性・エリア", "アカウント", "確認"];

type Category = "LEGAL" | "FINANCE" | "WASTE";

interface FormData {
  contactName: string;
  companyName: string;
  phone: string;
  category: Category | "";
  serviceAreas: string[];
  email: string;
  password: string;
  confirmPassword: string;
}

interface FieldErrors {
  [key: string]: string;
}

export function LeadBuyerRegisterForm() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>({
    contactName: "",
    companyName: "",
    phone: "",
    category: "",
    serviceAreas: [],
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function updateField<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  function validateStep0(): boolean {
    const errs: FieldErrors = {};
    if (!form.contactName.trim())
      errs.contactName = "担当者名を入力してください";
    if (!form.companyName.trim())
      errs.companyName = "企業名を入力してください";
    if (!form.phone.trim()) errs.phone = "電話番号を入力してください";
    else if (!/^[\d-]+$/.test(form.phone))
      errs.phone = "有効な電話番号を入力してください";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function validateStep1(): boolean {
    const errs: FieldErrors = {};
    if (!form.category) errs.category = "属性を選択してください";
    if (form.serviceAreas.length === 0)
      errs.serviceAreas = "対応エリアを1つ以上選択してください";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function validateStep2(): boolean {
    const errs: FieldErrors = {};
    if (!form.email.trim()) errs.email = "メールアドレスを入力してください";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "有効なメールアドレスを入力してください";
    if (form.password.length < 8)
      errs.password = "パスワードは8文字以上で入力してください";
    else if (!/^(?=.*[a-zA-Z])(?=.*\d)/.test(form.password))
      errs.password = "パスワードには英字と数字を含めてください";
    if (form.password !== form.confirmPassword)
      errs.confirmPassword = "パスワードが一致しません";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleNext() {
    if (step === 0 && validateStep0()) setStep(1);
    else if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  }

  function handleBack() {
    setStep((s) => Math.max(0, s - 1));
    setServerError("");
  }

  async function handleSubmit() {
    setServerError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: "LEAD_BUYER",
          contactName: form.contactName,
          companyName: form.companyName,
          phone: form.phone,
          category: form.category,
          serviceAreas: form.serviceAreas,
          email: form.email,
          password: form.password,
          confirmPassword: form.confirmPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setServerError(data.error);
        return;
      }
      setSuccess(true);
    } catch {
      setServerError("登録中にエラーが発生しました");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-lg border bg-card p-8 shadow-sm text-center">
        <h1 className="text-2xl font-bold text-foreground">登録完了</h1>
        <Alert variant="success" className="mt-4">
          <AlertDescription>
            確認メールを送信しました。メール確認後、運営者による審査を行います。承認されるとリード購入機能をご利用いただけます。
          </AlertDescription>
        </Alert>
        <Link href="/login">
          <Button variant="outline" className="mt-6">
            ログインページへ
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card p-8 shadow-sm">
      <div className="mb-2 text-center">
        <h1 className="text-2xl font-bold text-foreground">
          パートナー 新規登録
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          士業・金融・産廃業者の方
        </p>
      </div>

      <WizardSteps steps={STEPS} currentStep={step} />

      {serverError && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{serverError}</AlertDescription>
        </Alert>
      )}

      {/* Step 0: Company Info */}
      {step === 0 && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="contactName">担当者名 *</Label>
            <Input
              id="contactName"
              value={form.contactName}
              onChange={(e) => updateField("contactName", e.target.value)}
              placeholder="山田 太郎"
            />
            {errors.contactName && (
              <p className="text-xs text-destructive">{errors.contactName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyName">企業名 *</Label>
            <Input
              id="companyName"
              value={form.companyName}
              onChange={(e) => updateField("companyName", e.target.value)}
              placeholder="株式会社サンプル"
            />
            {errors.companyName && (
              <p className="text-xs text-destructive">{errors.companyName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">電話番号 *</Label>
            <Input
              id="phone"
              type="tel"
              value={form.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              placeholder="03-1234-5678"
            />
            {errors.phone && (
              <p className="text-xs text-destructive">{errors.phone}</p>
            )}
          </div>

          <Button onClick={handleNext} className="w-full">
            次へ
          </Button>
        </div>
      )}

      {/* Step 1: Category & Areas */}
      {step === 1 && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>属性 *</Label>
            <div className="space-y-2">
              {(
                Object.entries(LEAD_BUYER_CATEGORY_LABELS) as [string, string][]
              ).map(([key, label]) => (
                <label
                  key={key}
                  className={`flex cursor-pointer items-center gap-3 rounded-md border p-3 text-sm transition-colors ${
                    form.category === key
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="category"
                    checked={form.category === key}
                    onChange={() => updateField("category", key as Category)}
                    className="h-4 w-4 border-gray-300"
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
            {errors.category && (
              <p className="text-xs text-destructive">{errors.category}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>対応エリア *（複数選択可）</Label>
            <AreaSelect
              selected={form.serviceAreas}
              onChange={(areas) => updateField("serviceAreas", areas)}
            />
            {errors.serviceAreas && (
              <p className="text-xs text-destructive">{errors.serviceAreas}</p>
            )}
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={handleBack} className="flex-1">
              戻る
            </Button>
            <Button onClick={handleNext} className="flex-1">
              次へ
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Account */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">メールアドレス *</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder="example@company.jp"
              autoComplete="email"
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">パスワード *</Label>
            <Input
              id="password"
              type="password"
              value={form.password}
              onChange={(e) => updateField("password", e.target.value)}
              placeholder="英字と数字を含む8文字以上"
              autoComplete="new-password"
            />
            {errors.password && (
              <p className="text-xs text-destructive">{errors.password}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">パスワード（確認） *</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={(e) => updateField("confirmPassword", e.target.value)}
              autoComplete="new-password"
            />
            {errors.confirmPassword && (
              <p className="text-xs text-destructive">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={handleBack} className="flex-1">
              戻る
            </Button>
            <Button onClick={handleNext} className="flex-1">
              次へ
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Confirmation */}
      {step === 3 && (
        <div className="space-y-4">
          <div className="rounded-md border p-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">担当者名</span>
              <span className="font-medium">{form.contactName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">企業名</span>
              <span className="font-medium">{form.companyName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">電話番号</span>
              <span className="font-medium">{form.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">属性</span>
              <span className="font-medium">
                {form.category
                  ? LEAD_BUYER_CATEGORY_LABELS[form.category]
                  : ""}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">対応エリア</span>
              <p className="mt-1 text-xs font-medium">
                {form.serviceAreas.length}件選択済み
              </p>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">メールアドレス</span>
              <span className="font-medium">{form.email}</span>
            </div>
          </div>

          <Alert className="border-amber-200 bg-amber-50 text-amber-800">
            <AlertDescription>
              パートナーアカウントは、メール確認後に運営者による審査があります。審査完了までお時間をいただく場合があります。
            </AlertDescription>
          </Alert>

          <div className="flex gap-3">
            <Button variant="outline" onClick={handleBack} className="flex-1">
              戻る
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1"
              disabled={loading}
            >
              {loading ? "登録中..." : "登録する"}
            </Button>
          </div>
        </div>
      )}

      <p className="mt-6 text-center text-sm text-muted-foreground">
        既にアカウントをお持ちの方は{" "}
        <Link href="/login" className="text-secondary hover:underline">
          ログイン
        </Link>
      </p>
    </div>
  );
}
