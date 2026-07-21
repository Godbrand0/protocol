export type UserRole = "client" | "provider" | "admin";

export type VerificationStatus = "pending" | "approved" | "rejected";

export type BookingStatus =
  | "pending"
  | "accepted"
  | "paid"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "disputed";

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  company_name: string | null;
  created_at: string;
}

export interface Provider {
  id: string;
  business_name: string | null;
  bio: string | null;
  years_experience: number | null;
  verification_status: VerificationStatus;
  verified_at: string | null;
  service_areas: string[];
  average_rating: number | null;
  total_reviews: number;
  is_featured: boolean;
}

export type DocumentType = "cac" | "red_card" | "id" | "association" | "insurance";
export type DocumentStatus = "pending" | "approved" | "rejected";

export interface ProviderDocument {
  id: string;
  provider_id: string;
  document_type: DocumentType;
  file_path: string;
  status: DocumentStatus;
  reviewed_at: string | null;
  reviewer_notes: string | null;
  created_at: string;
}

export interface TeamMember {
  id: string;
  provider_id: string;
  full_name: string;
  role_title: string | null;
  phone: string | null;
  email: string | null;
  bio: string | null;
  headshot_path: string | null;
  created_at: string;
}

export interface Service {
  id: string;
  provider_id: string;
  title: string;
  description: string | null;
  service_type: string;
  base_price: number;
  currency: string;
  duration_hours: number | null;
  is_active: boolean;
}

export interface Booking {
  id: string;
  client_id: string;
  provider_id: string;
  service_id: string;
  status: BookingStatus;
  booking_date: string;
  start_time: string;
  end_time: string | null;
  location: string;
  flight_number: string | null;
  passenger_count: number;
  special_requests: string | null;
  total_amount: number;
  platform_fee: number;
  provider_amount: number;
  paystack_reference: string | null;
  created_at: string;
  completed_at: string | null;
}

export interface Review {
  id: string;
  booking_id: string;
  client_id: string;
  provider_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
}
