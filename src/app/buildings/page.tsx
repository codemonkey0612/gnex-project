import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const BUILDING_TYPES = [
  {
    key: "factory",
    label: "工場・倉庫",
    badge: "最重要",
    description: "製造原価を下げるなら、「電気代」と「廃棄物」から。廃プラ・金属くずの有価物化により処理費を削減し、適正な廃棄ルートを確保。さらに太陽光PPA導入でコストをダブル削減。",
    href: "/buildings/factory",
  },
  {
    key: "hospital",
    label: "病院・介護施設",
    badge: "最重要",
    description: "命を守るエネルギーと、適切な廃棄物管理。いくつかの施設固有の課題に対し、BCP対策としての蓄電池導入から、紙オムツ処理の最適化まで、ワンストップで解決。",
    href: "/buildings/factory",
  },
  {
    key: "hotel",
    label: "ホテル・旅館",
    badge: "",
    description: "「おもてなし」はそのままに、裏側のコストを削減。ボイラー更新、空調効率化、EV充電器設置によるインバウンド対応など。",
    href: "/buildings/factory",
  },
  {
    key: "commercial",
    label: "商業施設",
    badge: "",
    description: "空室対策と資産価値向上を、選ばれる施設への転換。LED化やEV充電器設置で、環境意識の高いテナント・来客を獲得。",
    href: "/buildings/factory",
  },
  {
    key: "building",
    label: "ビル・マンション",
    badge: "",
    description: "管理組合の修繕積立金確保、共用部の電気代削減。LED化や電子ブレーカー導入で固定費を圧縮。",
    href: "/buildings/factory",
  },
];

export default function BuildingsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <section className="bg-background py-16">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">BUILDING TYPE</p>
          <h1 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">
            対象の建物をお選びください
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            業種・建物の特性に合わせた最適なコスト削減プランをご提案します
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-5xl space-y-6 px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {BUILDING_TYPES.map((b) => (
              <Link
                key={b.key}
                href={b.href}
                className="group overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-lg"
              >
                <div className="relative h-40 bg-muted">
                  {b.badge && (
                    <span className="absolute left-3 top-3 rounded bg-orange-500 px-2 py-0.5 text-[10px] font-bold text-white">
                      {b.badge}
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-secondary">
                    {b.label}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{b.description}</p>
                  <p className="mt-3 text-sm font-medium text-secondary">
                    詳細を見る →
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
