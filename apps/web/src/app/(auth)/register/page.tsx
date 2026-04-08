"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react";

import { ModeToggle } from "@/components/mode-toggle";
import { GalleryVerticalEnd } from "lucide-react";
import Link from "next/link";

const formSchema = z
  .object({
    email: z.email(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .regex(/[A-Z]/, "Password must include at least one uppercase letter")
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must include at least one special character",
      ),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .regex(/[A-Z]/, "Password must include at least one uppercase letter")
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must include at least one special character",
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must be the same",
    path: ["confirmPassword"],
  });
export function RegisterWithGithubForm() {
  return (
    <form
      action={() => {
        console.log("hello github");
      }}
      className="w-full"
    >
      <Button variant="outline" type="submit" className="w-full">
        <IconBrandGithub />
        Register with GitHub
      </Button>
    </form>
  );
}

export function RegisterWithGoogleForm() {
  return (
    <form
      action={() => {
        console.log("hello google");
      }}
      className="w-full"
    >
      <Button variant="outline" type="submit" className="w-full">
        <IconBrandGoogle />
        Register with Google
      </Button>
    </form>
  );
}

export function RegisterForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    toast("You submitted the following values:", {
      description: (
        <pre className="mt-2 w-[320px] overflow-x-auto rounded-md bg-code p-4 text-code">
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
      position: "bottom-right",
      classNames: {
        content: "flex flex-col gap-2",
      },
      style: {
        "--border-radius": "calc(var(--radius)  + 4px)",
      } as React.CSSProperties,
    });
  }

  return (
    <form
      id="register"
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
    >
      <FieldGroup className="flex flex-col gap-2">
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                {...field}
                id="email"
                type="email"
                aria-invalid={fieldState.invalid}
                placeholder="hello@world.com"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                {...field}
                id="password"
                type="password"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="confirmPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="confirmPassword">
                Confirm Password
              </FieldLabel>
              <Input
                {...field}
                id="confirmPassword"
                type="password"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
      <Field orientation="horizontal">
        <Button className="w-full" type="submit" form="register">
          Register
        </Button>
      </Field>
    </form>
  );
}

export default function Page() {
  return (
    <main className="flex flex-col items-center justify-center h-screen gap-4 bg-secondary">
      <ModeToggle />
      <a
        href="#"
        className="flex items-center gap-4 self-center font-medium text-2xl"
      >
        <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
          <GalleryVerticalEnd className="size-4" />
        </div>
        Acme Inc.
      </a>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardAction>
            <Link
              href={"/login"}
              className="underline text-muted-foreground hover:text-primary"
            >
              Log In
            </Link>
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col justify-center items-center text-center">
            <div className="w-full flex-col gap-8">
              <RegisterForm />
              <div className="w-full flex flex-col justify-center items-center text-center p-4">
                <span className="text-muted-foreground">Or continue with</span>
              </div>
              <div className="w-full flex flex-col gap-4">
                <RegisterWithGithubForm />
                <RegisterWithGoogleForm />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              By continuing, you agree to our{" "}
              <Link
                href={"/terms-of-service"}
                className="underline text-muted-foreground hover:text-primary"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href={"/privacy-policy"}
                className="underline text-muted-foreground hover:text-primary"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
