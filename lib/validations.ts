import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  fullName: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().min(7, "Enter a valid phone number"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["client", "provider"]),
});

export const clientProfileSchema = z.object({
  fullName: z.string().min(2, "Enter your full name"),
  phone: z.string().min(7, "Enter a valid phone number"),
  companyName: z.string().optional(),
});

export const providerProfileSchema = z.object({
  businessName: z.string().min(2, "Enter a business name"),
  bio: z.string().optional(),
  yearsExperience: z.coerce.number().min(0, "Enter a valid number of years"),
  serviceAreas: z.array(z.string()).min(1, "Select at least one service area"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ClientProfileInput = z.infer<typeof clientProfileSchema>;
export type ProviderProfileInput = z.infer<typeof providerProfileSchema>;
