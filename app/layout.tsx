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
    default: "Digitalo — The premium marketplace for digital creators",
    template: "%s · Digitalo",
  },
  description:
    "Sell and discover premium digital products. Templates, SaaS boilerplates, UI kits, ebooks, plugins and creator assets — beautifully curated.",
  metadataBase: new URL("https://digitalo.app"),
  openGraph: {
    title: "Digitalo — The premium marketplace for digital creators",
    description:
      "Templates, SaaS boilerplates, UI kits, ebooks, plugins and creator assets — beautifully curated.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-paper font-sans text-ink antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
