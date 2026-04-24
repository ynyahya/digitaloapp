import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";

export default function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <Navbar variant="marketplace" />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
