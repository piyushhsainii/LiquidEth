import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import MasterProvider from "@/components/Provider";
import { Metadata } from "next";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Liquid ETH",
  description:
    "Secure, decentralized, and profitable ETH Staking Protocol. Start earning rewards by staking your ETH today.",
  openGraph: {
    title: "Liquid ETH",
    description:
      "Secure, decentralized, and profitable ETH Staking Protocol. Start earning rewards by staking your ETH today.",
    images: [
      {
        url: "https://res.cloudinary.com/dzow59kgu/image/upload/v1752592843/localhost_3000__2_mizrhm.png", // Relative to the public/ directory
        width: 1200,
        height: 630,
        alt: "Liquid ETH",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Liquid ETH",
    description:
      "Secure, decentralized, and profitable ETH Staking Protocol. Start earning rewards by staking your ETH today.",
    images: [
      "https://res.cloudinary.com/dzow59kgu/image/upload/v1752592843/localhost_3000__2_mizrhm.png",
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <MasterProvider>{children}</MasterProvider>
        <Toaster />
      </body>
    </html>
  );
}
