import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-primary/5 to-background px-4 py-12">
      <div className="mb-8">
        <Link href="/" className="text-3xl font-bold text-primary">
          G-NEX
        </Link>
      </div>
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
