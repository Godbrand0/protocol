import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold">
          <ShieldCheck className="size-5 text-gold-400" />
          Protocol<span className="text-primary-400">Link</span>
        </Link>

        <div className="hidden items-center gap-8 text-sm text-foreground-muted md:flex">
          <Link href="/search" className="transition-colors hover:text-foreground">
            Find providers
          </Link>
          <Link href="/provider/onboarding" className="transition-colors hover:text-foreground">
            Become a provider
          </Link>
          <Link href="/about" className="transition-colors hover:text-foreground">
            About
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/login" className={buttonVariants({ variant: "ghost", size: "sm" })}>
            Log in
          </Link>
          <Link href="/register" className={buttonVariants({ variant: "gold", size: "sm" })}>
            Get started
          </Link>
        </div>
      </nav>
    </header>
  );
}
