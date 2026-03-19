/**
 * Webhook POST body templates use `{{macro}}` placeholders.
 * Each macro is replaced with a JSON literal (via JSON.stringify), so do NOT wrap macros in extra quotes.
 *
 * Supported:
 * - {{event_name}} → "created" | "updated" | "solved"
 * - {{ticket.id}}, {{ticket.subject}}, {{ticket.description}}, {{ticket.type}}, {{ticket.status}},
 *   {{ticket.priority}}, {{ticket.tags}}, {{ticket.requester_id}}, {{ticket.assignee_id}},
 *   {{ticket.organization_id}}, {{ticket.created_at}}, {{ticket.updated_at}}
 */

export const DEFAULT_WEBHOOK_PAYLOAD_TEMPLATE = `{
  "event_name": {{event_name}},
  "ticket": {
    "id": {{ticket.id}},
    "subject": {{ticket.subject}},
    "description": {{ticket.description}},
    "type": {{ticket.type}},
    "status": {{ticket.status}},
    "priority": {{ticket.priority}},
    "tags": {{ticket.tags}},
    "requester_id": {{ticket.requester_id}},
    "assignee_id": {{ticket.assignee_id}},
    "organization_id": {{ticket.organization_id}},
    "created_at": {{ticket.created_at}},
    "updated_at": {{ticket.updated_at}}
  }
}`;

export const WEBHOOK_PAYLOAD_MACRO_HELP = `Macros (no extra quotes around them — each expands to valid JSON):
  {{event_name}}  →  created | updated | solved
  {{ticket.id}}  {{ticket.subject}}  {{ticket.description}}  {{ticket.type}}
  {{ticket.status}}  {{ticket.priority}}  {{ticket.tags}}
  {{ticket.requester_id}}  {{ticket.assignee_id}}  {{ticket.organization_id}}
  {{ticket.created_at}}  {{ticket.updated_at}}

Unknown macros expand to null. If the ticket is missing, all {{ticket.*}} become null.`;

/** Sample ticket for UI preview only */
export const SAMPLE_TICKET_FOR_PREVIEW: Record<string, unknown> = {
  id: "00000000-0000-4000-8000-000000000001",
  subject: "Example: billing question",
  description: "Customer asked about invoice #123.",
  type: "question",
  status: "open",
  priority: "normal",
  tags: ["billing", "example"],
  requester_id: "00000000-0000-4000-8000-000000000002",
  assignee_id: null,
  organization_id: "00000000-0000-4000-8000-000000000003",
  created_at: "2025-01-15T12:00:00.000Z",
  updated_at: "2025-01-15T12:30:00.000Z"
};

function jsonLiteral(v: unknown): string {
  if (v === undefined) return "null";
  return JSON.stringify(v);
}

function getMacroValue(path: string, eventName: string, ticket: Record<string, unknown> | null): unknown {
  if (path === "event_name") return eventName;
  if (path.startsWith("ticket.")) {
    const key = path.slice("ticket.".length);
    if (!ticket || !key) return null;
    return ticket[key] ?? null;
  }
  return null;
}

/**
 * Replace macros; result must be valid JSON for typical templates.
 */
export function expandWebhookPayloadTemplate(
  template: string,
  eventName: string,
  ticket: Record<string, unknown> | null
): string {
  // Inline /g regex avoids stale lastIndex on a shared RegExp instance.
  return template.replace(/\{\{\s*([a-zA-Z0-9_.]+)\s*\}\}/g, (_m, path: string) => {
    const val = getMacroValue(path, eventName, ticket);
    return jsonLiteral(val);
  });
}

export function parseExpandedWebhookBody(expanded: string): { ok: true; value: unknown } | { ok: false; error: string } {
  try {
    return { ok: true, value: JSON.parse(expanded) };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Invalid JSON" };
  }
}
