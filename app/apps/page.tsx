import { AppsClient } from "@/components/apps/apps-client";
import { getCurrentUserRole } from "@/lib/auth/user";

export default async function AppsPage() {
  const role = await getCurrentUserRole();
  return <AppsClient canAddApps={role === "admin"} />;
}

