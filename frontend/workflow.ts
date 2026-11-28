export const stages = ["submitted","verified","assigned","in_progress","assisted","closed"] as const;
export const roles = ["VOLUNTEER","RESCUE_COORDINATOR","NGO","GOVERNMENT_AUTHORITY","SUPER_ADMIN"] as const;
export type Role = typeof roles[number];
export type Stage = typeof stages[number];
const operators: Partial<Record<Stage, Role[]>> = {
  submitted:["RESCUE_COORDINATOR","GOVERNMENT_AUTHORITY"],
  verified:["RESCUE_COORDINATOR"], assigned:["VOLUNTEER"],
  in_progress:["VOLUNTEER","NGO"], assisted:["RESCUE_COORDINATOR"]
};
export function nextStage(stage: Stage, role: Role): Stage | undefined {
  if (!operators[stage] || (role !== "SUPER_ADMIN" && !operators[stage]?.includes(role))) return;
  return stages[stages.indexOf(stage)+1];
}
