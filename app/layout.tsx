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
import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'light') {
                    document.documentElement.classList.add('light');
                  } else {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-paper font-sans text-ink antialiased`}
      >
        <ThemeProvider>
          <CartProvider>
            {children}
            <Toaster
              position="top-right"
              richColors
              closeButton
              toastOptions={{
                style: {
                  background: "var(--color-paper-soft)",
                  border: "1px solid var(--color-line)",
                  color: "var(--color-ink)",
                },
              }}
            />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
