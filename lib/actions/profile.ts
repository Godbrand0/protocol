"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { clientProfileSchema, providerProfileSchema } from "@/lib/validations";

export type ProfileActionState = { error?: string; success?: boolean } | undefined;

export async function updateClientProfile(
  _prevState: ProfileActionState,
  formData: FormData
): Promise<ProfileActionState> {
  const parsed = clientProfileSchema.safeParse({
    fullName: formData.get("fullName"),
    phone: formData.get("phone"),
    companyName: formData.get("companyName") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: parsed.data.fullName,
      phone: parsed.data.phone,
      company_name: parsed.data.companyName ?? null,
    })
    .eq("id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/profile");
  return { success: true };
}

export async function updateProviderProfile(
  _prevState: ProfileActionState,
  formData: FormData
): Promise<ProfileActionState> {
  const parsed = providerProfileSchema.safeParse({
    businessName: formData.get("businessName"),
    bio: formData.get("bio") || undefined,
    yearsExperience: formData.get("yearsExperience"),
    serviceAreas: formData.getAll("serviceAreas"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in." };
  }

  const { error } = await supabase
    .from("providers")
    .update({
      business_name: parsed.data.businessName,
      bio: parsed.data.bio ?? null,
      years_experience: parsed.data.yearsExperience,
      service_areas: parsed.data.serviceAreas.map((c) => c.toLowerCase()),
    })
    .eq("id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/provider/dashboard");
  return { success: true };
}
