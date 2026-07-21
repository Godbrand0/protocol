"use client";

import { Heart, MapPin, ShieldCheck, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { useSavedProviders } from "@/hooks/use-saved-providers";
import { cn } from "@/lib/utils";
import type { MockProvider } from "@/lib/mock-providers";
import Link from "next/link";

export function ProviderCard({ provider }: { provider: MockProvider }) {
  const { isSaved, toggle } = useSavedProviders();
  const saved = isSaved(provider.id);

  return (
    <Card className="flex h-full flex-col transition-shadow hover:shadow-lg hover:shadow-primary-950/40">
      <CardContent className="flex flex-1 flex-col pt-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-primary-500 to-primary-800 text-base font-semibold text-white">
            {provider.businessName
              .split(" ")
              .slice(0, 2)
              .map((w) => w[0])
              .join("")}
          </div>
          <div className="flex items-center gap-2">
            {provider.isVerified && (
              <Badge variant="verified">
                <ShieldCheck className="size-3" />
                Verified
              </Badge>
            )}
            <button
              type="button"
              aria-label={saved ? "Remove from saved providers" : "Save provider"}
              onClick={() => toggle(provider.id)}
              className="flex size-7 shrink-0 items-center justify-center rounded-full border border-border text-foreground-muted transition-colors hover:text-gold-400"
            >
              <Heart className={cn("size-3.5", saved && "fill-gold-400 text-gold-400")} />
            </button>
          </div>
        </div>

        <h3 className="mt-4 font-display text-lg font-semibold">{provider.businessName}</h3>
        <div className="mt-1 flex items-center gap-1.5 text-xs text-foreground-muted">
          <MapPin className="size-3.5" />
          {provider.city} · {provider.yearsExperience} yrs experience
        </div>

        <p className="mt-3 line-clamp-2 text-sm text-foreground-muted">{provider.bio}</p>

        <div className="mt-4 flex items-center gap-1 text-sm">
          <Star className="size-4 fill-gold-400 text-gold-400" />
          <span className="font-medium">{provider.rating.toFixed(1)}</span>
          <span className="text-foreground-muted">({provider.reviews})</span>
        </div>

        <div className="mt-auto flex items-center justify-between pt-5">
          <div>
            <p className="text-xs text-foreground-muted">From</p>
            <p className="font-display text-base font-semibold">
              ₦{provider.basePrice.toLocaleString()}
            </p>
          </div>
          <Link href={`/providers/${provider.id}`} className={buttonVariants({ size: "sm" })}>
            View profile
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
