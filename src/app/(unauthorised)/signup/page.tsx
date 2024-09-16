"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

const signUpSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
      message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    }),
});

type SignUpValues = z.infer<typeof signUpSchema>;

function getPasswordStrength(password: string): number {
  let strength = 0;
  if (password.length >= 8) strength += 25;
  if (/[A-Z]/.test(password)) strength += 25;
  if (/[a-z]/.test(password)) strength += 25;
  if (/[0-9]/.test(password)) strength += 12.5;
  if (/[^A-Za-z0-9]/.test(password)) strength += 12.5;
  return Math.min(strength, 100);
}

export default function SignUp() {
  const [error, setError] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const router = useRouter();
  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: SignUpValues) {
    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
    });

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/onboarding");
  }

  function onPasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    const password = e.target.value;
    form.setValue("password", password);
    setPasswordStrength(getPasswordStrength(password));
  }

  return (
    <div className="h-screen bg-background flex flex-col">
      <header className="p-4 flex justify-between items-center">
        <Button
          variant="ghost"
          onClick={() => router.push('/')}
          className="flex items-center group"
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back
        </Button>
        <Button variant="ghost" onClick={() => router.push('/login')}>
          Log in
        </Button>
      </header>
      <div className="flex-grow flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center space-y-2 items-center">
            <div className="flex items-center justify-center">
              <Image src="/echo.svg" alt="Logo" width={24} height={24} />
            </div>
            <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
            <CardDescription>Enter your email to sign up for an account</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only">Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only">Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter your password"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            onPasswordChange(e);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                      <Progress value={passwordStrength} className="h-1 mt-2" />
                      <p className="text-xs mt-1">
                        Password strength: {passwordStrength < 50 ? "Weak" : passwordStrength < 75 ? "Medium" : "Strong"}
                      </p>
                    </FormItem>
                  )}
                />
                {error && <p className="text-sm text-red-500">{error}</p>}
                <Button type="submit" className="w-full">
                  Sign Up
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="justify-center text-sm text-muted-foreground text-center">
            <p>By signing up, you agree to our <Link href="/terms" className="underline hover:text-primary transition-colors">Terms of Service</Link> and <Link href="/privacy" className="underline hover:text-primary transition-colors">Privacy Policy</Link></p>
            {/* <Link
              className="text-sm font-medium text-blue-600 hover:underline"
              href="/login"
            >
              Already have an account? Log in
            </Link> */}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}