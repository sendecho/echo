import { type NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/payments/stripe';
import type Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';
import { getUserQuery } from '@/lib/supabase/queries/user';
import { updateAccountSubscription } from '@/lib/supabase/mutations/account-settings';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const sessionId = searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.redirect(new URL('/dashboard/settings/billing', request.url));
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['customer', 'subscription'],
    });

    if (!session.customer || typeof session.customer === 'string') {
      throw new Error('Invalid customer data from Stripe.');
    }

    const customerId = session.customer.id;
    const subscriptionId =
      typeof session.subscription === 'string'
        ? session.subscription
        : session.subscription?.id;

    if (!subscriptionId) {
      throw new Error('No subscription found for this session.');
    }

    const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ['items.data.price.product'],
    });

    const plan = subscription.items.data[0]?.price;

    if (!plan) {
      throw new Error('No plan found for this subscription.');
    }

    const productId = (plan.product as Stripe.Product).id;

    if (!productId) {
      throw new Error('No product ID found for this subscription.');
    }

    const userId = session.client_reference_id;
    if (!userId) {
      throw new Error("No user ID found in session's client_reference_id.");
    }

    const supabase = createClient();
    const { data: user } = await getUserQuery(supabase, userId);

    if (!user) {
      throw new Error('No user found in session.');
    }

    if (!user.account_id) {
      throw new Error('No account found for this user.');
    }

    await updateAccountSubscription(supabase, user.account_id, {
      stripe_customer_id: customerId,
      stripe_subscription_id: subscriptionId,
      stripe_product_id: productId,
      plan_name: (plan.product as Stripe.Product).name,
      subscription_status: subscription.status
    });

    return NextResponse.redirect(new URL('/dashboard/settings/billing', request.url));
  } catch (error) {
    console.error('Error handling successful checkout:', error);
    return NextResponse.redirect(new URL('/dashboard/settings/billing', request.url));
  }
}