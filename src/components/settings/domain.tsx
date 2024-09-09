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

export function DomainSettings({ domain }: { domain: string }) {

  const action = useAction(updateAccountSettingsAction)

  const form = useForm<UpdateAccountSettings>({
    resolver: zodResolver(updateAccountSettingsSchema),
    defaultValues: {
      domain,
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    action.execute(data)
  })

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <SettingsCard
          name="Domain"
          description="Set up your custom domain for sending emails"
        >
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <FormField control={form.control} name="domain" render={({ field }) => (
                <FormItem>
                  <FormLabel>Domain</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="yourdomain.com" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <SubmitButton type="submit" isSubmitting={action.status === 'executing'}>Save</SubmitButton>
          </div>
        </SettingsCard>
      </form>
    </Form>
  )
}