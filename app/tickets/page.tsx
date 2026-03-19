import { TicketsClient } from "@/components/tickets/tickets-client";
import { getCurrentUserRole } from "@/lib/auth/user";

export default async function TicketsPage() {
  const role = await getCurrentUserRole();
  const canSeed = role === "admin" || role === "agent";
  return <TicketsClient canSeed={canSeed} />;
}

