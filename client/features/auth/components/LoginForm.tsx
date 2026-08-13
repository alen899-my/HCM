"use client";

// features/auth/components/LoginForm.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Login form with:
//   • react-hook-form for form state management
//   • Zod schema validation (inline field errors on blur/submit)
//   • Solid white shadcn Card (login-03 style)
//   • Wired to useLogin() auth feature hook
// ─────────────────────────────────────────────────────────────────────────────

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormValues } from "@/lib/validations/auth.schema";
import { useLogin } from "../hooks";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { login, loading, error: serverError } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched", // validate on blur, then on every change after first error
  });

  const onSubmit = async (values: LoginFormValues) => {
    await login({ emp_id: values.emp_id, password: values.password });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="bg-white shadow-2xl border-0">
        {/* ── Header ──────────────────────────────────────────────────── */}
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="w-6 h-6 text-primary"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                />
              </svg>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription>
            Sign in with your Employee ID to access HSM
          </CardDescription>
        </CardHeader>

        {/* ── Content ─────────────────────────────────────────────────── */}
        <CardContent>
          {/* Server-side error (wrong credentials, account disabled, etc.) */}
          {serverError && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4 shrink-0"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
                  clipRule="evenodd"
                />
              </svg>
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <FieldGroup>
              {/* ── Employee ID ───────────────────────────────────────── */}
              <Field>
                <FieldLabel htmlFor="emp_id">Employee ID</FieldLabel>
                <Input
                  id="emp_id"
                  type="text"
                  placeholder="e.g. superadmin"
                  autoComplete="username"
                  disabled={loading}
                  aria-invalid={!!errors.emp_id}
                  {...register("emp_id")}
                  className={cn(
                    errors.emp_id && "border-red-400 focus-visible:ring-red-300",
                  )}
                />
                {/* Inline Zod error */}
                {errors.emp_id && (
                  <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className="w-3 h-3 shrink-0"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm0-9.5a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3A.75.75 0 0 1 8 5.5Zm0 6.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.emp_id.message}
                  </p>
                )}
              </Field>

              {/* ── Password ──────────────────────────────────────────── */}
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  disabled={loading}
                  aria-invalid={!!errors.password}
                  {...register("password")}
                  className={cn(
                    errors.password &&
                      "border-red-400 focus-visible:ring-red-300",
                  )}
                />
                {/* Inline Zod error */}
                {errors.password && (
                  <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className="w-3 h-3 shrink-0"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm0-9.5a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3A.75.75 0 0 1 8 5.5Zm0 6.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.password.message}
                  </p>
                )}
              </Field>

              {/* ── Submit ────────────────────────────────────────────── */}
              <Field>
                <Button
                  type="submit"
                  className="w-full font-semibold"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="animate-spin h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8z"
                        />
                      </svg>
                      Signing in…
                    </span>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      <p className="text-center text-xs text-white/70">
        Contact your system administrator if you cannot access your account.
      </p>
    </div>
  );
}
