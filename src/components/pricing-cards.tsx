"use client";

import { PLANS } from "@/lib/pricing";
import { useState } from "react";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { CheckIcon } from "lucide-react";

import { checkoutAction } from "@/lib/payments/actions";
import { SubmitButton } from "@/components/ui/submit-button";

export default function PricingCard({
	user,
	accountId,
	planName,
}: {
	user?: any;
	accountId?: string;
	planName?: string;
}) {
	const [isYearly, setIsYearly] = useState(false);
	const toggleYearly = () => setIsYearly(!isYearly);

	return (
		<div className="container">
			<div className="container flex flex-col items-center justify-center gap-2 my-8">
				<h2 className="text-2xl font-semibold">Choose a plan</h2>
				<p className="text-sm text-gray-600 dark:text-gray-400">
					Choose a plan that fits your needs
				</p>
			</div>
			<div className="container flex justify-center items-center gap-4 my-8">
				<span className="text-sm font-medium">Pay Monthly</span>
				<Switch checked={isYearly} onCheckedChange={toggleYearly} />
				<span className="text-sm font-medium">Pay Yearly</span>
			</div>
			<div className="container mx-auto max-w-screen grid md:grid-cols-3 gap-4">
				{PLANS.map((plan) => (
					<div
						className="relative flex flex-col overflow-hidden rounded-xl border shadow-md p-6"
						key={plan.name}
					>
						<div className="min-h-[100px] items-start space-y-4">
							<h3>{plan.name}</h3>

							<div className="flex flex-row">
								<p className="text-3xl font-medium text-gray-900">
									{isYearly && plan.price.monthly > 0 ? (
										<span className="tabular-nums">
											${plan.price.yearly / 12}
										</span>
									) : (
										<span className="tabular-nums">${plan.price.monthly}</span>
									)}
									<span className="text-sm font-medium">
										{" "}
										per month
										{isYearly && plan.price.monthly > 0
											? ", billed annually"
											: ""}
									</span>
								</p>
							</div>
						</div>

						<div className="flex flex-col gap-8">
							<ul className="space-y-2 text-left text-sm font-medium leading-normal">
								{plan.features.map((feature) => (
									<li
										key={feature.text}
										className="flex items-center text-muted-foreground"
									>
										<CheckIcon className="size-5 mr-3 shrink-0 text-green-500" />
										<span>{feature.text}</span>
									</li>
								))}
							</ul>

							{user && planName ? (
								<div>
									<p>You are on the {planName} plan</p>
								</div>
							) : user && plan.name !== "Free" ? (
								<>
									<form action={checkoutAction}>
										<input
											type="hidden"
											name="priceId"
											value={plan?.price?.ids[isYearly ? "yearly" : "monthly"]}
										/>
										<SubmitButton isSubmitting={false}>Subscribe</SubmitButton>
									</form>
								</>
							) : user && plan.name === "Free" ? null : (
								<Button>Sign up</Button>
							)}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
