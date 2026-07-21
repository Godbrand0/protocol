"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Briefcase, User } from "lucide-react";
import { register, type AuthState } from "@/app/(auth)/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function RegisterForm() {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(register, undefined);
  const [role, setRole] = useState<"client" | "provider">("client");

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <h1 className="font-display text-2xl font-semibold">Create your account</h1>
        <p className="mt-1 text-sm text-foreground-muted">
          Join ProtocolLink as a client or a verified provider.
        </p>
      </div>

      <input type="hidden" name="role" value={role} />
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setRole("client")}
          className={cn(
            "flex flex-col items-center gap-2 rounded-xl border px-4 py-4 text-sm transition-colors",
            role === "client"
              ? "border-primary-500 bg-primary-500/10 text-foreground"
              : "border-border text-foreground-muted hover:bg-background-secondary"
          )}
        >
          <User className="size-5" />
          I&apos;m a client
        </button>
        <button
          type="button"
          onClick={() => setRole("provider")}
          className={cn(
            "flex flex-col items-center gap-2 rounded-xl border px-4 py-4 text-sm transition-colors",
            role === "provider"
              ? "border-gold-500 bg-gold-500/10 text-foreground"
              : "border-border text-foreground-muted hover:bg-background-secondary"
          )}
        >
          <Briefcase className="size-5" />
          I&apos;m a provider
        </button>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="fullName" className="text-sm font-medium">
          Full name
        </label>
        <Input id="fullName" name="fullName" required autoComplete="name" />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <Input id="email" name="email" type="email" required autoComplete="email" />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="phone" className="text-sm font-medium">
          Phone number
        </label>
        <Input id="phone" name="phone" type="tel" required autoComplete="tel" />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="new-password"
        />
      </div>

      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}

      <Button type="submit" variant={role === "provider" ? "gold" : "default"} className="w-full" disabled={pending}>
        {pending ? "Creating account…" : "Create account"}
      </Button>

      <p className="text-center text-sm text-foreground-muted">
        Already have an account?{" "}
        <Link href="/login" className="text-primary-400 hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
