import { TicketDetailClient } from "@/components/tickets/ticket-detail-client";
import { getCurrentUserRole } from "@/lib/auth/user";

export default async function TicketDetailPage({ params }: { params: { ticketId: string } }) {
  const role = await getCurrentUserRole();
  const canWrite = role === "admin" || role === "agent";
  return <TicketDetailClient ticketId={params.ticketId} canWrite={canWrite} />;
}

