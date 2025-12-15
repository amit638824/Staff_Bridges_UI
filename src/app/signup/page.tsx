"use client"; 
import dynamic from "next/dynamic"; 
const SignUpPage = dynamic(() => import("@/ui/common/login/RecruiterRegistraion"), {
  ssr: false,
}); 
export default function LoginPage() {
  return <SignUpPage />;
}
