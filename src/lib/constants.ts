// ============================================================
// TEDx KLH 2026 — Metamorphosis Authoritative Constants & Config
// ============================================================

export const TOTAL_SEATS = 250;

export interface TicketConfig {
  id: "individual" | "group_of_4";
  name: string;
  price: number;
  seats: number;
  description: string;
}

export const TICKET_CONFIGS: Record<"individual" | "group_of_4", TicketConfig> = {
  individual: {
    id: "individual",
    name: "₹549 Ticket",
    price: 549,
    seats: 1,
    description: "Single delegate admission pass",
  },
  group_of_4: {
    id: "group_of_4",
    name: "₹1999 Ticket",
    price: 1999,
    seats: 4,
    description: "Squad of 4 delegates admission pass",
  },
};

/**
 * Authoritative helper to get ticket tier configuration by pass_type or ticket_type
 */
export function getTicketConfig(passOrTicketType?: string | null): TicketConfig {
  if (!passOrTicketType) return TICKET_CONFIGS.individual;
  const clean = passOrTicketType.toLowerCase().trim();
  if (clean === "group_of_4" || clean.includes("1999") || clean.includes("group")) {
    return TICKET_CONFIGS.group_of_4;
  }
  return TICKET_CONFIGS.individual;
}

/**
 * Format numbers into Indian Rupee currency format (e.g. ₹1,24,857)
 */
export function formatINR(amount: number): string {
  const safeAmount = isNaN(amount) ? 0 : Math.round(amount);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(safeAmount);
}

/**
 * Format seat numbers with commas if needed
 */
export function formatNumber(val: number): string {
  const safeVal = isNaN(val) ? 0 : val;
  return new Intl.NumberFormat("en-IN").format(safeVal);
}
