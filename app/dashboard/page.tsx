import Link from "next/link";
import { UserCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/(auth)/actions";
import { Button, buttonVariants } from "@/components/ui/button";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="mx-auto flex min-h-svh max-w-4xl flex-col gap-6 px-6 py-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">
            Welcome{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ""}
          </h1>
          <p className="mt-1 text-sm text-foreground-muted">{user?.email}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/profile"
            className={buttonVariants({ variant: "outline", size: "sm", className: "gap-1.5" })}
          >
            <UserCircle className="size-4" />
            Profile
          </Link>
          <form action={signOut}>
            <Button type="submit" variant="outline" size="sm">
              Log out
            </Button>
          </form>
        </div>
      </div>
      <div className="rounded-2xl border border-border bg-background-card/60 p-8 text-center text-sm text-foreground-muted">
        Your bookings and messages will show up here.
      </div>
    </div>
  );
}
