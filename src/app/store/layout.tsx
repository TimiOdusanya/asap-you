import Footer from "@/components/landing-page/footer";
import StoreNavbar from "@/components/store/sections/store-navbar";
import { CustomerRouteGuard } from "@/components/auth/customer-route-guard";
import { RealtimeSync } from "@/components/shared/realtime-sync";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CustomerRouteGuard>
      <RealtimeSync />
      <section>
        <StoreNavbar />
        {children}
        <Footer />
      </section>
    </CustomerRouteGuard>
  );
}