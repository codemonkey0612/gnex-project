"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const BUILDING_FILTERS = ["すべて", "工場・倉庫", "病院・介護", "ホテル・旅館", "ビル・商し"];
const UNIT_FILTERS = ["すべて", "創エネ・蓄エネ", "省エネ・効率化", "モビリティ", "運設・循環"];

const CASE_STUDIES = [
  {
    id: 1,
    title: "廃プラ有価物化の利益を原資に、屋根上太陽光を初期投資ゼロで導入",
    building: "工場・倉庫",
    units: ["D", "A"],
    location: "大阪府 金属加工工場（従業員50名）の事例。産コスト削減を原資に太陽光発電を導入。",
    annualSaving: "300",
    payback: "2.5",
    co2: "▲ 25%",
  },
  {
    id: 2,
    title: "補助金を活用で大型蓄電池を導入。BCP対策と電気代削減を両立",
    building: "病院・介護",
    units: ["A"],
    location: "神奈川県 特別養護老人ホーム（100床）。災害時の電源確保を主目的に導入。",
    annualSaving: "180",
    payback: "1/3 (補助金)",
    co2: "積極投資回収",
  },
  {
    id: 3,
    title: "重油ボイラーからの燃料転換とEV充電器設置でインバウンド客を獲得",
    building: "ホテル・旅館",
    units: ["B", "C"],
    location: "長野県 温泉旅館。ボイラーを高効率ヒートポンプへ更新し、CO2削減と光熱費を削減。",
    annualSaving: "550",
    payback: "3.2",
    co2: "▲ 40電",
  },
  {
    id: 4,
    title: "共用部LED化と電子ブレーカー導入で、管理組合の修繕積立金を確保",
    building: "ビル・マンション",
    units: ["B"],
    location: "東京都 大規模マンション（300戸）。24時間照灯する共用部照明のLED化で、電気代を60%削減。",
    annualSaving: "120",
    payback: "1.8",
    co2: "工削減",
  },
  {
    id: 5,
    title: "物流倉庫の遮熱塗装と水銀灯廃止で、夏場の作業環境を劇的に改善",
    building: "工場・倉庫",
    units: ["B"],
    location: "埼玉県 物流センター。屋根への遮熱塗装で倉庫内温度を5℃低下。空調効率アップとLED化の併用。",
    annualSaving: "420",
    payback: "3.0",
    co2: "▲ 9.2℃",
  },
  {
    id: 6,
    title: "社用車のEVシフトとV2H導入で、ガソリン代削減と防災拠点化を実現",
    building: "ビル・商し",
    units: ["C", "A"],
    location: "愛知県 建設会社。営業車10台をEVに入替、太陽光発電と連携し、燃料費をほぼ0に。",
    annualSaving: "210",
    payback: "4.5",
    co2: "▲ 30%",
  },
];

export default function CaseStudiesPage() {
  const [buildingFilter, setBuildingFilter] = useState("すべて");
  const [unitFilter, setUnitFilter] = useState("すべて");

  const filtered = CASE_STUDIES.filter((cs) => {
    if (buildingFilter !== "すべて" && cs.building !== buildingFilter) return false;
    return true;
  });

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      {/* Hero */}
      <section className="bg-primary py-16 text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs uppercase tracking-wider text-primary-foreground/60">ホーム &gt; 導入事例</p>
          <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-secondary">SUCCESS STORIES</p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
            コスト削減の実証データと
            <br />成功のプロセス
          </h1>
          <p className="mt-4 max-w-xl text-primary-foreground/80">
            し明共の課題自決別共を数充データ立ちを闘・開。
            「物費3 収は初麗内」のリアル段8 績を安消費く来大介。
          </p>

          <div className="mt-8 flex items-center gap-8">
            <div>
              <p className="text-3xl font-bold">10,000<span className="text-lg">件超</span></p>
              <p className="text-xs text-primary-foreground/60">累製マッチング 績</p>
            </div>
            <div>
              <p className="text-3xl font-bold">35<span className="text-lg">%</span></p>
              <p className="text-xs text-primary-foreground/60">数均コスト削減率</p>
            </div>
            <div>
              <p className="text-3xl font-bold">2.8<span className="text-lg">年</span></p>
              <p className="text-xs text-primary-foreground/60">数均投資1 収短期</p>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b bg-background py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">し種で絞る</span>
            {BUILDING_FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setBuildingFilter(f)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  buildingFilter === f
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">課題で絞る</span>
            {UNIT_FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setUnitFilter(f)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  unitFilter === f
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies Grid */}
      <section className="bg-background py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((cs) => (
              <div key={cs.id} className="group overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-lg">
                {/* Image placeholder */}
                <div className="relative h-48 bg-muted">
                  <div className="absolute left-3 top-3 flex gap-1">
                    <span className="rounded bg-primary/90 px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
                      {cs.building}
                    </span>
                    {cs.units.map((u) => (
                      <span key={u} className="rounded bg-orange-500/90 px-2 py-0.5 text-[10px] font-bold text-white">
                        Unit {u}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-sm font-semibold leading-snug text-foreground group-hover:text-secondary">
                    {cs.title}
                  </h3>
                  <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{cs.location}</p>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-muted-foreground">年間削減額</p>
                      <p className="text-lg font-bold text-foreground">{cs.annualSaving}<span className="text-xs font-normal text-muted-foreground">万円/年</span></p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">投資回収</p>
                      <p className="text-lg font-bold text-foreground">{cs.payback}<span className="text-xs font-normal text-muted-foreground">年</span></p>
                    </div>
                  </div>

                  <Link
                    href={`/case-studies/${cs.id}`}
                    className="mt-4 inline-flex items-center text-sm font-medium text-secondary hover:underline"
                  >
                    象集を見る →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-14 text-center text-primary-foreground">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-bold">
            あなたの施設なら、どれくらい下がる？
          </h2>
          <p className="mt-3 text-primary-foreground/80">
            導入事例と同じような効果が出るか、まずはシミュレーションで確認してみませんか？
            30秒の簡単入力で、削減ポテンシャルを診断します。
          </p>
          <div className="mt-6">
            <Link href="/simulator">
              <button className="rounded-lg bg-orange-500 px-8 py-3 text-sm font-semibold text-white hover:bg-orange-600">
                削減シミュレーションを試算
              </button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
