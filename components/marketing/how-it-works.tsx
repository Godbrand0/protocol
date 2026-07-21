"use client";

import { motion } from "motion/react";
import { Search, CalendarCheck, ShieldCheck } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Search & compare",
    description:
      "Filter verified providers by city, airport, service type, date, and price — see real reviews.",
  },
  {
    icon: CalendarCheck,
    title: "Book & pay securely",
    description:
      "Confirm your flight or event details and pay through escrow-style protection via Paystack.",
  },
  {
    icon: ShieldCheck,
    title: "Meet your protocol officer",
    description:
      "Chat in-app, get real-time updates, and rate the experience once your service is complete.",
  },
];

export function HowItWorks() {
  return (
    <section className="border-y border-border/60 bg-background-secondary/40 px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="font-display text-3xl font-bold md:text-4xl">How it works</h2>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl border border-gold-500/30 bg-gold-500/10 text-gold-400">
                <step.icon className="size-6" />
              </div>
              <h3 className="font-display text-lg font-semibold">
                <span className="mr-2 text-primary-400">{i + 1}.</span>
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-foreground-muted">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
