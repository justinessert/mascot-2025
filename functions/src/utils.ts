import { specialNcaaNames } from "./constants";

export function transformTeamName(teamName: string): string {
  if (!teamName) return "";

  // Convert using special mapping if exists
  const mappedName = specialNcaaNames[teamName] || teamName;

  // Replace underscores with hyphens and "state" with "st"
  return mappedName.replace(/_/g, "-").replace(/state/gi, "st");
}
