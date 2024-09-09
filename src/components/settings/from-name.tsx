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

export function FromNameSettings({ fromName }: { fromName: string }) {
  const action = useAction(updateAccountSettingsAction)

  const form = useForm<UpdateAccountSettings>({
    resolver: zodResolver(updateAccountSettingsSchema),
    defaultValues: {
      from_name: fromName,
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    action.execute(data)
  })

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <SettingsCard
          name="From Name"
          description="Set the name that will appear in the &quot;From&quot; field of your emails"
        >
          <div className="space-y-4">
            <FormField control={form.control} name="from_name" render={({ field }) => (
              <FormItem>
                <FormLabel>From Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Your Name or Company" />
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