
// TODO : Download Past invoices page // dashboard/invoices page
// TODO : Email verification for credentials login and reset password use Resend
// TODO : landing page
// TODO : toast instaed of alerts

import CTA from '@/components/CTA';
import Feature from '@/components/Feature';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Stats from '@/components/Stats';
import Testimonials from '@/components/Testimonials';

export default function Home() {
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <div className="fixed inset-0 opacity-[0.02] pointer-events-none bg-gradient-radial from-gray-900/10 via-transparent to-transparent" />
        <Header />
        <Hero />
        <Feature />
        <Stats />
        <Testimonials />
        <CTA />
        <Footer />
    </div>
  );
}