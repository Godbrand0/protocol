import { notFound } from "next/navigation";
import { Navbar } from "@/components/marketing/navbar";
import { ChatWindow } from "@/components/chat/chat-window";
import { mockProviders } from "@/lib/mock-providers";

export function generateStaticParams() {
  return mockProviders.map((provider) => ({ id: provider.id }));
}

export default async function MessagesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const provider = mockProviders.find((p) => p.id === id);

  if (!provider) notFound();

  return (
    <>
      <Navbar />
      <ChatWindow provider={provider} />
    </>
  );
}
