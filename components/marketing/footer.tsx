import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/60 px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-foreground-muted md:flex-row">
        <div className="flex items-center gap-2 font-display font-semibold text-foreground">
          <ShieldCheck className="size-4 text-gold-400" />
          ProtocolLink
        </div>
        <p>&copy; {new Date().getFullYear()} ProtocolLink. All rights reserved.</p>
        <div className="flex items-center gap-5">
          <Link href="/about" className="hover:text-foreground">
            About
          </Link>
          <Link href="/privacy" className="hover:text-foreground">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-foreground">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}
