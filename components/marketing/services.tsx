"use client";

import { motion } from "motion/react";
import { PlaneLanding, PlaneTakeoff, Users, Briefcase } from "lucide-react";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";

const services = [
  {
    icon: PlaneLanding,
    title: "Airport Arrival",
    description: "Meet & greet, fast-track immigration, luggage handling, and secure transfer.",
  },
  {
    icon: PlaneTakeoff,
    title: "Airport Departure",
    description: "Check-in assistance, lounge access coordination, and priority boarding support.",
  },
  {
    icon: Users,
    title: "Event Protocol",
    description: "Full protocol staffing for conferences, state visits, weddings, and galas.",
  },
  {
    icon: Briefcase,
    title: "Full-Day Facilitation",
    description: "Dedicated protocol officer and logistics support for the entire itinerary.",
  },
];

export function Services() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-12 text-center">
        <h2 className="font-display text-3xl font-bold md:text-4xl">
          Services for every occasion
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-foreground-muted">
          Every provider is verified before they can accept a single booking.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((service, i) => (
          <motion.div
            key={service.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
            whileHover={{ y: -4 }}
          >
            <Card className="h-full transition-shadow hover:shadow-lg hover:shadow-primary-950/40">
              <CardContent className="pt-6">
                <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-primary-500/15 text-primary-400">
                  <service.icon className="size-5" />
                </div>
                <CardTitle className="mb-1.5 text-base">{service.title}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
