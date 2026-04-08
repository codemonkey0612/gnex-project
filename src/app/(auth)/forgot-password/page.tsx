"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        return;
      }

      setSuccess(true);
    } catch {
      setError("処理中にエラーが発生しました");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-lg border bg-card p-8 shadow-sm">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">メール送信完了</h1>
          <Alert variant="success" className="mt-4">
            <AlertDescription>
              パスワード再設定のメールを送信しました。メールをご確認ください。
            </AlertDescription>
          </Alert>
          <p className="mt-4 text-sm text-muted-foreground">
            メールが届かない場合は、迷惑メールフォルダをご確認ください。
          </p>
          <Link href="/login">
            <Button variant="outline" className="mt-6">
              ログインページへ戻る
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card p-8 shadow-sm">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-foreground">
          パスワードの再設定
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          登録メールアドレスにパスワード再設定リンクを送信します
        </p>
      </div>

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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@company.jp"
            required
            autoComplete="email"
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "送信中..." : "再設定メールを送信"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        <Link href="/login" className="text-secondary hover:underline">
          ログインページへ戻る
        </Link>
      </p>
    </div>
  );
}
