"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { MapPin, Plane, Search } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

const cities = ["Lagos", "Abuja"];

export function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pb-24 pt-20 md:pt-28">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, rgba(99,102,241,0.18) 0%, rgba(15,23,42,0) 70%)",
        }}
      />

      <div className="mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/10 px-4 py-1.5 text-xs font-medium text-gold-400"
        >
          <Plane className="size-3.5" />
          Verified protocol providers · Lagos &amp; Abuja
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="font-display text-4xl font-bold leading-tight tracking-tight md:text-6xl"
        >
          Seamless, verified protocol
          <br />
          <span className="bg-gradient-to-r from-primary-400 to-gold-400 bg-clip-text text-transparent">
            services, booked in minutes
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto mt-6 max-w-2xl text-balance text-lg text-foreground-muted"
        >
          Airport meet &amp; greet, VIP facilitation, event protocol, and logistics — connect
          with credential-verified providers instead of relying on word-of-mouth.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mx-auto mt-10 flex max-w-xl flex-col gap-3 rounded-2xl border border-border bg-background-card/70 p-3 backdrop-blur-sm sm:flex-row sm:items-center"
        >
          <div className="flex flex-1 items-center gap-2 px-3">
            <MapPin className="size-4 shrink-0 text-foreground-muted" />
            <select className="w-full bg-transparent py-2 text-sm text-foreground outline-none">
              {cities.map((city) => (
                <option key={city} value={city} className="bg-background-secondary">
                  {city}
                </option>
              ))}
            </select>
          </div>
          <div className="hidden h-6 w-px bg-border sm:block" />
          <Link
            href="/search"
            className={buttonVariants({ variant: "default", size: "lg", className: "gap-2" })}
          >
            <Search className="size-4" />
            Search providers
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-8 flex items-center justify-center gap-6 text-xs text-foreground-muted"
        >
          <span>Credential-verified providers</span>
          <span className="h-1 w-1 rounded-full bg-foreground-muted/40" />
          <span>Secure escrow payments</span>
          <span className="h-1 w-1 rounded-full bg-foreground-muted/40" />
          <span>Rated &amp; reviewed</span>
        </motion.div>
      </div>
    </section>
  );
}
