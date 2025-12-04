"use client";

import dynamic from "next/dynamic";

const SignInPage = dynamic(() => import("@/ui/common/login/SignIn"), {
  ssr: false,
});

export default function LoginPage() {
  return <SignInPage />;
}
