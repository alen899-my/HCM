// app/(auth)/login/page.tsx

import type { Metadata } from "next";
import { LoginForm } from "@/features/auth/components/LoginForm";

export const metadata: Metadata = {
  title: "Sign In — Hospital Management System",
  description: "Sign in to HSM using your Employee ID and password.",
};

export default function LoginPage() {
  return <LoginForm />;
}
