export const ROLES = ["CITIZEN", "VOLUNTEER", "RESCUE_COORDINATOR", "NGO", "GOVERNMENT_AUTHORITY", "SUPER_ADMIN"] as const;
export type Role = typeof ROLES[number];
export const HAZARDS = ["flood", "drought", "cold-wave"] as const;
export type Hazard = typeof HAZARDS[number];
export type CaseStatus = "submitted" | "verified" | "assigned" | "in_progress" | "assisted" | "closed";
export type AlertSource = "official" | "community" | "ai_advisory" | "simulation";
export interface Alert {
  id: string;
  hazard: Hazard;
  source: AlertSource;
  area: string;
  issuedAt: string;
  expiresAt: string;
  severity: "advisory" | "warning" | "severe" | "emergency";
  message: { bn: string; en: string };
}
export interface AssistanceCase {
  id: string;
  hazard: Hazard;
  status: CaseStatus;
  area: string;
  createdAt: string;
}
