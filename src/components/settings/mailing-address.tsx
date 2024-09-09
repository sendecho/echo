"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { SettingsCard } from "./settings-card";
import { useForm } from "react-hook-form";
import { SubmitButton } from "../ui/submit-button";
import { useAction } from "next-safe-action/hooks";
import { updateAccountSettingsAction } from "@/actions/update-account-settings-action";
import { updateAccountSettingsSchema, type UpdateAccountSettings } from "@/lib/schemas/account-settings-schema";

interface MailingAddressSettingsProps {
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export function MailingAddressSettings({
  streetAddress,
  city,
  state,
  postalCode,
  country,
}: MailingAddressSettingsProps) {
  const action = useAction(updateAccountSettingsAction)

  const form = useForm<UpdateAccountSettings>({
    resolver: zodResolver(updateAccountSettingsSchema),
    defaultValues: {
      street_address: streetAddress,
      city,
      state,
      postal_code: postalCode,
      country,
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    action.execute(data)
  })

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <SettingsCard
          name="Mailing Address"
          description="Provide your mailing address for compliance with anti-spam laws"
        >
          <div className="space-y-4">
            <FormField control={form.control} name="street_address" render={({ field }) => (
              <FormItem>
                <FormLabel>Street Address</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="123 Main St" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="city" render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="New York" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="state" render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="NY" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="postal_code" render={({ field }) => (
              <FormItem>
                <FormLabel>Postal Code</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="10001" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="country" render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="United States" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <SubmitButton type="submit" isSubmitting={action.status === 'executing'}>Save</SubmitButton>
          </div>
        </SettingsCard>
      </form>
    </Form>
  )
}