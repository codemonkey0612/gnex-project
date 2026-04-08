import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";

const UNITS = [
  {
    id: "A",
    name: "創エネ・蓄エネ",
    nameEn: "Energy Creation & Storage",
    color: "text-blue-600 bg-blue-50 border-blue-200",
    badge: "電気代削減の主役",
    title: "初期投資ゼロで始める、自家消費型エネルギー革革",
    description: "屋根上の未利用スペースを活用し、太陽光発電で電力を自給自足。PPA（第三者所有）モデルなら初期費用・メンテ費0円で導入可能。蓄電池との併用で、ピークカットやBCP対策も同時に実現します。",
    stats: "電気代削減率：15〜30%",
    targets: ["工場・倉庫", "病院・介護", "商業施設"],
    href: "/solutions/unit-a",
  },
  {
    id: "B",
    name: "省エネ・効率化",
    nameEn: "Energy Saving & Efficiency",
    color: "text-green-600 bg-green-50 border-green-200",
    badge: "即効性No.1",
    title: "設備の更新だけで、利益を生み出す施設へ",
    description: "照明のLED化、高効率空調への更新、遮熱塗装など、既存設備を見直すだけで確実なコストダウンが可能。特に古い設備を使い続けている場合、更新による電気代削減効果だけで投資回収が可能です。",
    stats: "空調電気代：約20%削減",
    targets: ["オフィスビル", "ホテル・旅館", "工場・倉庫"],
    href: "/solutions/unit-b",
  },
  {
    id: "C",
    name: "モビリティ",
    nameEn: "Mobility & EV Infrastructure",
    color: "text-purple-600 bg-purple-50 border-purple-200",
    badge: "資産価値向上",
    title: "EVシフトをチャンスに変える。集客と福利厚生の新しい形",
    description: "急速に普及するEV（電気自動車）に対応した充電インフラの整備。商業施設やホテルでは「選ばれる理由」となり、オフィスや工場では従業員の福利厚生や社用車の電動化（ガソリン代削減）に貢献します。",
    stats: "燃料費削減：約40%減",
    targets: ["商業施設", "ホテル・旅館", "マンション"],
    href: "/solutions/unit-c",
  },
  {
    id: "D",
    name: "運用・循環",
    nameEn: "Operation & Circulation / Waste Management",
    color: "text-orange-600 bg-orange-50 border-orange-200",
    badge: "資金創出の源泉",
    title: "「捨てる」を「売る」に変える。静脈産業のDXアプローチ",
    description: "産廃処理費を「仕方ないコスト」と諦めていませんか？徹底的な分別と独自ルートでの有価物買取により、産業廃棄物処理コストを劇的に圧縮。場合によっては収益化し、その資金を省エネ投資（Unit A/B）に回すことが可能です。",
    stats: "処理コスト：50%〜削減",
    targets: ["工場・倉庫", "病院・介護", "建設現場"],
    href: "/solutions/unit-d",
  },
];

const COMBO_MODELS = [
  { title: "工場・倉庫モデル", units: ["D", "A"], description: "廃棄を有価物化してキャッシュを作り、その資金で屋根上太陽光を導入。電気代と廃棄費をダブルで削減。" },
  { title: "病院・介護モデル", units: ["D", "A"], description: "紙オムツ等の廃棄物コストを見直しつつ、非常電源として蓄電池・太陽光を導入しBCP計画を強化。" },
  { title: "ホテル・商業施設", units: ["B", "C"], description: "空調・ボイラー更新で光熱費を下げ、EV充電器設置でインバウンド客や環境意識の高い層を集客。" },
];

export default function SolutionsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      {/* Hero */}
      <section className="bg-primary py-20 text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-secondary">SOLUTION CATEGORIES</p>
          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
            課題から選ぶ、最適なコスト削減アプローチ
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-primary-foreground/80">
            エネルギーの「創る」「減らす」「運ぶ」「回す」。
            4つのUnitを組み合わせることで、単なる節約を超えた「利益を生む」施設運営を実現します。
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
              ソリューション一覧を見る ↓
            </Button>
            <Link href="/simulator">
              <Button className="bg-orange-500 text-white hover:bg-orange-600">
                削減効果をシミュレーション
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Units */}
      <section className="bg-background py-16">
        <div className="mx-auto max-w-6xl space-y-12 px-4 sm:px-6 lg:px-8">
          {UNITS.map((unit) => (
            <div key={unit.id} className="overflow-hidden rounded-xl border bg-card">
              <div className="p-6 lg:p-8">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-10">
                  {/* Image placeholder */}
                  <div className="relative h-48 w-full overflow-hidden rounded-lg bg-muted lg:h-64 lg:w-80 lg:flex-shrink-0">
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary/80 to-transparent p-4">
                      <p className="text-sm font-bold text-white">{unit.name}</p>
                      <p className="text-xs text-white/70">{unit.nameEn}</p>
                    </div>
                    <div className="flex h-full items-center justify-center">
                      <span className={`rounded px-2 py-1 text-xs font-bold ${unit.color}`}>Unit {unit.id}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className={`rounded px-2 py-1 text-xs font-bold ${unit.color}`}>Unit {unit.id}</span>
                      <span className="rounded-full bg-orange-50 px-3 py-0.5 text-xs font-medium text-orange-600">{unit.badge}</span>
                    </div>
                    <h3 className="mt-3 text-xl font-bold text-foreground">{unit.title}</h3>
                    <p className="mt-3 text-sm text-muted-foreground">{unit.description}</p>

                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-xs text-muted-foreground">想定削減/効果</p>
                        <p className="mt-1 text-lg font-bold text-secondary">{unit.stats}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">よくある導入対象</p>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {unit.targets.map((t) => (
                            <span key={t} className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">{t}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <Link href={unit.href}>
                        <Button variant="outline" size="sm">
                          Unit {unit.id}の詳細・ラインナップを見る →
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Combination Models */}
      <section className="bg-muted/30 py-16">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-foreground">
            単体導入よりも「組み合わせ」が効果的
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Unit Dで資金を作り、Unit A/Bで固定費を下げる。
            G-NEXは、この循環サイクルによるトータルコスト削減を推進しています。
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {COMBO_MODELS.map((model, i) => (
              <div key={i} className="rounded-lg border bg-card p-6 text-left">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">{model.title}</h3>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">{i + 1}</span>
                </div>
                <div className="mt-2 flex gap-1">
                  {model.units.map((u) => (
                    <span key={u} className="rounded bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">
                      Unit {u}
                    </span>
                  ))}
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{model.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <Link href="/simulator">
              <Button size="lg" className="bg-primary text-primary-foreground">
                総合シミュレーターで効果を試算する &gt;
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
