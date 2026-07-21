"use client";

import { useSavedProviders } from "@/hooks/use-saved-providers";
import { mockProviders } from "@/lib/mock-providers";
import { ProviderCard } from "@/components/providers/provider-card";

export function SavedProvidersList() {
  const { savedIds, loaded } = useSavedProviders();
  const saved = mockProviders.filter((p) => savedIds.includes(p.id));

  if (!loaded) return null;

  if (saved.length === 0) {
    return (
      <p className="rounded-xl border border-border bg-background-secondary p-6 text-center text-sm text-foreground-muted">
        You haven&apos;t saved any providers yet. Tap the heart icon on a provider card in{" "}
        <a href="/search" className="text-primary-400 hover:underline">
          search
        </a>{" "}
        to save them here.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {saved.map((provider) => (
        <ProviderCard key={provider.id} provider={provider} />
      ))}
    </div>
  );
}
