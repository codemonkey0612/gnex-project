import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";

const SERVICE_UNITS = [
  {
    id: "A",
    label: "創エネ・蓄エネ",
    sub: "PPA・蓄電池・太陽光",
    description: "電気代削減の主力。屋根上太陽光発電やPPA（第三者所有）モデルなら初期費用・メンテ費0円で導入可能。蓄電池との併用で、ピークカットやBCP対策も同時に実現します。",
    href: "/solutions/unit-a",
  },
  {
    id: "B",
    label: "省エネ・効率化",
    sub: "LED・空調・遮熱",
    description: "設備の更新だけで確実なコストダウンが可能。特に古い設備を使い続けている場合、更新による電気代削減効果だけで投資回収が可能です。",
    href: "/solutions/unit-b",
  },
  {
    id: "C",
    label: "モビリティ",
    sub: "EV充電器・V2H",
    description: "急速に普及するEV（電気自動車）に対応した充電インフラの整備。商業施設やホテルでは「選ばれる理由」となり、オフィスや工場では従業員の福利厚生として活用。",
    href: "/solutions/unit-c",
  },
  {
    id: "D",
    label: "運用・循環",
    sub: "産廃・有価物買取",
    description: "産廃処理費を「仕方ないコスト」と諦めていませんか？徹底的な分別と独自ルートでの有価物買取により、産業廃棄物処理コストを劇的に圧縮。",
    href: "/solutions/unit-d",
  },
];

const BUILDING_TYPES = [
  { label: "工場・倉庫", href: "/buildings/factory", icon: "M3.75 21V3.75m0 0h16.5m-16.5 0L12 13.5m8.25-9.75L12 13.5" },
  { label: "病院・介護施設", href: "/buildings/hospital", icon: "M12 4.5v15m7.5-7.5h-15" },
  { label: "ホテル・旅館", href: "/buildings/hotel", icon: "M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21" },
  { label: "商業施設", href: "/buildings/commercial", icon: "M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016A3.001 3.001 0 0021 9.349m-18 0a2.994 2.994 0 00.955 1.645" },
  { label: "ビル・マンション", href: "/buildings/building", icon: "M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" },
];

const ADVANTAGES = [
  {
    title: "中抜きなしの直接契約",
    description: "大手下請構造を通さず、優良な施工店や専門パートナーと直接マッチング。余分なマージンをカットし、最適な価格で導入。",
  },
  {
    title: "完全メーカーフリー",
    description: "特定のメーカーに縛られず、貴社の設備の熱量や予算に合わせて最適な機器を選定。",
  },
  {
    title: "ワンストップ対応",
    description: "創エネ、省エネ、車両管理まで。バラバラに相談していた施設の維持コストを一括で管理。管理コストと手間を大幅に削減。",
  },
];

