import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ClientProfileForm } from "@/components/forms/client-profile-form";
import { SavedProvidersList } from "@/components/providers/saved-providers-list";
import type { Profile } from "@/types";

export default async function ClientProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user!.id)
    .single<Profile>();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Link
        href="/dashboard"
        className="mb-6 inline-flex items-center gap-1 text-sm text-foreground-muted hover:text-foreground"
      >
        <ChevronLeft className="size-4" />
        Back to dashboard
      </Link>

      <h1 className="font-display text-2xl font-semibold">Your profile</h1>
      <p className="mt-1 text-sm text-foreground-muted">
        Keep your contact details up to date so providers can reach you.
      </p>

      <div className="mt-8 rounded-2xl border border-border bg-background-card/80 p-8">
        <ClientProfileForm
          profile={
            profile ?? {
              id: user!.id,
              role: "client",
              full_name: null,
              phone: null,
              avatar_url: null,
              company_name: null,
              created_at: new Date().toISOString(),
            }
          }
        />
      </div>

      <h2 className="mt-12 font-display text-xl font-semibold">Saved providers</h2>
      <div className="mt-4">
        <SavedProvidersList />
      </div>
    </div>
  );
}
