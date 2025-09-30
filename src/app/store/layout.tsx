import Footer from "@/components/landing-page/footer"
import StoreNavbar from "@/components/store/sections/store-navbar"


export default function StoreLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return <section>
        <StoreNavbar />
        {children}
        <Footer />
    </section>
  }