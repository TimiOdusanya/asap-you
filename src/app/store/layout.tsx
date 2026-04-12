import Footer from "@/components/landing-page/footer";
import StoreNavbar from "@/components/store/sections/store-navbar";
import { CustomerRouteGuard } from "@/components/auth/customer-route-guard";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CustomerRouteGuard>
      <section>
        <StoreNavbar />
        {children}
        <Footer />
      </section>
    </CustomerRouteGuard>
  );
}