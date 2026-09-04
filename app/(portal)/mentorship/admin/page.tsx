import { redirect } from "next/navigation";

import { Dashboard } from "@/app/(portal)/mentorship/admin/Dashboard";
import { hasAdminSession } from "@/mentorship/lib/admin-session";
import { buildOverview } from "@/mentorship/lib/overview";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  if (!(await hasAdminSession())) redirect("/admin/login?next=/admin");

  const overview = await buildOverview();
  const generatedOn = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return <Dashboard overview={overview} generatedOn={generatedOn} />;
}
