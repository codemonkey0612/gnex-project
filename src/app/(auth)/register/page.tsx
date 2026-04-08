import Link from "next/link";

const ROLES = [
  {
    href: "/register/client",
    label: "発注者",
    description: "建物のコスト削減を相談したい方",
    details: "工場・病院・店舗・ホテル・ビルなどの建物オーナー様",
  },
  {
    href: "/register/contractor",
    label: "受注者",
    description: "専門業者として案件に応募したい方",
    details: "太陽光・省エネ・EV・産廃等の施工・サービス業者様",
  },
  {
    href: "/register/lead-buyer",
    label: "パートナー",
    description: "士業・金融・産廃業者の方",
    details: "行政書士・銀行・リース会社・有価物買取業者様",
  },
] as const;

export default function RegisterPage() {
  return (
    <div className="rounded-lg border bg-card p-8 shadow-sm">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-foreground">新規登録</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          ご利用種別を選択してください
        </p>
      </div>

      <div className="space-y-3">
        {ROLES.map((role) => (
          <Link
            key={role.href}
            href={role.href}
            className="block rounded-lg border border-border p-5 transition-colors hover:border-primary hover:bg-primary/5"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  {role.label}
                </h2>
                <p className="mt-0.5 text-sm text-secondary">
                  {role.description}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {role.details}
                </p>
              </div>
              <svg
                className="h-5 w-5 flex-shrink-0 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </Link>
        ))}
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        既にアカウントをお持ちの方は{" "}
        <Link href="/login" className="text-secondary hover:underline">
          ログイン
        </Link>
      </p>
    </div>
  );
}
