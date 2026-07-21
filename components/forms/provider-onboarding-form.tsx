"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileUp,
  Loader2,
  Trash2,
  UserRound,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const CITIES = ["Lagos", "Abuja"] as const;

const DOCUMENT_TYPES = [
  { key: "cac", label: "CAC registration", required: true },
  { key: "red_card", label: '"Red card" / airport access permit', required: true },
  { key: "id", label: "Government-issued ID", required: true },
  { key: "association", label: "Association membership", required: false },
  { key: "insurance", label: "Insurance certificate", required: false },
] as const;

type DocumentKey = (typeof DOCUMENT_TYPES)[number]["key"];

interface TeamMemberDraft {
  id: string;
  fullName: string;
  roleTitle: string;
  phone: string;
  email: string;
  bio: string;
  headshot: File | null;
  headshotPreview: string | null;
}

const emptyMember = (): TeamMemberDraft => ({
  id: crypto.randomUUID(),
  fullName: "",
  roleTitle: "",
  phone: "",
  email: "",
  bio: "",
  headshot: null,
  headshotPreview: null,
});

const STEPS = [
  "Business details",
  "Team members",
  "Verification documents",
  "Review & submit",
] as const;

export function ProviderOnboardingForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [businessName, setBusinessName] = useState("");
  const [bio, setBio] = useState("");
  const [yearsExperience, setYearsExperience] = useState("");
  const [serviceAreas, setServiceAreas] = useState<string[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMemberDraft[]>([emptyMember()]);
  const [documents, setDocuments] = useState<Partial<Record<DocumentKey, File>>>({});

  const toggleCity = (city: string) => {
    setServiceAreas((prev) =>
      prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city]
    );
  };

  const updateMember = (id: string, patch: Partial<TeamMemberDraft>) => {
    setTeamMembers((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)));
  };

  const removeMember = (id: string) => {
    setTeamMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const canProceedFromStep0 =
    businessName.trim().length > 1 && yearsExperience !== "" && serviceAreas.length > 0;

  const requiredDocsUploaded = DOCUMENT_TYPES.filter((d) => d.required).every(
    (d) => documents[d.key]
  );

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("Your session expired — please log in again.");
        setSubmitting(false);
        return;
      }

      const { error: providerError } = await supabase
        .from("providers")
        .update({
          business_name: businessName,
          bio,
          years_experience: Number(yearsExperience),
          service_areas: serviceAreas.map((c) => c.toLowerCase()),
        })
        .eq("id", user.id);

      if (providerError) throw providerError;

      for (const [docType, file] of Object.entries(documents) as [DocumentKey, File][]) {
        const path = `${user.id}/${docType}-${Date.now()}-${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from("provider-documents")
          .upload(path, file);
        if (uploadError) throw uploadError;

        const { error: docRowError } = await supabase.from("provider_documents").insert({
          provider_id: user.id,
          document_type: docType,
          file_path: path,
        });
        if (docRowError) throw docRowError;
      }

      for (const member of teamMembers) {
        if (!member.fullName.trim()) continue;

        let headshotPath: string | null = null;
        if (member.headshot) {
          const path = `${user.id}/${member.id}-${member.headshot.name}`;
          const { error: uploadError } = await supabase.storage
            .from("team-headshots")
            .upload(path, member.headshot);
          if (uploadError) throw uploadError;
          headshotPath = path;
        }

        const { error: memberError } = await supabase.from("provider_team_members").insert({
          provider_id: user.id,
          full_name: member.fullName,
          role_title: member.roleTitle || null,
          phone: member.phone || null,
          email: member.email || null,
          bio: member.bio || null,
          headshot_path: headshotPath,
        });
        if (memberError) throw memberError;
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-lg py-24 text-center">
        <CheckCircle2 className="mx-auto size-14 text-gold-400" />
        <h1 className="mt-6 font-display text-2xl font-semibold">Application submitted</h1>
        <p className="mt-2 text-foreground-muted">
          Our team is reviewing your documents. We&apos;ll notify you as soon as your account is
          verified — usually within 2 business days.
        </p>
        <Button className="mt-8" onClick={() => router.push("/provider/dashboard")}>
          Go to dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl py-14">
      <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div
              className={cn(
                "flex size-8 items-center justify-center rounded-full border text-xs font-medium",
                i === step
                  ? "border-gold-500 bg-gold-500/10 text-gold-400"
                  : i < step
                    ? "border-primary-500 bg-primary-500/10 text-primary-400"
                    : "border-border text-foreground-muted"
              )}
            >
              {i < step ? <CheckCircle2 className="size-4" /> : i + 1}
            </div>
            {i < STEPS.length - 1 && <div className="h-px w-6 bg-border sm:w-8" />}
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-background-card/80 p-8">
        <h2 className="font-display text-xl font-semibold">{STEPS[step]}</h2>

        {step === 0 && (
          <div className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Business / trading name</label>
              <Input
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Apex Protocol Services"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                placeholder="Tell clients about your experience and specialties"
                className="w-full rounded-xl border border-border bg-background-secondary px-4 py-2.5 text-sm text-foreground placeholder:text-foreground-muted outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Years of experience</label>
              <Input
                type="number"
                min={0}
                value={yearsExperience}
                onChange={(e) => setYearsExperience(e.target.value)}
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
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="mt-6 space-y-5">
            <p className="text-sm text-foreground-muted">
              Add the protocol officers clients may meet. This helps build trust and appears on
              your public profile.
            </p>

            {teamMembers.map((member, i) => (
              <div key={member.id} className="rounded-xl border border-border p-4">
                <div className="flex items-start gap-4">
                  <label className="relative flex size-16 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-border bg-background-secondary">
                    {member.headshotPreview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={member.headshotPreview}
                        alt={member.fullName || "Team member headshot"}
                        className="size-full object-cover"
                      />
                    ) : (
                      <UserRound className="size-6 text-foreground-muted" />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        updateMember(member.id, {
                          headshot: file,
                          headshotPreview: URL.createObjectURL(file),
                        });
                      }}
                    />
                  </label>

                  <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
                    <Input
                      placeholder="Full name"
                      value={member.fullName}
                      onChange={(e) => updateMember(member.id, { fullName: e.target.value })}
                    />
                    <Input
                      placeholder="Role (e.g. Lead Protocol Officer)"
                      value={member.roleTitle}
                      onChange={(e) => updateMember(member.id, { roleTitle: e.target.value })}
                    />
                    <Input
                      type="tel"
                      placeholder="Phone number"
                      value={member.phone}
                      onChange={(e) => updateMember(member.id, { phone: e.target.value })}
                    />
                    <Input
                      type="email"
                      placeholder="Email address"
                      value={member.email}
                      onChange={(e) => updateMember(member.id, { email: e.target.value })}
                    />
                    <textarea
                      placeholder="Short bio"
                      rows={2}
                      value={member.bio}
                      onChange={(e) => updateMember(member.id, { bio: e.target.value })}
                      className="col-span-full w-full rounded-xl border border-border bg-background-secondary px-4 py-2.5 text-sm text-foreground placeholder:text-foreground-muted outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
                    />
                  </div>
                </div>

                {teamMembers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMember(member.id)}
                    className="mt-3 flex items-center gap-1 text-xs text-red-400 hover:underline"
                  >
                    <Trash2 className="size-3.5" />
                    Remove {member.fullName || `member ${i + 1}`}
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={() => setTeamMembers((prev) => [...prev, emptyMember()])}
              className="w-full rounded-xl border border-dashed border-border py-3 text-sm text-foreground-muted transition-colors hover:border-primary-400 hover:text-foreground"
            >
              + Add another team member
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="mt-6 space-y-3">
            <p className="text-sm text-foreground-muted">
              Upload clear scans or photos. CAC, red card, and ID are required to begin review.
            </p>
            {DOCUMENT_TYPES.map((doc) => (
              <label
                key={doc.key}
                className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-border bg-background-secondary px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <FileUp className="size-4 shrink-0 text-foreground-muted" />
                  <div>
                    <p className="text-sm">
                      {doc.label}
                      {doc.required && <span className="ml-1 text-gold-400">*</span>}
                    </p>
                    {documents[doc.key] && (
                      <p className="truncate text-xs text-foreground-muted">
                        {documents[doc.key]!.name}
                      </p>
                    )}
                  </div>
                </div>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setDocuments((prev) => ({ ...prev, [doc.key]: file }));
                  }}
                />
                <span className="shrink-0 text-xs text-primary-400">
                  {documents[doc.key] ? "Replace" : "Upload"}
                </span>
              </label>
            ))}
          </div>
        )}

        {step === 3 && (
          <div className="mt-6 space-y-4 text-sm">
            <div>
              <p className="text-foreground-muted">Business</p>
              <p className="font-medium">{businessName || "—"}</p>
            </div>
            <div>
              <p className="text-foreground-muted">Experience</p>
              <p className="font-medium">{yearsExperience || "0"} years</p>
            </div>
            <div>
              <p className="text-foreground-muted">Service areas</p>
              <p className="font-medium">{serviceAreas.join(", ") || "—"}</p>
            </div>
            <div>
              <p className="text-foreground-muted">Team members</p>
              <p className="font-medium">
                {teamMembers.filter((m) => m.fullName.trim()).length} added
              </p>
            </div>
            <div>
              <p className="text-foreground-muted">Documents attached</p>
              <p className="font-medium">
                {Object.keys(documents).length} of {DOCUMENT_TYPES.length}
              </p>
            </div>
            {error && <p className="text-red-400">{error}</p>}
          </div>
        )}

        <div className="mt-8 flex items-center justify-between">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0 || submitting}
            className="gap-1"
          >
            <ChevronLeft className="size-4" />
            Back
          </Button>

          {step < STEPS.length - 1 ? (
            <Button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              disabled={
                step === 0 ? !canProceedFromStep0 : step === 2 ? !requiredDocsUploaded : false
              }
              className="gap-1"
            >
              Next
              <ChevronRight className="size-4" />
            </Button>
          ) : (
            <Button type="button" onClick={handleSubmit} disabled={submitting} className="gap-2">
              {submitting && <Loader2 className="size-4 animate-spin" />}
              {submitting ? "Submitting…" : "Submit for review"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
