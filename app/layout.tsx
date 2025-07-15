"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { WagmiProvider } from "wagmi";
import { config } from "@/config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster } from "sonner";
import { Head } from "next/document";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <html lang="en">
      <Head>
        <title>Liquid ETH</title>
        <meta
          name="Liquid ETH"
          content=" Secure, decentralized, and profitable ETH Staking Protocol. Start
            earning rewards by staking your ETH today"
        />

        {/* Open Graph tags */}
        <meta property="og:title" content="Liquid ETH" />
        <meta
          property="og:description"
          content=" Secure, decentralized, and profitable ETH Staking Protocol. Start
            earning rewards by staking your ETH today"
        />
        <meta
          property="og:image"
          content="https://res.cloudinary.com/dzow59kgu/image/upload/v1752525947/Screenshot_2025-07-15_021504_c0qrhz.png"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://liquid-eth.vercel.app/" />

        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Liquid ETH" />
        <meta
          name="twitter:description"
          content=" Secure, decentralized, and profitable ETH Staking Protocol. Start
            earning rewards by staking your ETH today"
        />
        <meta
          name="twitter:image"
          content="https://res.cloudinary.com/dzow59kgu/image/upload/v1752525947/Screenshot_2025-07-15_021504_c0qrhz.png"
        />
      </Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </WagmiProvider>
        <Toaster />
      </body>
    </html>
  );
}
