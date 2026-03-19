import { AppSettingsClient } from "@/components/apps/app-settings-client";
import { getCurrentUserRole } from "@/lib/auth/user";
import { redirect } from "next/navigation";

export default async function AppSettingsPage({ params }: { params: { appId: string } }) {
  const role = await getCurrentUserRole();
  if (!role) redirect("/tickets");
  const canWrite = role === "admin";
  return <AppSettingsClient appId={params.appId} canWrite={canWrite} />;
}

