import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export function Cta() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-4xl rounded-3xl border border-primary-500/20 bg-gradient-to-br from-primary-900/60 to-background-secondary p-10 text-center md:p-16">
        <h2 className="font-display text-3xl font-bold md:text-4xl">
          Are you a protocol provider?
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-foreground-muted">
          Get discovered by elite clients, manage your calendar, and get paid securely — no more
          chasing bookings through WhatsApp groups.
        </p>
        <Link
          href="/provider/onboarding"
          className={buttonVariants({ variant: "gold", size: "lg", className: "mt-8" })}
        >
          Register as a provider
        </Link>
      </div>
    </section>
  );
}
