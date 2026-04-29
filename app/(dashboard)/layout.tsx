import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import { AICopilot } from "@/components/dashboard/ai-copilot";
import { getCurrentUser } from "@/lib/auth/session";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-paper">
      <Sidebar
        userName={user?.name ?? null}
        userEmail={user?.email ?? null}
        userImage={user?.image ?? null}
        planName="Creator"
      />
      <div className="pl-64">
        <Topbar />
        <main className="p-8">{children}</main>
      </div>
      <AICopilot />
    </div>
  );
}
