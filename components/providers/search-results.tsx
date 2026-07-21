"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { ProviderCard } from "@/components/providers/provider-card";
import { mockProviders, serviceTypeLabels, type MockProvider } from "@/lib/mock-providers";
import { cn } from "@/lib/utils";

const cities: Array<MockProvider["city"] | "all"> = ["all", "Lagos", "Abuja"];
const serviceTypes: Array<MockProvider["serviceType"] | "all"> = [
  "all",
  "airport_arrival",
  "airport_departure",
  "event_protocol",
  "full_day",
];

export function SearchResults() {
  const [query, setQuery] = useState("");
  const [city, setCity] = useState<(typeof cities)[number]>("all");
  const [serviceType, setServiceType] = useState<(typeof serviceTypes)[number]>("all");
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const results = useMemo(() => {
    return mockProviders.filter((provider) => {
      if (city !== "all" && provider.city !== city) return false;
      if (serviceType !== "all" && provider.serviceType !== serviceType) return false;
      if (verifiedOnly && !provider.isVerified) return false;
      if (
        query &&
        !provider.businessName.toLowerCase().includes(query.toLowerCase()) &&
        !provider.serviceLabel.toLowerCase().includes(query.toLowerCase())
      )
        return false;
      return true;
    });
  }, [query, city, serviceType, verifiedOnly]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold">Find a protocol provider</h1>
        <p className="mt-1 text-foreground-muted">
          {results.length} verified provider{results.length === 1 ? "" : "s"} available
        </p>
      </div>

      <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-border bg-background-card/60 p-4 md:flex-row md:items-center">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-border bg-background-secondary px-3">
          <Search className="size-4 shrink-0 text-foreground-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by provider or service"
            className="w-full bg-transparent py-2.5 text-sm outline-none placeholder:text-foreground-muted"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <SlidersHorizontal className="size-4 text-foreground-muted" />

          <select
            value={city}
            onChange={(e) => setCity(e.target.value as typeof city)}
            className="rounded-lg border border-border bg-background-secondary px-3 py-2 text-sm outline-none"
          >
            <option value="all">All cities</option>
            <option value="Lagos">Lagos</option>
            <option value="Abuja">Abuja</option>
          </select>

          <select
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value as typeof serviceType)}
            className="rounded-lg border border-border bg-background-secondary px-3 py-2 text-sm outline-none"
          >
            <option value="all">All services</option>
            {Object.entries(serviceTypeLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => setVerifiedOnly((v) => !v)}
            className={cn(
              "rounded-lg border px-3 py-2 text-sm transition-colors",
              verifiedOnly
                ? "border-gold-500 bg-gold-500/10 text-gold-400"
                : "border-border text-foreground-muted hover:bg-background-secondary"
            )}
          >
            Verified only
          </button>
        </div>
      </div>

      {results.length === 0 ? (
        <div className="rounded-2xl border border-border bg-background-card/40 p-16 text-center text-foreground-muted">
          No providers match your filters yet. Try widening your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((provider) => (
            <ProviderCard key={provider.id} provider={provider} />
          ))}
        </div>
      )}
    </div>
  );
}
