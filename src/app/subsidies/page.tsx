import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";

const UNITS_COMPARISON = [
  {
    label: "A 上エネ・蓄エネ",
    sub: "太陽光発電 + 蓄電池",
    effectiveness: "★★★★★",
    lineup: ["産業用出力パネル", "自家消費用パワーコンディショナ", "産業用大型蓄電池", "V2H光充放電設備"],
    conditions: "屋根面積：300㎡以上推奨",
    costRange: "1,000万〜5,000万円",
    costNote: "PPA:0円可",
    duration: "4ヶ月〜8ヶ月",
    approval: "優 ★★★★",
  },
  {
    label: "B 省エネ・効率化",
    sub: "高効率空調 + LED",
    effectiveness: "★★★☆☆",
    lineup: ["高効率パッケージエアコン", "チラー・ボイラー更新", "LH照・直管LED照明", "EMS（エネルギー管理システム）"],
    conditions: "設置後10年以上経過した設備",
    costRange: "300万〜2,000万円",
    costNote: "リース活用可能",
    duration: "1ヶ月〜3ヶ月",
    approval: "良 ★★★☆",
  },
  {
    label: "D 運用・循環（産廃）",
    sub: "有価物化・処理最適化",
    effectiveness: "★★★★☆",
    lineup: ["廃プラスチック買取", "金属スクラップ売却", "産廃x発生量削減相談具", "電子マニフェスト導入"],
    conditions: "月間排出量：1t以上推奨",
    costRange: "0円 〜",
    costNote: "初期投資0",
    duration: "2週間〜1ヶ月",
    approval: "★★★★★",
  },
];

const FINANCING_OPTIONS = [
  {
    title: "補助金活用プラン",
    badge: "適用性あり",
    badgeColor: "bg-orange-500 text-white",
    description: "環境省・経産省の大型補助金を活用し、導入費用の1/3〜2/3を削減します。",
    points: ["省エネ補助金（工場・事業場向け）", "ストレージパリティ補助金（蓄電池）"],
    cta: "補助金診断を依頼する",
    ctaColor: "bg-orange-500 text-white hover:bg-orange-600",
  },
  {
    title: "PPA / リース契約",
    badge: "初期投資0円",
    badgeColor: "bg-blue-500 text-white",
    description: "設備を所有せず、サービス料として支払うモデル。オフバランスにも対応可能です。",
    points: ["初期費用0円で導入可能", "メンテナンス費用込み"],
    cta: "PPA見もりを依頼する",
    ctaColor: "border-primary text-primary hover:bg-primary/5",
  },
  {
    title: "自己資金・融資",
    badge: "",
    badgeColor: "",
    description: "税制優遇（即時償却など）を最大活用し、設備として所有するプランです。",
    points: ["利益率は100%享受できる", "中小企業設備投資減税対応"],
    cta: "即時設備情理詳細を見る",
    ctaColor: "border-primary text-primary hover:bg-primary/5",
  },
];

export default function SubsidiesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      {/* Hero */}
      <section className="bg-primary py-16 text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs text-primary-foreground/60">
            ホーム &gt; 総合シミュレーター &gt; 対策・ラインナップ＆補助金/契約
          </p>
          <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-secondary">
            SOLUTIONS COMPARISON
          </p>
          <h1 className="mt-2 max-w-2xl text-2xl font-bold sm:text-3xl">
            さ仕対直の比較検無・導入プラン
          </h1>
          <p className="mt-3 max-w-xl text-sm text-primary-foreground/80">
            あなたの施設に最適な導入方法と補助金活用をご案内します。
            シミュレーション結果にさ中れた ユニット（対策）のSM最系をけ入り、
            「初期投資ゼロ」のPPAモデルや、「最大1/3補助」の最新補助金情報など。
          </p>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="bg-background py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">比較項目</th>
                  {UNITS_COMPARISON.map((u) => (
                    <th key={u.label} className="px-4 py-3 text-left">
                      <span className="font-bold text-foreground">{u.label}</span>
                      <br />
                      <span className="text-xs text-muted-foreground">{u.sub}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="px-4 py-3 font-medium text-muted-foreground">効果</td>
                  {UNITS_COMPARISON.map((u) => (
                    <td key={u.label} className="px-4 py-3">{u.effectiveness}</td>
                  ))}
                </tr>
                <tr className="bg-muted/20">
                  <td className="px-4 py-3 font-medium text-muted-foreground">商材ラインナップ</td>
                  {UNITS_COMPARISON.map((u) => (
                    <td key={u.label} className="px-4 py-3">
                      <ul className="space-y-0.5 text-xs">
                        {u.lineup.map((l) => (
                          <li key={l}>{l}</li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-muted-foreground">適用C件</td>
                  {UNITS_COMPARISON.map((u) => (
                    <td key={u.label} className="px-4 py-3 text-xs">{u.conditions}</td>
                  ))}
                </tr>
                <tr className="bg-muted/20">
                  <td className="px-4 py-3 font-medium text-muted-foreground">概算費用レンジ</td>
                  {UNITS_COMPARISON.map((u) => (
                    <td key={u.label} className="px-4 py-3">
                      <span className="font-bold">{u.costRange}</span>
                      <br />
                      <span className="text-xs text-orange-600">{u.costNote}</span>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-muted-foreground">導入期間</td>
                  {UNITS_COMPARISON.map((u) => (
                    <td key={u.label} className="px-4 py-3">{u.duration}</td>
                  ))}
                </tr>
                <tr className="bg-muted/20">
                  <td className="px-4 py-3 font-medium text-muted-foreground">運用評価</td>
                  {UNITS_COMPARISON.map((u) => (
                    <td key={u.label} className="px-4 py-3">{u.approval}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Financial Planning */}
      <section className="bg-muted/30 py-16">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">FINANCIAL PLANNING</p>
          <h2 className="mt-2 text-2xl font-bold text-foreground">
            導入コストを最適化する「契約・補助金」の選択肢
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            自社資金を使わずに導入する方法や、なず不要の補助金活用など、目的取理に合わせたプランをご案内します。
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {FINANCING_OPTIONS.map((opt, i) => (
              <div key={i} className="rounded-xl border bg-card p-6 text-left">
                {opt.badge && (
                  <span className={`rounded-full px-3 py-0.5 text-xs font-bold ${opt.badgeColor}`}>
                    {opt.badge}
                  </span>
                )}
                <h3 className="mt-3 text-lg font-semibold text-foreground">{opt.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{opt.description}</p>
                <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                  {opt.points.map((p) => (
                    <li key={p} className="flex items-start gap-1">
                      <span className="mt-0.5 text-green-500">&#10003;</span> {p}
                    </li>
                  ))}
                </ul>
                <div className="mt-4">
                  <Button variant={i === 0 ? "default" : "outline"} className={i === 0 ? opt.ctaColor : ""} size="sm">
                    {opt.cta}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-primary py-14 text-center text-primary-foreground">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-bold">
            最適なプランでお見積もりを作成します
          </h2>
          <p className="mt-3 text-primary-foreground/80">
            最検検討いただいた内容をもとに、具体的な金額と削減結果をお示しします。
            現地Wあのご依達もこちらから承ります。
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/contact">
              <Button size="lg" className="w-full bg-orange-500 text-white hover:bg-orange-600 sm:w-auto">
                お問い合わせ・見積依頼
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="w-full border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 sm:w-auto">
              03-1234-5678
              <span className="ml-1 text-xs opacity-70">（平日 9:00-18:00）</span>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
