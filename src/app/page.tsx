import Image from 'next/image'
import Link from 'next/link'
import { WaitlistForm } from '@/components/waitlist-form'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { BackgroundBeams } from '@/components/ui/background-beams'
import { FadeText } from '@/components/ui/fade-text'
import { AnimatedGradientBadge } from '@/components/animated-gradient-badge'
import { BorderBeam } from '@/components/ui/border-beam'

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-background">
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <p className="text-2xl font-bold">Echo</p>
          <Button variant="secondary" asChild size="sm">
            <Link href="/login" >
              Log in
            </Link>
          </Button>
        </div>
      </header>

      <div className='w-full relative flex flex-col items-center justify-center antialiased pt-36 pb-24'>
        <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
          <AnimatedGradientBadge />
          <h1 className="text-5xl lg:text-7xl font-heading leading-none tracking-tighter font-extrabold bg-gradient-to-r from-gray-700 via-gray-900 to-black  dark:from-sky-200 dark:via-purple-300 dark:to-indigo-300 bg-clip-text text-transparent my-4">Personal Newsletters, Amplified</h1>
          <p className="text-xl text-gray-600 dark:text-white mb-8">
            Connect with your network through simple, powerful broadcasts
          </p>

          <WaitlistForm />
        </div>
        <BackgroundBeams className='z-0' />
      </div>

      <main className="container max-w-5xl mx-auto px-4 py-16 text-center">
        {/* Main feature showcase */}
        <div className="relative animate-fade-up opacity-0 [--animation-delay:400ms] [perspective:2000px] after:absolute after:inset-0 after:z-50 after:[background:linear-gradient(to_top,hsl(var(--background))_30%,transparent)]">
          <div className="rounded-xl border border-white/10 bg-white bg-opacity-[0.01] before:absolute before:bottom-1/2 before:left-0 before:top-0 before:h-full before:w-full before:opacity-0 before:[filter:blur(180px)] before:[background-image:linear-gradient(to_bottom,var(--color-one),var(--color-one),transparent_40%)] before:animate-image-glow">
            <BorderBeam />
            <div className="relative aspect-video">
              <Image
                src="/echo-broadcast.png"
                alt="Echo Dashboard"
                className="rounded-inherit shadow-lg"
                fill
              />
            </div>
          </div>
        </div>

        <section className="mt-24 max-w-2xl mx-auto pb-24">
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">Email and newsletter platforms are designed for mass marketing, but personal relationships are personal. Echo is a personal CRM that connects your contacts, notes, and communications in one place, making networking easier and more effective.</p>
        </section>
        {/* FAQ Section */}
        <section className="mt-24 max-w-xl mx-auto pb-24">
          <h2 className="text-2xl font-semibold mb-8">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full border border-border rounded-md text-left">
            <AccordionItem value="item-1" className="px-4">
              <AccordionTrigger>What is Echo?</AccordionTrigger>
              <AccordionContent>
                Echo is a modern relationship management tool that connects your contacts, notes, and communications in one place, making networking easier and more effective.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" className="px-4">
              <AccordionTrigger>How is Echo different from other CRM tools?</AccordionTrigger>
              <AccordionContent>
                Echo focuses on personal relationship management, offering a seamless integration of contacts, notes, and newsletters. It&apos;s designed for individuals who want to elevate their networking game.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3" className="px-4">
              <AccordionTrigger>When will Echo be available?</AccordionTrigger>
              <AccordionContent>
                We&apos;re currently in development. Join our waitlist to be notified when we launch and to get early access!
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4" className="px-4 border-b-0">
              <AccordionTrigger>Is there a free version of Echo?</AccordionTrigger>
              <AccordionContent>
                We plan to offer a free tier with basic features. Premium features will be available in paid plans. Specific details will be announced closer to launch.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        <section className="mt-24 max-w-xl mx-auto space-y-8 pb-24">
          <h2 className="text-3xl font-semibold">Ready to Let Your Voice Echo?</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Sign up for our waitlist to be the first to know when we launch and to get early access!
          </p>
          <WaitlistForm />
        </section>
      </main>

      <footer className="bg-gray-100 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          <p className="text-gray-600 dark:text-gray-400">© 2024 Echo. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}