import { Navbar } from "@/components/marketing/navbar";
import { ProviderOnboardingForm } from "@/components/forms/provider-onboarding-form";

export default function ProviderOnboardingPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 px-6">
        <ProviderOnboardingForm />
      </main>
    </>
  );
}
