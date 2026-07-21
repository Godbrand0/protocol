"use client";

import { useActionState, useState } from "react";
import { updateProviderProfile, type ProfileActionState } from "@/lib/actions/profile";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Provider } from "@/types";

const CITIES = ["Lagos", "Abuja"] as const;

export function ProviderProfileForm({ provider }: { provider: Provider }) {
  const [state, formAction, pending] = useActionState<ProfileActionState, FormData>(
    updateProviderProfile,
    undefined
  );
  const [serviceAreas, setServiceAreas] = useState<string[]>(
    provider.service_areas.map((c) => c[0].toUpperCase() + c.slice(1))
  );

  const toggleCity = (city: string) => {
    setServiceAreas((prev) =>
      prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city]
    );
  };

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="businessName" className="text-sm font-medium">
          Business / trading name
        </label>
        <Input
          id="businessName"
          name="businessName"
          defaultValue={provider.business_name ?? ""}
          required
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="bio" className="text-sm font-medium">
          Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          rows={3}
          defaultValue={provider.bio ?? ""}
          className="w-full rounded-xl border border-border bg-background-secondary px-4 py-2.5 text-sm text-foreground placeholder:text-foreground-muted outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="yearsExperience" className="text-sm font-medium">
          Years of experience
        </label>
        <Input
          id="yearsExperience"
          name="yearsExperience"
          type="number"
          min={0}
          defaultValue={provider.years_experience ?? 0}
          required
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium">Service areas</label>
        <div className="flex gap-2">
          {CITIES.map((city) => (
            <button
              key={city}
              type="button"
              onClick={() => toggleCity(city)}
              className={cn(
                "rounded-lg border px-4 py-2 text-sm transition-colors",
                serviceAreas.includes(city)
                  ? "border-primary-500 bg-primary-500/10 text-foreground"
                  : "border-border text-foreground-muted hover:bg-background-secondary"
              )}
            >
              {city}
            </button>
          ))}
        </div>
        {serviceAreas.map((city) => (
          <input key={city} type="hidden" name="serviceAreas" value={city} />
        ))}
      </div>

      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}
      {state?.success && <p className="text-sm text-primary-400">Profile updated.</p>}

      <Button type="submit" variant="gold" disabled={pending}>
        {pending ? "Saving…" : "Save changes"}
      </Button>
    </form>
  );
}
