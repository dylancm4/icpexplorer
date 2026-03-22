/**
 * Root layout for the ICP Explorer web application.
 *
 * This is the outermost Server Component that wraps every page.
 * It sets up the HTML document shell, loads the Geist font family
 * via `next/font/google`, applies global CSS (Tailwind), and
 * provides shared metadata for SEO and social previews.
 */

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

/**
 * Geist sans-serif font loaded via `next/font`.
 * Exposed as the `--font-geist-sans` CSS variable for Tailwind consumption.
 */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

/**
 * Geist monospace font loaded via `next/font`.
 * Exposed as the `--font-geist-mono` CSS variable for Tailwind consumption.
 */
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/** Default metadata applied to all pages unless overridden. */
export const metadata: Metadata = {
  title: "ICP Explorer",
  description: "AI-powered explorer for the Internet Computer",
};

/**
 * Application shell that wraps all routes.
 *
 * Applies the Geist font CSS variables to the `<html>` element and
 * sets up a full-height flex column on `<body>` so pages can fill
 * the viewport.
 *
 * @param props.children - The page content rendered by the current route.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
