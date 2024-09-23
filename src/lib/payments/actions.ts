'use server';

import { redirect } from 'next/navigation';
import { createCheckoutSession, createCustomerPortalSession } from './stripe';


// TODO: Move to Auth safe actions
export const checkoutAction = (async (formData, account) => {
  const priceId = formData.get('priceId') as string;
  await createCheckoutSession({ account: account, priceId });
});

export const customerPortalAction = (async (formData, account) => {
  console.log(account)
  const portalSession = await createCustomerPortalSession(account);
  redirect(portalSession.url);
});