import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: "G-NEX | コスト削減マッチングプラットフォーム",
    template: "%s | G-NEX",
  },
  description:
    "建物オーナー・管理者と専門業者をつなぐBtoBコスト削減マッチングプラットフォーム。エネルギー最適化・産廃コスト削減をワンストップで実現。",
  keywords: [
    "コスト削減",
    "エネルギー最適化",
    "太陽光発電",
    "LED",
    "EV充電",
    "産廃",
    "BtoB",
    "マッチング",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={cn("font-sans antialiased", notoSansJP.variable)}
    >
      <body>{children}</body>
    </html>
  );
}
