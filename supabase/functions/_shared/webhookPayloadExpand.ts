/**
 * Keep in sync with lib/webhooks/payload-template.ts (Deno cannot import app lib).
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

export function expandWebhookPayloadTemplate(
  template: string,
  eventName: string,
  ticket: Record<string, unknown> | null
): string {
  return template.replace(/\{\{\s*([a-zA-Z0-9_.]+)\s*\}\}/g, (_m, path: string) => {
    const val = getMacroValue(path, eventName, ticket);
    return jsonLiteral(val);
  });
}
