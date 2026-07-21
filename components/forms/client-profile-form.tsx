"use client";

import { useActionState } from "react";
import { updateClientProfile, type ProfileActionState } from "@/lib/actions/profile";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Profile } from "@/types";

export function ClientProfileForm({ profile }: { profile: Profile }) {
  const [state, formAction, pending] = useActionState<ProfileActionState, FormData>(
    updateClientProfile,
    undefined
  );

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="fullName" className="text-sm font-medium">
          Full name
        </label>
        <Input id="fullName" name="fullName" defaultValue={profile.full_name ?? ""} required />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="phone" className="text-sm font-medium">
          Phone number
        </label>
        <Input id="phone" name="phone" defaultValue={profile.phone ?? ""} required />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="companyName" className="text-sm font-medium">
          Company (optional)
        </label>
        <Input id="companyName" name="companyName" defaultValue={profile.company_name ?? ""} />
      </div>

      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}
      {state?.success && <p className="text-sm text-primary-400">Profile updated.</p>}

      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save changes"}
      </Button>
    </form>
  );
}
