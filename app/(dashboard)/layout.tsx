import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import { AICopilot } from "@/components/dashboard/ai-copilot";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-paper">
      <Sidebar />
      <div className="pl-64">
        <Topbar />
        <main className="p-8">{children}</main>
      </div>
      <AICopilot />
    </div>
  );
}
