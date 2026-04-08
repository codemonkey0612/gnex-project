"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WizardSteps } from "@/components/ui/wizard-steps";

const INQUIRY_TYPES = [
  { value: "quote", label: "見積依頼", sub: "具体的な見積もりを知りたい" },
  { value: "survey", label: "現地調査依頼", sub: "工場や施設を見てほしい" },
  { value: "subsidy", label: "補助金相談", sub: "補助金活用について相談したい" },
  { value: "waste", label: "産廃見直し", sub: "処理費用の最適化" },
  { value: "energy", label: "再エネ・省エネ相談", sub: "電気代削減の相談" },
  { value: "other", label: "その他", sub: "パートナー提携など" },
];

const STEPS = ["入力", "確認", "完了"];

export default function ContactPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    inquiryType: "quote",
    buildingType: "",
    area: "",
    challenges: [] as string[],
    budget: "",
    description: "",
    companyName: "",
    contactLastName: "",
    contactFirstName: "",
    email: "",
    phone: "",
    postalCode: "",
    prefecture: "",
    city: "",
    buildingName: "",
    timeline: "",
    privacy: false,
  });

  function updateField(key: string, value: unknown) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleChallenge(c: string) {
    setForm((prev) => ({
      ...prev,
      challenges: prev.challenges.includes(c)
        ? prev.challenges.filter((x) => x !== c)
        : [...prev.challenges, c],
    }));
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      {/* Hero */}
      <section className="bg-primary py-12 text-center text-primary-foreground">
        <div className="mx-auto max-w-3xl px-4">
          <p className="text-xs text-primary-foreground/60">ホーム &gt; お問い合わせ</p>
          <h1 className="mt-4 text-2xl font-bold sm:text-3xl">
            お問い合わせ・能料診断
          </h1>
          <p className="mt-2 text-sm text-primary-foreground/80">
            コスト削減のプロフェッショナルが、貴社の課題に最適なソリューションをご提案します。
            シミュレーション結果をお持ちの場合は、より具体的なご提案が可能です。
          </p>
        </div>
      </section>

      {/* Wizard */}
      <section className="bg-background py-12">
        <div className="mx-auto max-w-3xl px-4">
          <WizardSteps steps={STEPS} currentStep={step} />

          {step === 0 && (
            <div className="mt-8 space-y-8">
              {/* Inquiry Type */}
              <div>
                <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                  <span className="text-primary">|</span> お問い合わせ種別
                  <span className="rounded bg-destructive/10 px-1.5 py-0.5 text-[10px] font-bold text-destructive">必須</span>
                </h3>
                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  {INQUIRY_TYPES.map((t) => (
                    <button
                      key={t.value}
                      onClick={() => updateField("inquiryType", t.value)}
                      className={`rounded-lg border p-4 text-left transition-colors ${
                        form.inquiryType === t.value
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <p className="text-sm font-semibold text-foreground">{t.label}</p>
                      <p className="text-xs text-muted-foreground">{t.sub}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Building Info */}
              <div>
                <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                  <span className="text-primary">|</span> 建物・課題情報
                </h3>
                <div className="mt-3 grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>建物種別</Label>
                    <select
                      value={form.buildingType}
                      onChange={(e) => updateField("buildingType", e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="">選択してください</option>
                      <option value="factory">工場・倉庫</option>
                      <option value="hospital">病院・介護施設</option>
                      <option value="hotel">ホテル・旅館</option>
                      <option value="commercial">商業施設</option>
                      <option value="building">ビル・マンション</option>
                      <option value="other">その他</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>延床面積（概算）</Label>
                    <Input placeholder="例：2000" />
                  </div>
                </div>

                <div className="mt-4">
                  <Label>現状の課題（複数選択可）</Label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {["電気代が高騰している", "空調の効きが悪い・古い", "産廃処理費を削減したい", "脱炭素・ESG対応を求められている", "設備更新を検討している", "補助金を活用したい"].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => toggleChallenge(c)}
                        className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                          form.challenges.includes(c)
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border text-muted-foreground hover:border-primary/50"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                  <span className="text-primary">|</span> 質種・ご希望
                  <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">任意</span>
                </h3>
                <textarea
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  className="mt-3 flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  rows={4}
                  placeholder="具体的なお悩みや、検討中の設備があればご記入ください。"
                />
              </div>

              {/* Contact Info */}
              <div>
                <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                  <span className="text-primary">|</span> ご連絡先情報
                </h3>
                <div className="mt-3 grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>会社名 <span className="text-destructive">*</span></Label>
                    <Input
                      value={form.companyName}
                      onChange={(e) => updateField("companyName", e.target.value)}
                      placeholder="例：株式会社G-NEX"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label>ご担当者名 <span className="text-destructive">*</span></Label>
                      <Input
                        value={form.contactLastName}
                        onChange={(e) => updateField("contactLastName", e.target.value)}
                        placeholder="姓"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>&nbsp;</Label>
                      <Input
                        value={form.contactFirstName}
                        onChange={(e) => updateField("contactFirstName", e.target.value)}
                        placeholder="名"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>メールアドレス <span className="text-destructive">*</span></Label>
                    <Input
                      type="email"
                      value={form.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      placeholder="例：info@g-nex.co.jp"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>電話番号 <span className="text-destructive">*</span></Label>
                    <Input
                      value={form.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      placeholder="例：03-1234-5678"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <Label>導入希望時期</Label>
                  <div className="mt-2 flex flex-wrap gap-3">
                    {["すぐにでも", "3ヶ月以内", "半年以内", "未検・情対段階"].map((t) => (
                      <label key={t} className="flex items-center gap-2 text-sm">
                        <input
                          type="radio"
                          name="timeline"
                          value={t}
                          checked={form.timeline === t}
                          onChange={(e) => updateField("timeline", e.target.value)}
                          className="h-4 w-4"
                        />
                        {t}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="text-center">
                <label className="flex items-center justify-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.privacy}
                    onChange={(e) => updateField("privacy", e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Link href="/privacy" className="text-secondary hover:underline">
                    プライバシーポリシー
                  </Link>
                  に同意して送信します。
                </label>
                <Button
                  size="lg"
                  className="mt-4 bg-orange-500 text-white hover:bg-orange-600"
                  disabled={!form.privacy || !form.companyName || !form.email}
                  onClick={() => setStep(1)}
                >
                  入力内容を確認する
                </Button>
                <p className="mt-2 text-xs text-muted-foreground">
                  ※ 送信後、現地調査の日程について担当より ご連絡いたします。
                </p>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="mt-8 space-y-6">
              <div className="rounded-lg border bg-card p-6">
                <h3 className="text-lg font-semibold text-foreground">入力内容の確認</h3>
                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">お問い合わせ種別</span>
                    <span className="font-medium">{INQUIRY_TYPES.find((t) => t.value === form.inquiryType)?.label}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">会社名</span>
                    <span className="font-medium">{form.companyName}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">メール</span>
                    <span className="font-medium">{form.email}</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-center gap-4">
                <Button variant="outline" onClick={() => setStep(0)}>戻る</Button>
                <Button className="bg-orange-500 text-white hover:bg-orange-600" onClick={() => setStep(2)}>
                  送信する
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="mt-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="mt-4 text-2xl font-bold text-foreground">送信完了</h2>
              <p className="mt-2 text-muted-foreground">
                お問い合わせありがとうございます。
                担当者より2営業日以内にご連絡いたします。
              </p>
              <Link href="/">
                <Button className="mt-6">トップページに戻る</Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
