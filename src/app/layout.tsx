// "use client"
import type { Metadata } from "next";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.css";
import "@/styles/main.css";
import "@/styles/responsive.css";
import GoogleProviderWrapper from "@/ui/common/login/GoogleProviderWrapper";
import StoreProvider from "@/redux/StoreProvider";
import { Inter } from "next/font/google";
import BootstrapClient from "@/ui/common/login/BootstrapClient";
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});
export const metadata: Metadata = {
  title: "Staff_Bridges",
  description: "Staff_Bridges Admin",
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <BootstrapClient />
        <StoreProvider>
          <GoogleProviderWrapper>
            {children}
          </GoogleProviderWrapper>
        </StoreProvider>
      </body>
    </html>
  );
}
