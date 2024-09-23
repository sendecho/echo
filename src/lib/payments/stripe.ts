import Stripe from 'stripe';
import { redirect } from 'next/navigation';
import type { Tables } from '@/types';
import { env } from '@/env';
import {
  getUser,
} from '@/lib/supabase/queries/user.cached';
import { updateAccountSubscription, updateAccountSubscriptionDetails } from '../supabase/mutations/account-settings';
import { createClient } from '../supabase/server';
import { getAccountByStripeCustomerId } from '../supabase/queries/account-settings';

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
});

type Account = Tables<'accounts'>;

export async function createCheckoutSession({
  account,
  priceId,
}: {
  account: Account | null;
  priceId: string;
}) {
  const user = await getUser();

  if (!user || !user.data?.account) {
    redirect(`/sign-up?redirect=checkout&priceId=${priceId}`);
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${env.BASE_URL}/api/stripe/checkout?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${env.BASE_URL}/dashboard/settings/billing`,
    customer: user.data.account.stripe_customer_id || undefined,
    client_reference_id: user.data.id.toString(),
    allow_promotion_codes: true,
    // subscription_data: {
    //   trial_period_days: 14,
    // },
  });

  redirect(session.url as string);
}

export async function createCustomerPortalSession(account: Account) {
  if (!account.stripe_customer_id || !account.stripe_product_id) {
    console.log('No stripe customer id or product id')
    redirect('/dashboard/settings/billing');
  }

  let configuration: Stripe.BillingPortal.Configuration;
  const configurations = await stripe.billingPortal.configurations.list();

  if (configurations.data.length > 0) {
    configuration = configurations.data[0];
  } else {
    const product = await stripe.products.retrieve(account.stripe_product_id as string);
    if (!product.active) {
      throw new Error("Team's product is not active in Stripe");
    }

    const prices = await stripe.prices.list({
      product: product.id,
      active: true,
    });
    if (prices.data.length === 0) {
      throw new Error("No active prices found for the team's product");
    }

    configuration = await stripe.billingPortal.configurations.create({
      business_profile: {
        headline: 'Manage your subscription',
      },
      features: {
        subscription_update: {
          enabled: true,
          default_allowed_updates: ['price', 'quantity', 'promotion_code'],
          proration_behavior: 'create_prorations',
          products: [
            {
              product: product.id,
              prices: prices.data.map((price) => price.id),
            },
          ],
        },
        subscription_cancel: {
          enabled: true,
          mode: 'at_period_end',
          cancellation_reason: {
            enabled: true,
            options: [
              'too_expensive',
              'missing_features',
              'switched_service',
              'unused',
              'other',
            ],
          },
        },
      },
    });
  }

  return stripe.billingPortal.sessions.create({
    customer: account.stripe_customer_id as string,
    return_url: `${process.env.BASE_URL}/dashboard`,
    configuration: configuration.id,
  });
}

export async function handleSubscriptionChange(
  subscription: Stripe.Subscription
) {
  const supabase = createClient();
  const customerId = subscription.customer as string;
  const subscriptionId = subscription.id;
  const status = subscription.status;

  const account = await getAccountByStripeCustomerId(supabase, customerId);

  if (!account) {
    console.error('Team not found for Stripe customer:', customerId);
    return;
  }

  if (status === 'active' || status === 'trialing') {
    const plan = subscription.items.data[0]?.plan;
    await updateAccountSubscriptionDetails(account.id, {
      stripe_subscription_id: subscriptionId,
      stripe_product_id: plan?.product as string,
      plan_name: (plan?.product as Stripe.Product).name,
      subscription_status: status,
    });
  } else if (status === 'canceled' || status === 'unpaid') {
    await updateAccountSubscriptionDetails(account.id, {
      stripe_subscription_id: null,
      stripe_product_id: null,
      plan_name: null,
      subscription_status: status,
    });
  }
}

export async function getStripePrices() {
  const prices = await stripe.prices.list({
    expand: ['data.product'],
    active: true,
    type: 'recurring',
  });

  return prices.data.map((price) => ({
    id: price.id,
    productId:
      typeof price.product === 'string' ? price.product : price.product.id,
    unitAmount: price.unit_amount,
    currency: price.currency,
    interval: price.recurring?.interval,
    trialPeriodDays: price.recurring?.trial_period_days,
  }));
}

export async function getStripeProducts() {
  const products = await stripe.products.list({
    active: true,
    expand: ['data.default_price'],
  });

  return products.data.map((product) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    defaultPriceId:
      typeof product.default_price === 'string'
        ? product.default_price
        : product.default_price?.id,
  }));
}