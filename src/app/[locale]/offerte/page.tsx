import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import QuoteForm from '@/components/sections/QuoteForm'

export default function OffertePage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black pt-24 pb-16">
        <QuoteForm />
      </main>
      <Footer />
    </>
  )
}
