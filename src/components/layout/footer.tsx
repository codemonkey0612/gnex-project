import Link from "next/link";

const SERVICE_LINKS = [
  { href: "/solutions/unit-a", label: "創エネ・蓄エネ" },
  { href: "/solutions/unit-b", label: "エネルギー削減（LED）" },
  { href: "/solutions/unit-c", label: "モビリティ（EV充電）" },
  { href: "/solutions/unit-d", label: "産廃・有価物買取" },
  { href: "/simulator", label: "総合シミュレーター" },
  { href: "/subsidies", label: "遮熱・保全塗装" },
  { href: "/solutions", label: "GXコンサルティング" },
];

const COMPANY_LINKS = [
  { href: "/about", label: "会社案内" },
  { href: "/about#message", label: "代表メッセージ" },
  { href: "/news", label: "ニュース" },
  { href: "/careers", label: "採用情報" },
  { href: "/partners", label: "パートナー募集" },
];

const SUPPORT_LINKS = [
  { href: "/faq", label: "よくあるご質問" },
  { href: "/privacy", label: "プライバシーポリシー" },
  { href: "/terms", label: "利用規約" },
  { href: "/legal", label: "特定商取引法に基づく表記" },
  { href: "/sitemap", label: "サイトマップ" },
];

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white text-xs font-bold text-primary">
                G
              </div>
              <span className="text-lg font-bold">G-NEX</span>
            </div>
            <p className="mt-3 text-sm text-primary-foreground/70">
              建物のコスト削減に特化したマッチングプラットフォーム。
              電気・空調・産廃の最適化で、企業の利益創出を支援します。
            </p>
            <div className="mt-4 text-xs text-primary-foreground/50">
              <p>〒100-0005</p>
              <p>東京都千代田区丸の内1-1-1</p>
              <p>TEL: 03-1234-5678</p>
            </div>
          </div>

          {/* Service */}
          <div>
            <h4 className="text-sm font-semibold">サービス</h4>
            <ul className="mt-3 space-y-2">
              {SERVICE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold">企業情報</h4>
            <ul className="mt-3 space-y-2">
              {COMPANY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold">サポート</h4>
            <ul className="mt-3 space-y-2">
              {SUPPORT_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-primary-foreground/20 pt-6 text-center text-xs text-primary-foreground/50">
          &copy; {new Date().getFullYear()} G-NEX Co., Ltd. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
