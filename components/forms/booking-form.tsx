"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import type { MockProvider } from "@/lib/mock-providers";

const PLATFORM_FEE_RATE = 0.15;

export function BookingForm({ provider }: { provider: MockProvider }) {
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [bookingDate, setBookingDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [flightNumber, setFlightNumber] = useState("");
  const [passengerCount, setPassengerCount] = useState(1);
  const [specialRequests, setSpecialRequests] = useState("");

  const platformFee = Math.round(provider.basePrice * PLATFORM_FEE_RATE);
  const total = provider.basePrice + platformFee;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    // No live Paystack keys configured yet — simulate the confirm step so the
    // flow is testable end to end. Swap for a real Server Action + Paystack
    // transaction once PAYSTACK_SECRET_KEY is set.
    setTimeout(() => {
      setSubmitting(false);
      setConfirmed(true);
    }, 900);
  }

  if (confirmed) {
    return (
      <div className="mx-auto max-w-lg py-20 text-center">
        <CheckCircle2 className="mx-auto size-14 text-gold-400" />
        <h1 className="mt-6 font-display text-2xl font-semibold">Booking request sent</h1>
        <p className="mt-2 text-foreground-muted">
          {provider.businessName} has been notified. Once they accept, you&apos;ll be prompted to
          complete secure payment.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link
            href={`/messages/${provider.id}`}
            className={buttonVariants({ variant: "outline" })}
          >
            Message provider
          </Link>
          <Link href="/dashboard" className={buttonVariants({ variant: "gold" })}>
            Go to dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl py-14">
      <h1 className="font-display text-2xl font-semibold">Request a booking</h1>
      <p className="mt-1 text-sm text-foreground-muted">
        with {provider.businessName} · {provider.serviceLabel}
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5 rounded-2xl border border-border bg-background-card/80 p-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Date</label>
            <Input
              type="date"
              required
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Time</label>
            <Input
              type="time"
              required
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Flight number (optional)</label>
            <Input
              placeholder="e.g. BA075"
              value={flightNumber}
              onChange={(e) => setFlightNumber(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Passengers</label>
            <Input
              type="number"
              min={1}
              value={passengerCount}
              onChange={(e) => setPassengerCount(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Special requests</label>
          <textarea
            value={specialRequests}
            onChange={(e) => setSpecialRequests(e.target.value)}
            rows={3}
            placeholder="Anything the provider should know in advance"
            className="w-full rounded-xl border border-border bg-background-secondary px-4 py-2.5 text-sm text-foreground placeholder:text-foreground-muted outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
          />
        </div>

        <div className="space-y-2 rounded-xl border border-border bg-background-secondary p-4 text-sm">
          <div className="flex justify-between text-foreground-muted">
            <span>Service base price</span>
            <span>₦{provider.basePrice.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-foreground-muted">
            <span>Platform fee (15%)</span>
            <span>₦{platformFee.toLocaleString()}</span>
          </div>
          <div className="flex justify-between border-t border-border pt-2 font-semibold">
            <span>Total</span>
            <span>₦{total.toLocaleString()}</span>
          </div>
        </div>

        <Button type="submit" variant="gold" className="w-full gap-2" disabled={submitting}>
          {submitting && <Loader2 className="size-4 animate-spin" />}
          {submitting ? "Sending request…" : "Confirm & request booking"}
        </Button>
      </form>
    </div>
  );
}
