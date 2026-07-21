import Link from "next/link";
import { CheckCircle2, Clock, FileText, XCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/(auth)/actions";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProviderProfileForm } from "@/components/forms/provider-profile-form";
import type { Provider, ProviderDocument } from "@/types";

const DOCUMENT_LABELS: Record<ProviderDocument["document_type"], string> = {
  cac: "CAC registration",
  red_card: '"Red card" / airport access permit',
  id: "Government-issued ID",
  association: "Association membership",
  insurance: "Insurance certificate",
};

const STATUS_META = {
  pending: { label: "Pending review", icon: Clock, className: "text-foreground-muted" },
  approved: { label: "Approved", icon: CheckCircle2, className: "text-primary-400" },
  rejected: { label: "Rejected", icon: XCircle, className: "text-red-400" },
};

export default async function ProviderDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: provider } = await supabase
    .from("providers")
    .select("*")
    .eq("id", user!.id)
    .single<Provider>();

  const { data: documents } = await supabase
    .from("provider_documents")
    .select("*")
    .eq("provider_id", user!.id)
    .returns<ProviderDocument[]>();

  const verificationStatus = provider?.verification_status ?? "pending";
  const statusMeta = STATUS_META[verificationStatus];

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">Provider dashboard</h1>
          <p className="mt-1 text-sm text-foreground-muted">{user?.email}</p>
        </div>
        <form action={signOut}>
          <Button type="submit" variant="outline" size="sm">
            Log out
          </Button>
        </form>
      </div>

      <div className="mt-6 flex items-center justify-between rounded-2xl border border-border bg-background-card/60 p-5">
        <div className="flex items-center gap-2 text-sm">
          <statusMeta.icon className={`size-4 ${statusMeta.className}`} />
          <span className={statusMeta.className}>{statusMeta.label}</span>
        </div>
        {verificationStatus !== "approved" && (
          <Badge variant="outline">Verification in progress</Badge>
        )}
      </div>

      {!provider?.business_name && (
        <div className="mt-6 rounded-2xl border border-gold-500/30 bg-gold-500/10 p-5 text-sm text-gold-400">
          You haven&apos;t finished onboarding yet.{" "}
          <Link href="/provider/onboarding" className="underline">
            Complete your application
          </Link>
          .
        </div>
      )}

      <h2 className="mt-10 font-display text-xl font-semibold">Business profile</h2>
      <div className="mt-4 rounded-2xl border border-border bg-background-card/80 p-8">
        <ProviderProfileForm
          provider={
            provider ?? {
              id: user!.id,
              business_name: null,
              bio: null,
              years_experience: null,
              verification_status: "pending",
              verified_at: null,
              service_areas: [],
              average_rating: null,
              total_reviews: 0,
              is_featured: false,
            }
          }
        />
      </div>

      <h2 className="mt-10 font-display text-xl font-semibold">Verification documents</h2>
      <div className="mt-4 space-y-2">
        {documents && documents.length > 0 ? (
          documents.map((doc) => {
            const meta = STATUS_META[doc.status];
            return (
              <div
                key={doc.id}
                className="flex items-center justify-between rounded-xl border border-border bg-background-secondary px-4 py-3"
              >
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="size-4 text-foreground-muted" />
                  {DOCUMENT_LABELS[doc.document_type]}
                </div>
                <span className={`flex items-center gap-1 text-xs ${meta.className}`}>
                  <meta.icon className="size-3.5" />
                  {meta.label}
                </span>
              </div>
            );
          })
        ) : (
          <p className="rounded-xl border border-border bg-background-secondary p-6 text-center text-sm text-foreground-muted">
            No documents uploaded yet.{" "}
            <Link href="/provider/onboarding" className="text-primary-400 hover:underline">
              Upload verification documents
            </Link>
            .
          </p>
        )}
      </div>

      <div className="mt-10">
        <Link href="/dashboard" className={buttonVariants({ variant: "ghost", size: "sm" })}>
          Client view
        </Link>
      </div>
    </div>
  );
}
