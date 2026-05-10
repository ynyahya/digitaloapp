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
    <div className="landing-theme grain-overlay min-h-screen bg-paper text-ink">
      <div className="pointer-events-none fixed inset-0 bg-accent-glow opacity-50" />
      <div className="pointer-events-none fixed inset-0 grid-dark opacity-20 mask-radial-fade" />
      <Sidebar
        userName={user?.name ?? null}
        userEmail={user?.email ?? null}
        userImage={user?.image ?? null}
        planName="Creator"
      />
      <div className="relative z-10 pl-64">
        <Topbar />
        <main className="p-8">{children}</main>
      </div>
      <AICopilot />
    </div>
  );
}
