"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { WizardSteps } from "@/components/ui/wizard-steps";
import { ServiceUnitSelector } from "@/components/forms/service-unit-selector";
import { FileUploadZone, type UploadedFile } from "@/components/forms/file-upload-zone";
import { BUILDING_TYPE_LABELS } from "@/lib/constants";
import { PREFECTURES } from "@/lib/constants";

const STEPS = ["カテゴリー選択", "建物・詳細情報", "写真・ファイル", "確認"];

const SERVICE_UNIT_LABELS: Record<string, string> = {
  UNIT_A: "Unit A：創エネ・蓄エネ",
  UNIT_B: "Unit B：省エネ・効率化",
  UNIT_C: "Unit C：モビリティ",
  UNIT_D: "Unit D：運用・循環",
};

interface FormData {
  serviceUnit: string;
  requestType: string;
  buildingType: string;
  prefecture: string;
  city: string;
  address: string;
  budgetMin: string;
  budgetMax: string;
  description: string;
  isPrivate: boolean;
  isPhotoPrivate: boolean;
  leadSubsidy: boolean;
  leadFinance: boolean;
  leadWaste: boolean;
}

export function ProjectWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>({
    serviceUnit: "",
    requestType: "CONSTRUCTION",
    buildingType: "OTHER",
    prefecture: "",
    city: "",
    address: "",
    budgetMin: "",
    budgetMax: "",
    description: "",
    isPrivate: false,
    isPhotoPrivate: false,
    leadSubsidy: false,
    leadFinance: false,
    leadWaste: false,
  });
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  function updateField<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  function validateStep0() {
    if (!form.serviceUnit) {
      setErrors({ serviceUnit: "サービスUnitを選択してください" });
      return false;
    }
    return true;
  }

  function validateStep1() {
    const errs: Record<string, string> = {};
    if (!form.buildingType) errs.buildingType = "建物種別を選択してください";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleNext() {
    if (step === 0 && validateStep0()) setStep(1);
    else if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2) setStep(3);
  }

  function handleBack() {
    setStep((s) => Math.max(0, s - 1));
    setServerError("");
  }

  async function handleSubmit(publish: boolean) {
    setServerError("");
    setLoading(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceUnit: form.serviceUnit,
          requestType: form.requestType,
          buildingType: form.buildingType,
          prefecture: form.prefecture || undefined,
          city: form.city || undefined,
          address: form.address || undefined,
          budgetMin: form.budgetMin ? parseInt(form.budgetMin, 10) : undefined,
          budgetMax: form.budgetMax ? parseInt(form.budgetMax, 10) : undefined,
          description: form.description || undefined,
          isPrivate: form.isPrivate,
          isPhotoPrivate: form.isPhotoPrivate,
          leadSubsidy: form.leadSubsidy,
          leadFinance: form.leadFinance,
          leadWaste: form.leadWaste,
          publish,
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        setServerError(result.error);
        return;
      }

      // Upload files if any
      if (files.length > 0) {
        const formData = new FormData();
        for (const f of files) {
          formData.append("files", f.file);
        }
        await fetch(`/api/projects/${result.data.id}/files`, {
          method: "POST",
          body: formData,
        });
      }

      router.push(`/dashboard/issuer/projects/${result.data.id}`);
    } catch {
      setServerError("案件の作成中にエラーが発生しました");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">新規案件を投稿</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          ウィザードに沿って案件情報を入力してください
        </p>
      </div>

      <WizardSteps steps={STEPS} currentStep={step} />

      {serverError && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{serverError}</AlertDescription>
        </Alert>
      )}

      <div className="rounded-lg border bg-card p-6">
        {/* Step 0: Category Selection */}
        {step === 0 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>サービスUnit *</Label>
              <ServiceUnitSelector
                value={form.serviceUnit}
                onChange={(v) => updateField("serviceUnit", v)}
              />
              {errors.serviceUnit && (
                <p className="text-xs text-destructive">{errors.serviceUnit}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>依頼種別</Label>
              <div className="flex gap-3">
                {[
                  { value: "CONSTRUCTION", label: "工事の依頼" },
                  { value: "EXPERT_CONSULT", label: "補助金・助成金の相談" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => updateField("requestType", opt.value)}
                    className={`flex-1 rounded-md border p-3 text-sm transition-colors ${
                      form.requestType === opt.value
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <Button onClick={handleNext} className="w-full">次へ</Button>
          </div>
        )}

        {/* Step 1: Building & Details */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>建物種別 *</Label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(BUILDING_TYPE_LABELS).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => updateField("buildingType", key)}
                    className={`rounded-md border p-3 text-left text-sm transition-colors ${
                      form.buildingType === key
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              {errors.buildingType && (
                <p className="text-xs text-destructive">{errors.buildingType}</p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="prefecture">都道府県</Label>
                <select
                  id="prefecture"
                  value={form.prefecture}
                  onChange={(e) => updateField("prefecture", e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">選択してください</option>
                  {PREFECTURES.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">市区町村</Label>
                <Input
                  id="city"
                  value={form.city}
                  onChange={(e) => updateField("city", e.target.value)}
                  placeholder="千代田区"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">住所（任意）</Label>
              <Input
                id="address"
                value={form.address}
                onChange={(e) => updateField("address", e.target.value)}
                placeholder="丸の内1-1-1"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="budgetMin">予算目安 下限（万円）</Label>
                <Input
                  id="budgetMin"
                  type="number"
                  value={form.budgetMin}
                  onChange={(e) => updateField("budgetMin", e.target.value)}
                  placeholder="100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="budgetMax">予算目安 上限（万円）</Label>
                <Input
                  id="budgetMax"
                  type="number"
                  value={form.budgetMax}
                  onChange={(e) => updateField("budgetMax", e.target.value)}
                  placeholder="500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">依頼内容の詳細</Label>
              <textarea
                id="description"
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="ご依頼内容をできるだけ詳しくご記入ください"
                rows={4}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div className="space-y-3 rounded-md border p-4">
              <p className="text-sm font-medium text-foreground">追加相談オプション</p>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.leadSubsidy}
                  onChange={(e) => updateField("leadSubsidy", e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                補助金・助成金の活用を相談したい
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.leadFinance}
                  onChange={(e) => updateField("leadFinance", e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                初期費用0円での導入を相談したい
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.leadWaste}
                  onChange={(e) => updateField("leadWaste", e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                廃棄・有価物買取について相談したい
              </label>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={handleBack} className="flex-1">戻る</Button>
              <Button onClick={handleNext} className="flex-1">次へ</Button>
            </div>
          </div>
        )}

        {/* Step 2: Photos & Files */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>写真・ファイルの添付（任意）</Label>
              <FileUploadZone files={files} onChange={setFiles} />
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.isPrivate}
                  onChange={(e) => updateField("isPrivate", e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                案件を非公開にする（運営者のみ閲覧可能）
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.isPhotoPrivate}
                  onChange={(e) => updateField("isPhotoPrivate", e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                写真を非公開にする
              </label>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={handleBack} className="flex-1">戻る</Button>
              <Button onClick={handleNext} className="flex-1">次へ</Button>
            </div>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">入力内容の確認</h3>

            <div className="rounded-md border p-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">サービスUnit</span>
                <span className="font-medium">{SERVICE_UNIT_LABELS[form.serviceUnit] ?? form.serviceUnit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">依頼種別</span>
                <span className="font-medium">{form.requestType === "CONSTRUCTION" ? "工事の依頼" : "補助金・助成金の相談"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">建物種別</span>
                <span className="font-medium">{BUILDING_TYPE_LABELS[form.buildingType]}</span>
              </div>
              {form.prefecture && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">所在地</span>
                  <span className="font-medium">{form.prefecture} {form.city}</span>
                </div>
              )}
              {(form.budgetMin || form.budgetMax) && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">予算目安</span>
                  <span className="font-medium">
                    {form.budgetMin && `${form.budgetMin}万円`}
                    {form.budgetMin && form.budgetMax && " 〜 "}
                    {form.budgetMax && `${form.budgetMax}万円`}
                  </span>
                </div>
              )}
              {form.description && (
                <div>
                  <span className="text-muted-foreground">依頼内容</span>
                  <p className="mt-1 font-medium whitespace-pre-wrap">{form.description}</p>
                </div>
              )}
              {files.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">添付ファイル</span>
                  <span className="font-medium">{files.length}件</span>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={handleBack} className="flex-1">戻る</Button>
              <Button
                variant="outline"
                onClick={() => handleSubmit(false)}
                className="flex-1"
                disabled={loading}
              >
                下書き保存
              </Button>
              <Button
                onClick={() => handleSubmit(true)}
                className="flex-1"
                disabled={loading}
              >
                {loading ? "投稿中..." : "公開する"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
