import type { Metadata, Viewport } from "next";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./globals.css";
import { ReactNode } from "react";
import Providers from "./providers"; // We'll create a client component for providers

export const metadata: Metadata = {
  title: "For Pragya",
  description: "A private letter.",
  robots: "noindex, nofollow",
  openGraph: {
    title: "For Pragya",
    description: "A private letter.",
    type: "website",
  },
  twitter: {
    card: "summary",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&family=Karla:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Caveat:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
