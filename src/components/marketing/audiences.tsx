"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { headingFont } from "@/app/fonts";
import {
	Accordion,
	AccordionItem,
	AccordionTrigger,
	AccordionContent,
} from "@/components/ui/accordion";
import * as AccordionPrimitive from "@radix-ui/react-accordion";

import { AspectRatio } from "@/components/ui/aspect-ratio";

const audiences = [
	{
		title: "Creators",
		description:
			"Amplify your voice and nurture your audience with personalised, effortless outreach.",
		image: "/images/1.jpg",
	},
	{
		title: "Developers",
		description:
			"Integrate powerful networking tools seamlessly into your apps and workflows.",
		image: "/images/2.jpg",
	},
	{
		title: "Business",
		description:
			"Streamline relationship management and boost the value of your professional network.",
		image: "/images/3.jpg",
	},
];

const Audiences = () => {
	const controls = useAnimation();
	const [ref, inView] = useInView();
	const [currentAudience, setCurrentAudience] = useState(0);
	const componentRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (inView) {
			controls.start("visible");
		}
	}, [controls, inView]);

	useEffect(() => {
		const handleScroll = () => {
			if (componentRef.current && inView) {
				const scrollPosition = window.scrollY - componentRef.current.offsetTop;
				const newAudience = Math.floor(scrollPosition / 200) % audiences.length;
				setCurrentAudience(newAudience);
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [inView]);

	const handleAudienceClick = (index: number) => {
		setCurrentAudience(index);
	};

	const handleAccordionChange = (value: string) => {
		const index = audiences.findIndex((audience) => audience.title === value);
		if (index !== -1) {
			setCurrentAudience(index);
		}
	};

	return (
		<div className="w-full h-full bg-gradient-to-b from-[#08090a] to-[#464748] flex-col justify-start items-center gap-[85px] py-48 inline-flex">
			<div className="container max-w-4xl mx-auto">
				<h2
					className={cn(
						"text-6xl font-serif mb-8 text-white",
						headingFont.className,
					)}
				>
					Echo makes it simple, personal, and powerful to connect and be heard.
				</h2>
			</div>
			<div className="container mx-auto">
				<div
					ref={componentRef}
					className="p-4 py-8 lg:p-8 bg-white rounded-lg text-left grid grid-cols-1 lg:grid-cols-[4fr_5fr] gap-8"
				>
					<div className="h-full flex flex-col justify-between">
						<motion.h2
							className={cn(
								"text-4xl font-serif font-bold mb-6",
								headingFont.className,
							)}
						>
							Tailored Email Solutions for Every Professional
						</motion.h2>

						{/* Mobile Accordion */}
						<div className="lg:hidden">
							<Accordion
								type="single"
								collapsible
								onValueChange={handleAccordionChange}
							>
								{audiences.map((audience) => (
									<AccordionItem
										key={audience.title}
										value={audience.title}
										className="border-t border-b-0 first:border-t-0"
									>
										<AccordionPrimitive.Header asChild>
											<AccordionPrimitive.Trigger asChild>
												<div className="flex flex-col py-4 cursor-pointer text-gray-600 hover:text-foreground transition-all data-[state=open]:text-foreground">
													<span className="text-lg font-semibold">
														{audience.title}
													</span>
													<span className="text-sm">
														{audience.description}
													</span>
												</div>
											</AccordionPrimitive.Trigger>
										</AccordionPrimitive.Header>
										<AccordionContent>
											<div className="mt-4">
												<AspectRatio ratio={4 / 6}>
													<Image
														src={audience.image}
														alt={`${audience.title} using email solutions`}
														fill
														className="rounded-lg object-cover"
													/>
												</AspectRatio>
											</div>
										</AccordionContent>
									</AccordionItem>
								))}
							</Accordion>
						</div>

						{/* Desktop Content */}
						<div className="hidden lg:block">
							{audiences.map((audience, index) => (
								<div
									key={audience.title}
									className={cn(
										"mb-4 pb-4 border-b last:border-b-0 cursor-pointer text-gray-600 hover:text-foreground transition-all",
										currentAudience === index
											? "text-foreground"
											: "text-gray-400",
									)}
									onClick={() => handleAudienceClick(index)}
								>
									<h3 className="text-xl font-semibold mb-2">
										{audience.title}
									</h3>
									<p className="text-sm ">{audience.description}</p>
								</div>
							))}
						</div>
					</div>
					{/* Desktop Image */}
					<div className="lg:mt-0 hidden lg:block relative">
						<AspectRatio ratio={4 / 5}>
							{audiences.map((audience, index) => (
								<motion.div
									key={audience.title}
									initial={{ opacity: 0 }}
									animate={{ opacity: currentAudience === index ? 1 : 0 }}
									transition={{ duration: 0.5 }}
									className="w-full h-full absolute top-0 left-0"
									style={{ zIndex: currentAudience === index ? 1 : 0 }}
								>
									<Image
										src={audience.image}
										alt={`${audience.title} using email solutions`}
										fill
										className="rounded-lg object-cover"
										placeholder="blur"
										blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg=="
									/>
								</motion.div>
							))}
						</AspectRatio>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Audiences;
