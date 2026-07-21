import { notFound } from "next/navigation";
import { Navbar } from "@/components/marketing/navbar";
import { BookingForm } from "@/components/forms/booking-form";
import { mockProviders } from "@/lib/mock-providers";

export function generateStaticParams() {
  return mockProviders.map((provider) => ({ id: provider.id }));
}

export default async function BookPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const provider = mockProviders.find((p) => p.id === id);

  if (!provider) notFound();

  return (
    <>
      <Navbar />
      <main className="flex-1 px-6">
        <BookingForm provider={provider} />
      </main>
    </>
  );
}
