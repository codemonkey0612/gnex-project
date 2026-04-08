import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";

const PAIN_POINTS = [
  { title: "電気代の高騰が止まらない", description: "燃料調整費の上昇により、数年前と比較して電気代が1.5倍以上に。料金は圧迫しているが、どれだけ節約の余地があるか分からない。" },
  { title: "産廃処理費の値上げ通知", description: "処理業者から毎年のように値上げされている。これまで「仕方のないもの」を払っていたが、分別すれば安くなるかもしれないという感覚がある。" },
  { title: "夏場の空調効率が悪い", description: "金属屋根からの熱で工場内が高温になり、空調がフル稼働。従業員の熱中症リスクもあり、環境改善とコスト削減の両立が急務。" },
];

const SOLUTIONS = [
  {
    unit: "D",
    title: "Unit D: 産廃コスト適正化・有価物買取",
    badge: "First Step: 資金を作る",
    description: "廃プラスチック、金属くず、使い道のない「処理費」を払っていたものを、これまで「仕すのものに金を払もう」に変え、積極にキャッシュフローを創出します。",
    items: ["廃プラ・金属くずの再資源化による削減", "月間15万円の処理費入を転換"],
  },
  {
    unit: "A/B",
    title: "Unit A/B: 屋根上太陽光(PPA) + 遮熱",
    badge: "Second Step: 設備で節える",
    description: "初期費用0円で導入可能なPPAモデルで電気代を削減、さらに遮熱塗装材で空調負荷を軽減。Unit Dで浮いたコストを原資に、さらなる設備投資への好循環を作ります。",
    items: [],
  },
];

const CASE_STUDIES = [
  {
    title: "金属加工工場（大阪府）",
    description: "廃プラを有価物化し、その利益でLED化を実施、年間300万円のコスト削減に成功。",
    before: "年間コスト 1,200万円",
    after: "年間 300万円削減",
    saving: "利益: +50万円/年",
  },
  {
    title: "物流倉庫（千葉県）",
    description: "屋根認し太陽光(PPA)で電気代を削減、遮熱効果で夏場の作業環境も劇的改善。",
    before: "初期上場費用 0円",
    after: "削減: 240万円/年",
    saving: "",
  },
];

export default function FactoryBuildingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden bg-primary py-20 text-primary-foreground">
        <div className="absolute inset-0 bg-[url('/images/factory-bg.jpg')] bg-cover bg-center opacity-15" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <span className="inline-block rounded bg-orange-500 px-3 py-1 text-xs font-bold text-white">
            工場・倉庫向けソリューション
          </span>
          <h1 className="mt-4 max-w-2xl text-3xl font-bold leading-tight sm:text-4xl">
            製造原価を下げるなら、
            <br />「<span className="text-orange-400">電気代</span>」と「<span className="text-orange-400">廃棄物</span>」から。
            <br />利益直結のコスト削減。
          </h1>
          <p className="mt-4 max-w-xl text-primary-foreground/80">
            エネルギー価格の高騰と廃棄物処理コストの上昇は、製造業の利益を圧迫する最大の要因です。
            G-NEXは、これらを「コスト」ではなく「資源」と捉え直し、収益を生み出す工場への転換を強力に支援します。
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/simulator">
              <Button className="bg-orange-500 text-white hover:bg-orange-600">
                工場専用コスト削減診断 →
              </Button>
            </Link>
            <Link href="/case-studies">
              <Button variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                導入事例を見る
              </Button>
            </Link>
          </div>

          {/* Stats card */}
          <div className="absolute right-8 top-8 hidden rounded-lg bg-white p-4 shadow-lg lg:block">
            <p className="text-xs text-muted-foreground">導入効果モデルケース</p>
            <p className="mt-1 text-3xl font-bold text-primary">18<span className="text-lg">%</span></p>
            <p className="text-xs text-muted-foreground">年間コスト削減率</p>
          </div>
        </div>
      </section>

      {/* Pain Points */}
      <section className="bg-background py-16">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">CURRENT CHALLENGES</p>
          <h2 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">
            こんな「見えないコスト」に悩んでいませんか？
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            多くの工場・産業施設営が直面している共通の課題です
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {PAIN_POINTS.map((pp, i) => (
              <div key={i} className="rounded-lg border bg-card p-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                </div>
                <h3 className="mt-4 font-semibold text-foreground">{pp.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{pp.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="bg-muted/30 py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-secondary">G-NEX SOLUTION</p>
            <h2 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">
              「捨てる」と「使う」を同時に見直す。
              <br />工場特化型ハイブリッド・ソリューション
            </h2>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {SOLUTIONS.map((sol, i) => (
              <div key={i} className="rounded-xl border bg-card p-6">
                <span className="rounded bg-orange-500/10 px-2 py-1 text-xs font-bold text-orange-600">
                  {sol.badge}
                </span>
                <h3 className="mt-3 text-lg font-bold text-foreground">{sol.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{sol.description}</p>
                {sol.items.length > 0 && (
                  <ul className="mt-3 space-y-1">
                    {sol.items.map((item, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <svg className="h-4 w-4 flex-shrink-0 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recommended Package */}
      <section className="bg-background py-16">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <div className="rounded-xl border-2 border-orange-200 bg-orange-50/50 p-8">
            <p className="text-sm font-semibold text-orange-600">推奨パッケージ: Factory Standard Set</p>
            <p className="mt-2 text-sm text-muted-foreground">
              「Unit D（産廃）」でキャッシュを生み出し、「Unit A（太陽光）」で省コストダウン。
              年自コストダウン実績。工場・倉庫に最も選ばれている組み合わせです。
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <span className="rounded bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">Unit D: 産廃・買取</span>
              <span className="text-muted-foreground">+</span>
              <span className="rounded bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">Unit A: 屋根太上・PPA</span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">トータル想定削減額</p>
            <p className="text-4xl font-bold text-foreground">430<span className="text-lg font-normal">万円/年</span></p>
            <Link href="/simulator">
              <Button className="mt-4 bg-orange-500 text-white hover:bg-orange-600">
                自社の削減額を試算する →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="bg-muted/30 py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">CASE STUDIES</p>
            <h2 className="mt-2 text-2xl font-bold text-foreground">同業種の導入成功事例</h2>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {CASE_STUDIES.map((cs, i) => (
              <div key={i} className="overflow-hidden rounded-xl border bg-card">
                <div className="h-48 bg-muted" />
                <div className="p-6">
                  <h3 className="font-semibold text-foreground">{cs.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{cs.description}</p>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground">導入前</p>
                      <p className="font-medium">{cs.before}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">効果</p>
                      <p className="font-bold text-orange-600">{cs.after}</p>
                    </div>
                  </div>
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
            あなたの工場の「隠れた利益」を見つけませんか？
          </h2>
          <p className="mt-3 text-primary-foreground/80">
            簡単な質問に答えるだけで、削減可能なコストと推定プランを即時に提供。
            産廃とエネルギーの両面から、最適な削減額を算出します。
          </p>
          <div className="mt-6">
            <Link href="/simulator">
              <Button size="lg" className="bg-orange-500 text-white hover:bg-orange-600">
                工場専用コスト削減シミュレーター
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
