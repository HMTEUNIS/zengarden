import type { TicketPriority, TicketStatus } from "@/lib/tickets/types";

export type TicketStatusTransitionRule = {
  from: TicketStatus;
  to: TicketStatus;
};

/**
 * Sandbox-friendly transitions: any move between distinct statuses is allowed.
 * (Strict linear Zendesk-style rules were confusing in the UI because the dropdown
 * listed every status while only a few edges were legal.)
 */
const ALLOWED_TRANSITIONS: TicketStatusTransitionRule[] = [
  { from: "new", to: "open" },
  { from: "open", to: "pending" },
  { from: "pending", to: "solved" },
  { from: "solved", to: "closed" }
];

export function isAllowedStatusTransition(from: TicketStatus, to: TicketStatus) {
  if (from === to) return false;
  const allStatuses: TicketStatus[] = ["new", "open", "pending", "solved", "closed"];
  return allStatuses.includes(from) && allStatuses.includes(to);
}

/** Optional stricter workflow (e.g. for future fork / production mode). */
export function isAllowedStatusTransitionStrict(from: TicketStatus, to: TicketStatus) {
  return ALLOWED_TRANSITIONS.some((r) => r.from === from && r.to === to);
}

export function inferTicketEventFromUpdate(before: { status: TicketStatus }, after: { status: TicketStatus }, updatedFields: string[]) {
  if (before.status !== after.status) {
    if (after.status === "solved") return "solved" as const;
    return "updated" as const;
  }
  if (updatedFields.length > 0) return "updated" as const;
  return "updated" as const;
}

export function clampPriority(priority: string): TicketPriority {
  const allowed: TicketPriority[] = ["low", "normal", "high", "urgent"];
  if (!allowed.includes(priority as TicketPriority)) return "normal";
  return priority as TicketPriority;
}

