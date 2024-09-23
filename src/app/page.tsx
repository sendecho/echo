import Image from "next/image";
import Link from "next/link";
import { WaitlistForm } from "@/components/waitlist-form";
import { Button } from "@/components/ui/button";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { FadeText } from "@/components/ui/fade-text";
import { AnimatedGradientBadge } from "@/components/animated-gradient-badge";
import { BorderBeam } from "@/components/ui/border-beam";
import { FloatingNav } from "@/components/marketing/floating-nav";
import { headingFont } from "./fonts";
import { cn } from "@/lib/utils";
import EchoRipple from "@/components/marketing/echo-ripple";
import Audiences from "@/components/marketing/audiences";
import { createClient } from "@/lib/supabase/server";
import { getProducts, getSubscription } from "@/lib/supabase/queries/stripe";
import PricingCards from "@/components/pricing-cards";

export default async function Home() {
	const supabase = createClient();

	const [products, subscription] = await Promise.all([
		getProducts(supabase),
		getSubscription(supabase),
	]);

	return (
		<div className="min-h-screen bg-gray-100 dark:bg-background">
			<FloatingNav navItems={[]} />

			<div className="container mx-auto relative flex flex-col justify-center antialiased pt-36 pb-24">
				<div className="grid md:grid-cols-2">
					<div className="relative z-10 flex flex-col justify-center">
						<AnimatedGradientBadge />
						<h1
							className={cn(
								"text-5xl lg:text-7xl font-heading leading-none bg-gradient-to-r from-gray-700 via-gray-900 to-black  dark:from-sky-200 dark:via-purple-300 dark:to-indigo-300 bg-clip-text text-transparent my-4",
								headingFont.className,
							)}
						>
							Introducing Echo:
							<br />
							<span className="italic">Personal Newsletters</span>
							<br />
							Amplified
						</h1>
						<p className="text-xl text-gray-600 dark:text-white mb-8">
							Connect with your network through simple, powerful broadcasts
						</p>

						<WaitlistForm />
					</div>
					<div className="hidden md:block relative">
						<EchoRipple />
					</div>
				</div>
				{/* <BackgroundBeams className='z-0' /> */}
			</div>

			<main>
				{/* Main feature showcase */}
				{/* <div className="container mx-auto">
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
        </div> */}

				<section className="container mt-24 max-w-3xl mx-auto pb-24 space-y-8 text-center">
					<h2 className={cn("text-4xl font-heading", headingFont.className)}>
						At Echo, we believe in the power of genuine connections
					</h2>
					<p className="text-xl text-gray-900 dark:text-gray-400 mb-8 leading-relaxed">
						In a world of endless notifications and fleeting interactions, we're
						on a mission to make networking personal again. Echo isn't just
						another tool it's your partner in building meaningful relationships.
						We've stripped away the complexity of traditional CRMs and the
						impersonal nature of mass email platforms. With Echo, you can
						effortlessly nurture your network, share your voice, and grow your
						influence—all from one simple, intuitive interface. Whether you're a
						solo entrepreneur, a creative professional, or a seasoned networker,
						Echo adapts to your unique style. We're not about vanity metrics or
						endless contact lists. We're about quality connections, authentic
						communication, and amplifying your unique voice. Join us in
						reimagining how we connect in the digital age. Let's make every
						interaction count.
						<br />
						<br />
						Welcome to Echo. Your network, amplified.
					</p>
				</section>

				<Audiences />

				{/* <section className="container mt-24  mx-auto pb-24 space-y-8">
          <div className="mb-12">
            <h2 className={cn("text-4xl font-heading", headingFont.className)}>Key Features</h2>
            <p>Send with ease, leave the complexities behind</p>
          </div>

          <div className="grid cols-1 md:grid-cols-5 gap-4 md:auto-rows-[25rem] max-w-7xl mx-auto">
            <div className="group isolate rounded-2xl bg-white dark:bg-neutral-900 shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col justify-between md:col-span-2">

              <h3>Title</h3>
              <p>Description</p>
            </div>
          </div>
        </section> */}

				{/* FAQ Section */}
				<section className="container mt-24 max-w-xl mx-auto pb-24">
					<h2
						className={cn("text-2xl mb-8 text-center", headingFont.className)}
					>
						Frequently Asked Questions
					</h2>
					<Accordion
						type="single"
						collapsible
						className="w-full border border-border rounded-md text-left"
					>
						<AccordionItem value="item-1" className="px-4">
							<AccordionTrigger>What is Echo?</AccordionTrigger>
							<AccordionContent>
								Echo is a modern relationship management tool that connects your
								contacts, notes, and communications in one place, making
								networking easier and more effective.
							</AccordionContent>
						</AccordionItem>
						<AccordionItem value="item-2" className="px-4">
							<AccordionTrigger>
								How is Echo different from other CRM tools?
							</AccordionTrigger>
							<AccordionContent>
								Echo focuses on personal relationship management, offering a
								seamless integration of contacts, notes, and newsletters.
								It&apos;s designed for individuals who want to elevate their
								networking game.
							</AccordionContent>
						</AccordionItem>
						<AccordionItem value="item-3" className="px-4">
							<AccordionTrigger>When will Echo be available?</AccordionTrigger>
							<AccordionContent>
								We&apos;re currently in development. Join our waitlist to be
								notified when we launch and to get early access!
							</AccordionContent>
						</AccordionItem>
						<AccordionItem value="item-4" className="px-4 border-b-0">
							<AccordionTrigger>
								Is there a free version of Echo?
							</AccordionTrigger>
							<AccordionContent>
								We plan to offer a free tier with basic features. Premium
								features will be available in paid plans. Specific details will
								be announced closer to launch.
							</AccordionContent>
						</AccordionItem>
					</Accordion>
				</section>

				{/* <PricingCards /> */}

				<section className="mt-24 container max-w-xl flex flex-col items-center mx-auto space-y-8 pb-24 text-center">
					<h2 className="text-3xl font-semibold">
						Ready to Let Your Voice Echo?
					</h2>
					<p className="text-xl text-gray-600 dark:text-gray-400">
						Sign up for our waitlist to be the first to know when we launch and
						to get early access!
					</p>
					<WaitlistForm />
				</section>
			</main>

			<footer className="bg-gray-100 dark:bg-gray-900 py-8">
				<div className="container mx-auto px-4">
					<div className="flex flex-row justify-between w-full items-center">
						<p className="text-gray-600 dark:text-gray-400">
							© 2024 Echo. All rights reserved.
						</p>
					</div>
				</div>
			</footer>
		</div>
	);
}
