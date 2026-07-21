import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh flex-1 flex-col items-center justify-center px-6 py-16">
      <Link
        href="/"
        className="mb-8 flex items-center gap-2 font-display text-lg font-semibold"
      >
        <ShieldCheck className="size-5 text-gold-400" />
        Protocol<span className="text-primary-400">Link</span>
      </Link>
      <div className="w-full max-w-md rounded-2xl border border-border bg-background-card/80 p-8 backdrop-blur-sm">
        {children}
      </div>
    </div>
  );
}