const FLOW_STEPS = [
  { num: 1, label: "相談・現地調査", sub: "ヒアリング" },
  { num: 2, label: "試算・シミュレーション", sub: "最適プラン提案" },
  { num: 3, label: "比較検次・選定", sub: "複数比較で安心" },
  { num: 4, label: "費用適正化・契約", sub: "費用の最適化" },
  { num: 5, label: "導入完了", sub: "コスト削減スタート" },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-primary py-20 text-primary-foreground lg:py-28">
        <div className="absolute inset-0 bg-[url('/images/hero-bg.jpg')] bg-cover bg-center opacity-20" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-secondary">
              施設の「固定費」を「純利益」に変える。
            </p>
            <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              建物のコスト、適正価格ですか？
              <br />
              <span className="text-secondary">わずか30秒</span>で削減ポテンシャルを無料診断
            </h1>
            <p className="mt-6 text-base text-primary-foreground/80 lg:text-lg">
              電気代、設備更新、産廃処理費など、複合的な視点から削減額を算出。
              業種や課題に合わせた最適な対策プランをご提案します。
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/simulator">
                <Button size="lg" className="w-full bg-orange-500 text-white hover:bg-orange-600 sm:w-auto">
                  削減シミュレーション
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="w-full border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 sm:w-auto">
                  <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                  最適なパートナーを探す
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats badge */}
          <div className="absolute right-8 top-8 hidden rounded-lg bg-white p-4 shadow-lg lg:block">
            <p className="text-xs text-muted-foreground">平均コスト削減実績</p>
            <p className="mt-1 text-3xl font-bold text-primary">
              28.5<span className="text-lg">%</span>
            </p>
          </div>
        </div>
      </section>

      {/* G-NEX Advantages */}
      <section className="bg-background py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-secondary">G-NEX ADVANTAGE</p>
            <h2 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">
              G-NEXが選ばれる3つの理由
            </h2>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {ADVANTAGES.map((item, i) => (
              <div key={i} className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Units - Pain + Solution */}
      <section className="bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">SOLUTION CATEGORIES</p>
            <h2 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">
              エネルギー高騰・資材高騰の時代。
              <br />
              「なんとなく」の契約更新で損をしていませんか？
            </h2>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICE_UNITS.map((unit) => (
              <div key={unit.id} className="rounded-lg border bg-card p-6 transition-shadow hover:shadow-md">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                    Unit {unit.id}
                  </span>
                </div>
                <h3 className="mt-3 text-lg font-semibold text-foreground">{unit.label}</h3>
                <p className="text-xs text-muted-foreground">{unit.sub}</p>
                <p className="mt-3 text-sm text-muted-foreground line-clamp-3">{unit.description}</p>
                <Link
                  href={unit.href}
                  className="mt-4 inline-flex items-center text-sm font-medium text-secondary hover:underline"
                >
                  詳細を見る
                  <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Building Types */}
      <section className="bg-background py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">BUILDING TYPE</p>
            <h2 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">
              対象の建物をお選びください
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              業種・建物の特性に合わせた最適なコスト削減プランをご提案します
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {BUILDING_TYPES.map((b) => (
              <Link
                key={b.label}
                href={b.href}
                className="group flex flex-col items-center rounded-lg border bg-card p-6 text-center transition-all hover:border-primary/50 hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={b.icon} />
                  </svg>
                </div>
                <h3 className="mt-3 text-sm font-semibold text-foreground">{b.label}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Flow Steps */}
      <section className="bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-foreground sm:text-3xl">
            導入までの流れ
          </h2>

          <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-0">
            {FLOW_STEPS.map((step, i) => (
              <div key={step.num} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-full border-2 text-lg font-bold ${
                    step.num === 5
                      ? "border-orange-500 bg-orange-500 text-white"
                      : "border-primary bg-white text-primary"
                  }`}>
                    {step.num === 5 ? (
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : step.num}
                  </div>
                  <p className="mt-2 text-center text-sm font-semibold text-foreground">{step.label}</p>
                  <p className="text-xs text-muted-foreground">{step.sub}</p>
                </div>
                {i < FLOW_STEPS.length - 1 && (
                  <div className="mx-4 hidden h-0.5 w-12 bg-border sm:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Simulator CTA */}
      <section className="bg-background py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">COST SIMULATOR</p>
            <h2 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">
              30秒でわかる！削減効果シミュレーション
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              簡単な入力だけで、あなたの施設の削減効果ポテンシャル（目安）を算出します
            </p>
          </div>

          <div className="mt-10 rounded-xl border bg-card p-8 shadow-sm">
            <div className="grid gap-8 lg:grid-cols-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded bg-primary/10 px-2 py-1 text-xs font-bold text-primary">STEP 1</span>
                  <span className="text-sm font-medium text-foreground">カンタン入力</span>
                </div>
                <div className="mt-4 space-y-3">
                  <div className="rounded-md border bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
                    延床面積：1,200 ㎡
                  </div>
                  <p className="text-xs text-muted-foreground">選択してください...</p>
                </div>
              </div>

              <div className="rounded-lg bg-muted/30 p-6">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-orange-500/10 px-2 py-1 text-xs font-bold text-orange-600">STEP 2</span>
                  <span className="text-sm font-medium text-foreground">削減メリット（目安）</span>
                </div>
                <div className="mt-4 text-center">
                  <p className="text-xs text-muted-foreground">年間削減</p>
                  <p className="text-4xl font-bold text-foreground">
                    3,000,000<span className="text-lg font-normal text-muted-foreground">円/年</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link href="/simulator">
                <Button size="lg" className="bg-orange-500 text-white hover:bg-orange-600">
                  詳細結果を見る
                  <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-primary py-16 text-primary-foreground">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold sm:text-3xl">
            まずは、あな管の施設の「か減余地」を知ることから。
          </h2>
          <p className="mt-3 text-primary-foreground/80">
            3分の簡易診断で、どれ暮らいコスト型で可能性型あるか確認してみませんか？
            登録起動で迅速にご案をご覧いただけます。
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/simulator">
              <Button size="lg" className="w-full bg-orange-500 text-white hover:bg-orange-600 sm:w-auto">
                無料でか減を試算する
              </Button>
            </Link>
            <Link href="/solutions">
              <Button size="lg" variant="outline" className="w-full border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 sm:w-auto">
                <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                サービス一覧を見る
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
