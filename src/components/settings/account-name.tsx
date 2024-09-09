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

export function AccountNameSettings({ name }: { name: string }) {
  const action = useAction(updateAccountSettingsAction)

  const form = useForm<UpdateAccountSettings>({
    resolver: zodResolver(updateAccountSettingsSchema),
    defaultValues: {
      name,
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    action.execute(data)
  })

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <SettingsCard
          name="Account Name"
          description="Set the name for your account"
        >
          <div className="space-y-4">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>Account Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Your Account Name" />
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