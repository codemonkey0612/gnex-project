"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

const MESSAGES: Record<
  string,
  { text: string; variant: "success" | "destructive" }
> = {
  email_verified: {
    text: "メールアドレスが確認されました。ログインしてください。",
    variant: "success",
  },
  already_verified: {
    text: "メールアドレスは既に確認済みです。",
    variant: "success",
  },
  verification_pending_approval: {
    text: "メールアドレスが確認されました。運営者の承認をお待ちください。",
    variant: "success",
  },
  invalid_token: {
    text: "無効なリンクです。再度お試しください。",
    variant: "destructive",
  },
  token_expired: {
    text: "リンクの有効期限が切れています。",
    variant: "destructive",
  },
  rate_limited: {
    text: "リクエストの上限に達しました。しばらくしてから再度お試しください。",
    variant: "destructive",
  },
  verification_failed: {
    text: "確認処理中にエラーが発生しました。",
    variant: "destructive",
  },
  password_reset: {
    text: "パスワードが再設定されました。新しいパスワードでログインしてください。",
    variant: "success",
  },
};

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const messageKey =
    searchParams.get("message") || searchParams.get("error");
  const urlMessage = messageKey ? MESSAGES[messageKey] : null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        return;
      }

      router.push(data.redirectTo);
      router.refresh();
    } catch {
      setError("ログイン中にエラーが発生しました");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-lg border bg-card p-8 shadow-sm">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-foreground">ログイン</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          G-NEXアカウントにログイン
        </p>
      </div>

      {urlMessage && (
        <Alert variant={urlMessage.variant} className="mb-4">
          <AlertDescription>{urlMessage.text}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">メールアドレス</Label>
          <Input
            id="email"
            type="email"
            placeholder="example@company.jp"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">パスワード</Label>
            <Link
              href="/forgot-password"
              className="text-xs text-secondary hover:underline"
            >
              パスワードを忘れた方
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "ログイン中..." : "ログイン"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        アカウントをお持ちでない方は{" "}
        <Link href="/register" className="text-secondary hover:underline">
          新規登録
        </Link>
      </p>
    </div>
  );
}
