import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminOrResponse } from "@/lib/api/require-admin";

const AutomationExecuteSchema = z.object({
  ticket_id: z.string().min(1),
  event_name: z.enum(["created", "updated", "solved"])
});

export async function POST(req: Request) {
  const admin = await requireAdminOrResponse();
  if (!admin.ok) return admin.response;

  const body = await req.json().catch(() => null);
  const parsed = AutomationExecuteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid body" }, { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) return NextResponse.json({ error: "Missing NEXT_PUBLIC_SUPABASE_URL" }, { status: 500 });

  const response = await fetch(`${supabaseUrl}/functions/v1/automation-execute`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(parsed.data)
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    return NextResponse.json({ error: `Automation dispatch failed: HTTP ${response.status} ${text}` }, { status: 500 });
  }

  const data = await response.json().catch(() => ({}));
  return NextResponse.json(data, { status: 200 });
}

