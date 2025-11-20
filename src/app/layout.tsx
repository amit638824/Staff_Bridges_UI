import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.css";
import GoogleProviderWrapper from "@/pages/common/GoogleProviderWrapper";
 
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
//ui
export const metadata: Metadata = {
  title: "Staff_Bridges",
  description: "Staff_Bridges Admin",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
         <GoogleProviderWrapper>
          {children}
        </GoogleProviderWrapper>
      </body>
    </html>
  );
}
