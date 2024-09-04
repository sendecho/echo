import Image from 'next/image'
import Link from 'next/link'
import { WaitlistForm } from '@/components/waitlist-form'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-background">
      <header className="bg-white dark:bg-background">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <p className="text-2xl font-bold">Echo</p>
          <Button variant="secondary" asChild size="sm">
            <Link href="/login" >
              Log in
            </Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl lg:text-7xl font-heading tracking-tight font-extrabold bg-gradient-to-r from-gray-700 via-gray-900 to-black  dark:from-sky-200 dark:via-purple-300 dark:to-indigo-300 bg-clip-text text-transparent mb-4">The easiest way to manage relationships</h1>
        <p className="text-xl text-gray-600 dark:text-white mb-8">
          Contacts, notes, and newsletters — finally connected to elevate your networking.
        </p>

        <WaitlistForm />

        {/* Main feature showcase */}
        <div className="mt-16 max-w-xl mx-auto">
          <Image
            src="/crm-dashboard.webp"
            alt="Echo Dashboard"
            className="rounded-lg shadow-lg"
            width={800}
            height={600}
          />
        </div>

        <section className="mt-24 max-w-2xl mx-auto">
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">Email and newsletter platforms are designed for mass marketing, but personal relationships are personal. Echo is a personal CRM that connects your contacts, notes, and communications in one place, making networking easier and more effective.</p>
        </section>
        {/* FAQ Section */}
        <section className="mt-24 max-w-xl mx-auto">
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
      </main>

      <footer className="bg-gray-100 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          <p className="text-gray-600 dark:text-gray-400">© 2024 Echo. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}