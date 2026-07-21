import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";

export function SimplePage({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <h1 className="font-display text-3xl font-bold">{title}</h1>
          <div className="mt-6 space-y-4 text-foreground-muted [&>p]:leading-relaxed">
            {children}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
