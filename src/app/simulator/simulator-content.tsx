"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const BUILDING_TYPES = [
  { key: "factory", label: "工場・倉庫", icon: "M3.75 21V3.75m16.5 0V21" },
  { key: "hospital", label: "病院・介護", icon: "M12 4.5v15m7.5-7.5h-15" },
  { key: "hotel", label: "ホテル・旅館", icon: "M2.25 21h19.5m-18-18v18m10.5-18v18" },
  { key: "commercial", label: "ビル・マンション", icon: "M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18" },
  { key: "other", label: "その他", icon: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" },
];

const EQUIPMENT_OPTIONS = [
  { key: "hvac", label: "空調設備" },
  { key: "led", label: "照明（LED化）" },
  { key: "boiler", label: "ボイラー・給湯" },
  { key: "ev", label: "EV充電器導入" },
];

interface SimResult {
  totalSaving: number;
  paybackYears: number;
  totalInvestment: number;
  co2Reduction: number;
  units: {
    label: string;
    unit: string;
    title: string;
    description: string;
    annualSaving: number;
    paybackYears: number;
    badge: string;
    badgeColor: string;
  }[];
}

export function SimulatorContent() {
  const [tab, setTab] = useState<"energy" | "waste">("energy");
  const [buildingType, setBuildingType] = useState("factory");
  const [prefecture, setPrefecture] = useState("");
  const [electricityCost, setElectricityCost] = useState("");
  const [operatingHours, setOperatingHours] = useState("");
  const [floorArea, setFloorArea] = useState("");
  const [equipment, setEquipment] = useState<string[]>([]);
  const [evPlan, setEvPlan] = useState("no");
  const [result, setResult] = useState<SimResult | null>(null);
  const [loading, setLoading] = useState(false);

  function toggleEquipment(key: string) {
    setEquipment((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  }

  async function handleSimulate() {
    setLoading(true);
    // Mock calculation since we don't have all config data
    await new Promise((r) => setTimeout(r, 1000));

    const monthly = parseInt(electricityCost) || 500000;
    const totalSaving = Math.round(monthly * 12 * 0.28);
    const totalInvestment = Math.round(totalSaving * 4.2);

    setResult({
      totalSaving,
      paybackYears: 4.2,
      totalInvestment,
      co2Reduction: 42,
      units: [
        {
          label: "A",
          unit: "創エネ・蓄エネ",
          title: "屋根上太陽光発電 + 産業用蓄電池",
          description: "屋根スペース（約1,200㎡）を最大活用し、昼間の貧電を自給。蓄電池との併用でピークカットも。",
          annualSaving: Math.round(totalSaving * 0.5),
          paybackYears: 5.8,
          badge: "削減効果：大",
          badgeColor: "bg-orange-500 text-white",
        },
        {
          label: "D",
          unit: "運用・循環（産廃）",
          title: "廃プラ・金属くずの有価物化",
          description: "現在「処理費」を払って捨てている廃プラスチックと金属くずを選別し、「有価物」として売出ルートを構築します。",
          annualSaving: Math.round(totalSaving * 0.22),
          paybackYears: 0,
          badge: "即効性あり",
          badgeColor: "bg-green-500 text-white",
        },
        {
          label: "B",
          unit: "省エネ・効率化",
          title: "高効率空調更新 + 全館LED化",
          description: "15年以上前の空調機を高効率インバータ機へ更新。照明のLED化と合わせてベースロード電力を大幅カット。",
          annualSaving: Math.round(totalSaving * 0.18),
          paybackYears: 3.5,
          badge: "定番対策",
          badgeColor: "bg-blue-500 text-white",
        },
        {
          label: "C",
          unit: "モビリティ",
          title: "EV充電器設置 + V2H活用",
          description: "社用車のEV化に向けた充電インフラ整備。V2H導入により、EVを「走る蓄電池」としてピークカットに活用。",
          annualSaving: Math.round(totalSaving * 0.1),
          paybackYears: 0,
          badge: "付加価値提案",
          badgeColor: "bg-purple-500 text-white",
        },
      ],
    });
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      {/* Hero */}
      <section className="bg-primary py-12 text-center text-primary-foreground">
        <div className="mx-auto max-w-3xl px-4">
          <span className="inline-block rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-white">
            30秒で無料診断
          </span>
          <h1 className="mt-4 text-2xl font-bold sm:text-3xl">
            あなたの施設の<span className="text-orange-400">コスト削減ポテンシャル</span>を
            <br />今すぐ可視化します。
          </h1>
          <p className="mt-3 text-sm text-primary-foreground/80">
            電気代、設備更新、産廃処理費など、複合的な視点から削減額を算出。
            業種や課題に合わせた最適な対策プランをご提案します。
          </p>
        </div>
      </section>

      {/* Simulator Form */}
      {!result && (
        <section className="bg-background py-12">
          <div className="mx-auto max-w-3xl px-4">
            {/* Tabs */}
            <div className="flex rounded-t-xl border border-b-0">
              <button
                onClick={() => setTab("energy")}
                className={`flex-1 rounded-tl-xl px-4 py-3 text-sm font-semibold transition-colors ${
                  tab === "energy"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                <span className="mr-1">&#9889;</span> エネルギー・設備診断
                <span className="ml-1 text-xs font-normal opacity-70">（電気・空調・再エネ）</span>
              </button>
              <button
                onClick={() => setTab("waste")}
                className={`flex-1 rounded-tr-xl px-4 py-3 text-sm font-semibold transition-colors ${
                  tab === "waste"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                <span className="mr-1">&#9851;</span> 産廃コスト診断
                <span className="ml-1 text-xs font-normal opacity-70">（廃棄物・有価物）</span>
              </button>
            </div>

            <div className="rounded-b-xl border bg-card p-6 sm:p-8">
              {/* Step 1: Building Type */}
              <div>
                <h3 className="flex items-center gap-2 text-base font-semibold text-foreground">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">1</span>
                  建物の種類を選択してください
                </h3>
                <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-5">
                  {BUILDING_TYPES.map((b) => (
                    <button
                      key={b.key}
                      onClick={() => setBuildingType(b.key)}
                      className={`flex flex-col items-center rounded-lg border p-3 text-center transition-colors ${
                        buildingType === b.key
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={b.icon} />
                      </svg>
                      <span className="mt-1 text-xs font-medium">{b.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Basic Info */}
              <div className="mt-8">
                <h3 className="flex items-center gap-2 text-base font-semibold text-foreground">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">2</span>
                  基本情報を入力してください
                </h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>月平均の電気料金（概算）</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={electricityCost}
                        onChange={(e) => setElectricityCost(e.target.value)}
                        placeholder="例：500,000"
                      />
                      <span className="text-sm text-muted-foreground">円</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>稼働時間（1日あたり）</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={operatingHours}
                        onChange={(e) => setOperatingHours(e.target.value)}
                        placeholder="例：12"
                      />
                      <span className="text-sm text-muted-foreground">時間</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3: Equipment */}
              <div className="mt-8">
                <h3 className="flex items-center gap-2 text-base font-semibold text-foreground">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">3</span>
                  設備状況について教えてください
                  <span className="text-xs font-normal text-muted-foreground">（任意）</span>
                </h3>
                <div className="mt-4">
                  <Label>更新を検討している設備（複数選択可）</Label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {EQUIPMENT_OPTIONS.map((opt) => (
                      <button
                        key={opt.key}
                        onClick={() => toggleEquipment(opt.key)}
                        className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                          equipment.includes(opt.key)
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border text-muted-foreground hover:border-primary/50"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>屋根の概算面積（太陽光検討用）</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={floorArea}
                        onChange={(e) => setFloorArea(e.target.value)}
                        placeholder="分からない場合は「0」"
                      />
                      <span className="text-sm text-muted-foreground">㎡</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>EV導入予定について</Label>
                    <div className="flex gap-4 pt-2">
                      <label className="flex items-center gap-2 text-sm">
                        <input type="radio" name="ev" value="yes" checked={evPlan === "yes"} onChange={() => setEvPlan("yes")} />
                        あり（社用/来客用）
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <input type="radio" name="ev" value="no" checked={evPlan === "no"} onChange={() => setEvPlan("no")} />
                        なし
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <p className="mt-6 text-center text-xs text-muted-foreground">
                &#128274; 入力情報は暗号化され、シミュレーション以外の目的には使用されません。
              </p>

              <div className="mt-4 text-center">
                <Button
                  size="lg"
                  className="bg-orange-500 px-12 text-white hover:bg-orange-600"
                  onClick={handleSimulate}
                  disabled={loading || !electricityCost}
                >
                  {loading ? "計算中..." : "削減額をシミュレーションする →"}
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Results */}
      {result && (
        <section className="bg-background py-12">
          <div className="mx-auto max-w-5xl px-4">
            {/* Breadcrumb */}
            <p className="text-xs text-muted-foreground">
              <Link href="/" className="hover:underline">ホーム</Link> &gt;{" "}
              <Link href="/simulator" className="hover:underline">総合シミュレーター</Link> &gt;{" "}
              シミュレーション結果
            </p>

            <div className="mt-6">
              <p className="text-sm font-semibold uppercase tracking-wider text-secondary">SIMULATION RESULT</p>
              <h2 className="mt-1 text-2xl font-bold text-foreground">
                あなたの施設のコスト削減ポテンシャル
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                入力データに基づき、最適な対策プランと削減効果を算出しました。
              </p>
            </div>

            {/* Summary Cards */}
            <div className="mt-8 grid gap-4 sm:grid-cols-4">
              <div className="rounded-xl bg-primary p-6 text-primary-foreground">
                <p className="text-xs text-primary-foreground/70">年間コスト削減可能額（推定）</p>
                <p className="mt-2 text-4xl font-bold">
                  {Math.round(result.totalSaving / 10000)}<span className="text-lg font-normal">万円/年</span>
                </p>
              </div>
              <div className="rounded-xl border bg-card p-6">
                <p className="text-xs text-muted-foreground">投資回収目安</p>
                <p className="mt-2 text-3xl font-bold text-foreground">
                  {result.paybackYears}<span className="text-sm font-normal text-muted-foreground">年</span>
                </p>
              </div>
              <div className="rounded-xl border bg-card p-6">
                <p className="text-xs text-muted-foreground">初期投資額（概算）</p>
                <p className="mt-2 text-3xl font-bold text-foreground">
                  {Math.round(result.totalInvestment / 10000)}<span className="text-sm font-normal text-muted-foreground">万円</span>
                </p>
                <p className="text-xs text-muted-foreground">※PPAリース活用でP0円可</p>
              </div>
              <div className="rounded-xl border bg-card p-6">
                <p className="text-xs text-muted-foreground">CO2削減貢献量</p>
                <p className="mt-2 text-3xl font-bold text-foreground">
                  {result.co2Reduction}<span className="text-sm font-normal text-muted-foreground">t-CO2</span>
                </p>
              </div>
            </div>

            {/* Recommended Units */}
            <div className="mt-10">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-foreground">あなたへの推奨対策セット</h3>
                <p className="text-xs text-muted-foreground">すべて実施すると最大の削減効果が得られます</p>
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-2">
                {result.units.map((u, i) => (
                  <div key={i} className={`rounded-xl border bg-card p-6 ${i < 2 ? "border-orange-200" : ""}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">
                          {u.label}
                        </span>
                        <span className="text-sm font-semibold text-foreground">{u.unit}</span>
                      </div>
                      <span className={`rounded-full px-3 py-0.5 text-xs font-bold ${u.badgeColor}`}>
                        {u.badge}
                      </span>
                    </div>
                    <h4 className="mt-3 font-semibold text-foreground">{u.title}</h4>
                    <p className="mt-2 text-sm text-muted-foreground">{u.description}</p>
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">年間削減額</p>
                        <p className="text-xl font-bold text-foreground">
                          {Math.round(u.annualSaving / 10000)}万円
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">投資回収</p>
                        <p className="text-xl font-bold text-foreground">
                          {u.paybackYears === 0 ? "即時" : `${u.paybackYears}年`}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="mt-10 rounded-xl border bg-card p-8 text-center">
              <h3 className="text-lg font-bold text-foreground">
                このシミュレーション結果を保存・相談する
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                社内審議や比較検討のために、詳細なレポートを発行できます。
              </p>
              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                <Link href="/contact">
                  <Button size="lg" className="w-full bg-orange-500 text-white hover:bg-orange-600 sm:w-auto">
                    お問い合わせ・相談する
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  PDFレポート保存
                </Button>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={() => setResult(null)}
                className="text-sm text-secondary hover:underline"
              >
                &larr; 条件を変更して再計算する
              </button>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
