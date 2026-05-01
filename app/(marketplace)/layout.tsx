import { LandingNav } from "@/components/landing/nav";
import { LandingFooter } from "@/components/landing/footer";
import { PublicFunnelTracker } from "@/components/analytics/public-funnel-tracker";
import { DevEventViewer } from "@/components/analytics/dev-event-viewer";

export default function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="landing-theme grain-overlay flex min-h-screen flex-col bg-night text-chalk">
      <PublicFunnelTracker />
      <DevEventViewer />
      <LandingNav />
      <main className="flex-1">{children}</main>
      <LandingFooter />
    </div>
  );
}
