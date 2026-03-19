import { describe, expect, it } from "vitest";
import {
  DEFAULT_WEBHOOK_PAYLOAD_TEMPLATE,
  expandWebhookPayloadTemplate,
  parseExpandedWebhookBody,
  SAMPLE_TICKET_FOR_PREVIEW
} from "./payload-template";

describe("expandWebhookPayloadTemplate", () => {
  it("expands default template with sample ticket", () => {
    const raw = expandWebhookPayloadTemplate(DEFAULT_WEBHOOK_PAYLOAD_TEMPLATE, "created", SAMPLE_TICKET_FOR_PREVIEW);
    const parsed = parseExpandedWebhookBody(raw);
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    expect(parsed.value).toMatchObject({
      event_name: "created",
      ticket: expect.objectContaining({ subject: "Example: billing question" })
    });
  });

  it("uses nulls when ticket missing", () => {
    const raw = expandWebhookPayloadTemplate(DEFAULT_WEBHOOK_PAYLOAD_TEMPLATE, "updated", null);
    const parsed = parseExpandedWebhookBody(raw);
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    const v = parsed.value as { ticket: Record<string, unknown> };
    expect(v.ticket.id).toBeNull();
  });
});
