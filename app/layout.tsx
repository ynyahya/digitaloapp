import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "TESKEL — Build, Test, Scale",
    template: "%s · TESKEL",
  },
  description:
    "The engine for digital product. Build, test, and scale your digital creations with ease.",
  metadataBase: new URL("https://teskel.app"),
  openGraph: {
    title: "TESKEL — Build, Test, Scale",
    description:
      "The engine for digital product. Build, test, and scale your digital creations with ease.",
    type: "website",
  },
};

import { CartProvider } from "@/hooks/use-cart";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-paper font-sans text-ink antialiased`}
      >
        <CartProvider>
          {children}
          <Toaster
            position="top-right"
            richColors
            closeButton
            theme="dark"
            toastOptions={{
              style: {
                background: "#0F0F12",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#FAFAFA",
              },
            }}
          />
        </CartProvider>
      </body>
    </html>
  );
}
