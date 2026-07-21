"use client";

import { motion } from "motion/react";
import { CalendarDays, MapPin, ShieldCheck, ShieldHalf, Search, Star, Tag } from "lucide-react";
import { GlobeBackground } from "@/components/marketing/globe-background";

const trustBadges = [
  { icon: ShieldCheck, label: "Verified credentials" },
  { icon: ShieldHalf, label: "Escrow-protected payments" },
];

const featuredProviders = [
  { initials: "OA", name: "Olumide A.", rating: 4.9, service: "Airport VIP Facilitation" },
  { initials: "CE", name: "Chidinma E.", rating: 4.8, service: "Event Protocol" },
  { initials: "TB", name: "Tunde B.", rating: 4.7, service: "Full-Day Facilitation" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pb-24 pt-20 md:pt-28">
      <GlobeBackground />
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, rgba(15,23,42,0) 0%, rgba(15,23,42,0.75) 75%)",
        }}
      />

      <div className="mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/10 px-4 py-1.5 text-xs font-medium text-gold-400"
        >
          <ShieldCheck className="size-3.5" />
          Verified protocol providers · Lagos &amp; Abuja
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="font-display text-4xl font-bold leading-tight tracking-tight md:text-6xl"
        >
          Connect with verified protocol
          <br />
          <span className="bg-linear-to-r from-primary-400 to-gold-400 bg-clip-text text-transparent">
            professionals in minutes
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
          className="mx-auto mt-10 flex max-w-2xl flex-col gap-3 rounded-2xl border border-border bg-background-card/80 p-3 shadow-xl shadow-primary-950/40 backdrop-blur-md sm:flex-row sm:items-center"
        >
          <label className="flex flex-1 items-center gap-2.5 px-3 py-2 text-left">
            <MapPin className="size-4 shrink-0 text-foreground-muted" />
            <div className="w-full">
              <span className="block text-[11px] font-medium text-foreground-muted">
                Location
              </span>
              <input
                placeholder="e.g. Lagos"
                className="w-full bg-transparent text-sm text-foreground placeholder:text-foreground-muted/70 outline-none"
              />
            </div>
          </label>

          <div className="hidden h-9 w-px bg-border sm:block" />

          <label className="flex flex-1 items-center gap-2.5 px-3 py-2 text-left">
            <Tag className="size-4 shrink-0 text-foreground-muted" />
            <div className="w-full">
              <span className="block text-[11px] font-medium text-foreground-muted">
                Service type
              </span>
              <select className="w-full bg-transparent text-sm text-foreground outline-none">
                <option className="bg-background-secondary">Airport protocol</option>
                <option className="bg-background-secondary">Event protocol</option>
                <option className="bg-background-secondary">Full-day facilitation</option>
              </select>
            </div>
          </label>

          <div className="hidden h-9 w-px bg-border sm:block" />

          <label className="flex flex-1 items-center gap-2.5 px-3 py-2 text-left">
            <CalendarDays className="size-4 shrink-0 text-foreground-muted" />
            <div className="w-full">
              <span className="block text-[11px] font-medium text-foreground-muted">Date</span>
              <input
                type="date"
                className="w-full bg-transparent text-sm text-foreground outline-none [color-scheme:dark]"
              />
            </div>
          </label>

          <button
            type="button"
            aria-label="Search providers"
            className="flex size-11 shrink-0 items-center justify-center self-center rounded-xl bg-gold-500 text-background transition-colors hover:bg-gold-400"
          >
            <Search className="size-4.5" />
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.22 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-3"
        >
          {trustBadges.map((badge) => (
            <span
              key={badge.label}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background-card/60 px-3.5 py-1.5 text-xs text-foreground-muted"
            >
              <badge.icon className="size-3.5 text-gold-400" />
              {badge.label}
            </span>
          ))}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3"
      >
        {featuredProviders.map((provider) => (
          <div
            key={provider.name}
            className="flex items-center gap-3 rounded-2xl border border-border bg-background-card/70 p-4 text-left backdrop-blur-sm"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-primary-500 to-primary-800 text-sm font-semibold text-white">
              {provider.initials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{provider.name}</p>
              <p className="truncate text-xs text-foreground-muted">{provider.service}</p>
              <div className="mt-0.5 flex items-center gap-1 text-xs text-gold-400">
                <Star className="size-3 fill-current" />
                {provider.rating.toFixed(1)}
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
