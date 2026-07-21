// Placeholder data for the search page until the Supabase schema is seeded.
export interface MockTeamMember {
  name: string;
  role: string;
  initials: string;
}

export interface MockProvider {
  id: string;
  businessName: string;
  city: "Lagos" | "Abuja";
  serviceType: "airport_arrival" | "airport_departure" | "event_protocol" | "full_day";
  serviceLabel: string;
  basePrice: number;
  rating: number;
  reviews: number;
  yearsExperience: number;
  isVerified: boolean;
  isFeatured: boolean;
  bio: string;
  instagramHandle: string;
  contactEmail: string;
  team: MockTeamMember[];
}

export const mockProviders: MockProvider[] = [
  {
    id: "prv-001",
    businessName: "Apex Protocol Services",
    city: "Lagos",
    serviceType: "airport_arrival",
    serviceLabel: "Airport Arrival VIP Protocol",
    basePrice: 85000,
    rating: 4.9,
    reviews: 132,
    yearsExperience: 9,
    isVerified: true,
    isFeatured: true,
    bio: "Fast-track immigration and luggage handling at MMIA with a dedicated protocol officer.",
    instagramHandle: "apexprotocolng",
    contactEmail: "hello@apexprotocol.ng",
    team: [
      { name: "Ifeoma Nwosu", role: "Lead Protocol Officer", initials: "IN" },
      { name: "Segun Adeyemi", role: "Airport Liaison", initials: "SA" },
    ],
  },
  {
    id: "prv-002",
    businessName: "Sovereign Escort & Logistics",
    city: "Abuja",
    serviceType: "event_protocol",
    serviceLabel: "Full Event Protocol Team",
    basePrice: 250000,
    rating: 4.8,
    reviews: 76,
    yearsExperience: 12,
    isVerified: true,
    isFeatured: true,
    bio: "State-visit-grade protocol staffing for conferences, summits, and diplomatic events.",
    instagramHandle: "sovereignescort",
    contactEmail: "bookings@sovereignescort.ng",
    team: [
      { name: "Amina Bello", role: "Director of Protocol", initials: "AB" },
      { name: "Emeka Okafor", role: "Event Security Lead", initials: "EO" },
    ],
  },
  {
    id: "prv-003",
    businessName: "Zenith VIP Facilitation",
    city: "Lagos",
    serviceType: "full_day",
    serviceLabel: "Full-Day Executive Facilitation",
    basePrice: 180000,
    rating: 4.7,
    reviews: 54,
    yearsExperience: 6,
    isVerified: true,
    isFeatured: false,
    bio: "End-to-end logistics and protocol support for executives across a full itinerary.",
    instagramHandle: "zenithvip",
    contactEmail: "concierge@zenithvip.ng",
    team: [
      { name: "Tobi Alabi", role: "Executive Facilitator", initials: "TA" },
      { name: "Grace Umeh", role: "Client Relations", initials: "GU" },
    ],
  },
  {
    id: "prv-004",
    businessName: "Crown Departure Concierge",
    city: "Abuja",
    serviceType: "airport_departure",
    serviceLabel: "Airport Departure Concierge",
    basePrice: 65000,
    rating: 4.6,
    reviews: 41,
    yearsExperience: 5,
    isVerified: false,
    isFeatured: false,
    bio: "Check-in assistance, lounge coordination, and priority boarding support.",
    instagramHandle: "crowndeparture",
    contactEmail: "fly@crowndeparture.ng",
    team: [
      { name: "Halima Yusuf", role: "Departure Concierge", initials: "HY" },
      { name: "David Okonkwo", role: "Lounge Coordinator", initials: "DO" },
    ],
  },
  {
    id: "prv-005",
    businessName: "Regal Access Protocol",
    city: "Lagos",
    serviceType: "event_protocol",
    serviceLabel: "Wedding & Gala Protocol",
    basePrice: 150000,
    rating: 4.9,
    reviews: 98,
    yearsExperience: 8,
    isVerified: true,
    isFeatured: false,
    bio: "Discreet, polished protocol staffing for weddings, galas, and private functions.",
    instagramHandle: "regalaccess",
    contactEmail: "events@regalaccess.ng",
    team: [
      { name: "Funmi Oladipo", role: "Head of Events", initials: "FO" },
      { name: "Kelvin Eze", role: "Protocol Officer", initials: "KE" },
    ],
  },
  {
    id: "prv-006",
    businessName: "Nimbus Airport Assist",
    city: "Abuja",
    serviceType: "airport_arrival",
    serviceLabel: "Airport Arrival Meet & Greet",
    basePrice: 70000,
    rating: 4.5,
    reviews: 29,
    yearsExperience: 4,
    isVerified: true,
    isFeatured: false,
    bio: "Reliable meet & greet and secure transfer from Nnamdi Azikiwe International.",
    instagramHandle: "nimbusairport",
    contactEmail: "hello@nimbusairport.ng",
    team: [
      { name: "Chioma Nwachukwu", role: "Meet & Greet Lead", initials: "CN" },
      { name: "Bashir Suleiman", role: "Transfer Coordinator", initials: "BS" },
    ],
  },
];

export const serviceTypeLabels: Record<MockProvider["serviceType"], string> = {
  airport_arrival: "Airport Arrival",
  airport_departure: "Airport Departure",
  event_protocol: "Event Protocol",
  full_day: "Full-Day Facilitation",
};
