// TODO : Download Past invoices page // dashboard/invoices page

"use client"
import { motion } from 'framer-motion';
import { Receipt, ArrowRight, Check, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useRouter } from 'next/navigation'

export default function Home() {

  const router = useRouter()

  const plans = [
    {
      name: 'Starter',
      price: '0',
      interval: 'forever',
      features: [
        '5 invoices per month',
        'Basic templates',
        'PDF export',
        'Email support',
      ],
    },
    {
      name: 'Pro',
      price: '12',
      interval: 'per month',
      features: [
        'Unlimited invoices',
        'Premium templates',
        'Multi-format export',
        'Priority support',
        'Custom branding',
        'Payment tracking',
      ],
      popular: true,
    },
    {
      name: 'Business',
      price: '29',
      interval: 'per month',
      features: [
        'Everything in Pro',
        'Team collaboration',
        'API access',
        'Advanced analytics',
        'White-label',
      ],
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      interval: 'contact us',
      features: [
        'Everything in Business',
        'Custom integrations',
        'SLA guarantee',
        'Dedicated support',
        'On-premise option',
      ],
    },
  ];

  return (
    <div className="min-h-full bg-sidebar text-black">
      <nav className="fixed top-0 w-full z-50 bg-sidebar/80 backdrop-blur-xl border-b border-black/10">
        <div className="max-w-7xl mx-auto px-2 h-20 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3"
          >
            <Receipt className="h-7 w-7 text-black" strokeWidth={1.5} />
            <span className="text-xl font-light tracking-wide text-black">Make Invoices</span>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-black/70 hover:text-black hover:bg-black/5 rounded-lg"
              onClick={() => {
                router.push("/signin")
              }} 
            >
              log in
            </Button>
          </motion.div>
        </div>
      </nav>

      <main className="pt-20">
        <section className="relative min-h-[80vh] flex items-center px-6 sm:px-8 lg:px-12">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-black/[0.02] rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-black/[0.03] rounded-full blur-3xl" />
          </div>

          <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-20 items-center relative ">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className='pb-0 lg:pb-30'
            >
              <div className="inline-block px-3 py-1 mb-8 border border-black/10 rounded-full">
                <span className="text-xs font-light tracking-wider text-black/60">MODERN INVOICING</span>
              </div>

              <h1 className="text-7xl lg:text-8xl font-light mb-8 leading-[0.95] tracking-tight text-black">
                Invoice
                <br />
                <span className="italic font-light">with intent</span>
              </h1>

              <p className="text-xl text-black/50 mb-12 max-w-md font-light leading-relaxed">
                A new approach to invoicing. Clean, focused, and brutally simple.
              </p>

              <div className="flex gap-4">
                <Button
                  size="lg"
                  className="bg-black text-white hover:bg-black/90 rounded-lg px-8 h-12 font-light"
                  onClick={() => {
                    router.push('/signup')
                  }}
                >
                  Start now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative hidden lg:block"
            >
              <div className="relative rounded-2xl overflow-hidden py-20">
                <img 
                  src="images/preview.jpg" 
                  alt="Invoice preview" 
                  className="w-full h-auto rounded-xl"
                />
              </div>
            </motion.div>
          </div>
        </section>

        <section className="px-6 sm:px-8 lg:px-12 py-32 border-t border-black/5">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-24"
            >
              <div className="inline-block px-3 py-1 mb-6 border border-black/10 rounded-full">
                <span className="text-xs font-light tracking-wider text-black/60">PRICING</span>
              </div>
              <h2 className="text-5xl lg:text-6xl font-light mb-4 text-black">Choose your plan</h2>
              <p className="text-xl text-black/50 font-light">Simple, transparent pricing.</p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="relative"
                >
                  <Card
                    className={`bg-white border border-black/10 rounded-2xl p-10 h-full flex flex-col shadow-sm ${
                      plan.popular ? 'ring-2 ring-black/20' : ''
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-black text-white text-xs font-light tracking-wider rounded-full">
                        POPULAR
                      </div>
                    )}

                    <div className="mb-12">
                      <h3 className="text-2xl font-light mb-2 text-black">{plan.name}</h3>
                      <div className="flex items-baseline gap-2 mt-6">
                        {plan.price !== 'Custom' ? (
                          <>
                            <span className="text-5xl font-light text-black">${plan.price}</span>
                            <span className="text-black/40 font-light text-sm">{plan.interval}</span>
                          </>
                        ) : (
                          <>
                            <span className="text-4xl font-light text-black">{plan.price}</span>
                            <span className="text-black/40 font-light text-sm">{plan.interval}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <ul className="space-y-4 mb-12 flex-grow">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <Minus className="h-4 w-4 text-black/60 flex-shrink-0 mt-1" strokeWidth={1} />
                          <span className="text-black/70 font-light text-sm leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      className={`w-full rounded-lg h-12 font-light ${
                        plan.popular
                          ? 'bg-black text-white hover:bg-black/90'
                          : 'bg-transparent border border-black/10 hover:bg-black/5 text-black'
                      }`}
                    >
                      {plan.price === 'Custom' ? 'Contact us' : 'Get started'}
                    </Button>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 sm:px-8 lg:px-12 py-32 border-t border-black/5">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid lg:grid-cols-2 gap-20 items-center"
            >
              <div>
                <h2 className="text-5xl font-light mb-6 leading-tight text-black">
                  Ready to start?
                </h2>
                <p className="text-xl text-black/50 font-light mb-10 leading-relaxed max-w-md">
                  No credit card required. No hidden fees. Just clean, simple invoicing.
                </p>

                <ul className="space-y-4 mb-10">
                  {['Free to start', 'Cancel anytime', 'No setup required'].map((item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <Check className="h-5 w-5 text-black/60" strokeWidth={1.5} />
                      <span className="font-light text-black">{item}</span>
                    </motion.li>
                  ))}
                </ul>

                <Button 
                  size="lg" 
                  className="bg-black text-white hover:bg-black/90 rounded-lg px-8 h-12 font-light"
                  onClick={() => {
                    router.push('/signup')
                  }}
                >
                  Create your first invoice
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              <div className="relative hidden lg:block">
                <div className="border border-black/10 p-16 bg-white rounded-2xl shadow-sm">
                  <div className="space-y-6">
                    <div className="h-12 w-3/4 bg-black/5 rounded-lg" />
                    <div className="h-3 w-1/2 bg-black/5 rounded-lg" />
                    <div className="h-px bg-black/5 my-8" />
                    <div className="space-y-4">
                      <div className="h-8 w-full bg-black/5 rounded-lg" />
                      <div className="h-8 w-full bg-black/5 rounded-lg" />
                      <div className="h-8 w-5/6 bg-black/5 rounded-lg" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="border-t border-black/5 px-6 sm:px-8 lg:px-12 py-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <Receipt className="h-6 w-6 text-black" strokeWidth={1.5} />
            <span className="text-lg font-light tracking-wide text-black">invoicely</span>
          </div>
          <p className="text-sm text-black/40 font-light">© 2025 Invoicely. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}