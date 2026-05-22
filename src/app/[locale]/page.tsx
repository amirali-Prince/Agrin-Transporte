import Navbar from '@/components/ui/Navbar'
import WhatsAppButton from '@/components/ui/WhatsAppButton'
import Hero from '@/components/sections/Hero'
import Services from '@/components/sections/Services'
import TransportGallery from '@/components/sections/TransportGallery'
import HowItWorks from '@/components/sections/HowItWorks'
import Pricing from '@/components/sections/Pricing'
import Testimonials from '@/components/sections/Testimonials'
import Partners from '@/components/sections/Partners'
import About from '@/components/sections/About'
import QuickForm from '@/components/sections/QuickForm'
import Footer from '@/components/ui/Footer'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <TransportGallery />
        <HowItWorks />
        <Pricing />
        <Testimonials />
        <Partners />
        <About />
        <QuickForm />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
