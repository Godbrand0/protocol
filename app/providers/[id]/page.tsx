import { notFound } from "next/navigation";
import Link from "next/link";
import { AlertTriangle, AtSign, Mail, MapPin, MessageCircle, ShieldCheck, Star } from "lucide-react";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { mockProviders } from "@/lib/mock-providers";

export function generateStaticParams() {
  return mockProviders.map((provider) => ({ id: provider.id }));
}

export default async function ProviderProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const provider = mockProviders.find((p) => p.id === id);

  if (!provider) notFound();

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-6 py-12">
          <div className="flex flex-col gap-6 rounded-2xl border border-border bg-background-card/70 p-8 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-primary-500 to-primary-800 text-xl font-semibold text-white">
                {provider.businessName
                  .split(" ")
                  .slice(0, 2)
                  .map((w) => w[0])
                  .join("")}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-display text-2xl font-semibold">
                    {provider.businessName}
                  </h1>
                  {provider.isVerified && (
                    <Badge variant="verified">
                      <ShieldCheck className="size-3" />
                      Verified
                    </Badge>
                  )}
                </div>
                <div className="mt-1.5 flex items-center gap-1.5 text-sm text-foreground-muted">
                  <MapPin className="size-4" />
                  {provider.city} · {provider.yearsExperience} years experience
                </div>
                <div className="mt-2 flex items-center gap-1 text-sm">
                  <Star className="size-4 fill-gold-400 text-gold-400" />
                  <span className="font-medium">{provider.rating.toFixed(1)}</span>
                  <span className="text-foreground-muted">({provider.reviews} reviews)</span>
                </div>
              </div>
            </div>

            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
              <Link
                href={`/messages/${provider.id}`}
                className={buttonVariants({ variant: "outline", size: "lg", className: "gap-2" })}
              >
                <MessageCircle className="size-4" />
                Message
              </Link>
              <Link
                href={`/book/${provider.id}`}
                className={buttonVariants({ variant: "gold", size: "lg" })}
              >
                Request booking
              </Link>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="font-display text-lg font-semibold">About</h2>
                  <p className="mt-2 text-sm text-foreground-muted">{provider.bio}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h2 className="font-display text-lg font-semibold">Meet the team</h2>
                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {provider.team.map((member) => (
                      <div
                        key={member.name}
                        className="flex items-center gap-3 rounded-xl border border-border bg-background-secondary p-3"
                      >
                        <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-primary-500 to-primary-800 text-base font-semibold text-white">
                          {member.initials}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{member.name}</p>
                          <p className="truncate text-xs text-foreground-muted">{member.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h2 className="font-display text-lg font-semibold">Service offered</h2>
                  <div className="mt-4 flex items-center justify-between rounded-xl border border-border bg-background-secondary px-4 py-3">
                    <div>
                      <p className="text-sm font-medium">{provider.serviceLabel}</p>
                      <p className="text-xs text-foreground-muted">
                        Base price for this service
                      </p>
                    </div>
                    <p className="font-display text-base font-semibold">
                      ₦{provider.basePrice.toLocaleString()}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h2 className="font-display text-lg font-semibold">Reviews</h2>
                  <p className="mt-2 text-sm text-foreground-muted">
                    No reviews to show yet — this section will populate once bookings are
                    completed.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="font-display text-base font-semibold">Verification</h2>
                  <ul className="mt-3 space-y-2 text-sm text-foreground-muted">
                    <li className="flex items-center gap-2">
                      <ShieldCheck className="size-4 text-gold-400" />
                      {provider.isVerified
                        ? "Credentials verified by ProtocolLink"
                        : "Verification pending"}
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h2 className="font-display text-base font-semibold">Service areas</h2>
                  <p className="mt-2 text-sm text-foreground-muted">{provider.city}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h2 className="font-display text-base font-semibold">Contact</h2>
                  <div className="mt-3 flex flex-col gap-2">
                    <a
                      href={`https://instagram.com/${provider.instagramHandle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-foreground-muted transition-colors hover:border-primary-400 hover:text-foreground"
                    >
                      <AtSign className="size-4" />@{provider.instagramHandle}
                    </a>
                    <a
                      href={`mailto:${provider.contactEmail}`}
                      className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-foreground-muted transition-colors hover:border-primary-400 hover:text-foreground"
                    >
                      <Mail className="size-4" />
                      {provider.contactEmail}
                    </a>
                  </div>

                  <div className="mt-4 flex gap-2 rounded-xl border border-gold-500/30 bg-gold-500/10 p-3 text-xs text-gold-400">
                    <AlertTriangle className="size-4 shrink-0" />
                    <p>
                      For your safety, keep all conversations and payments on ProtocolLink.
                      We can&apos;t verify or protect deals made off-platform via social media
                      or email.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
