import { Manrope, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../providers/AuthProvider";
import PostHogProvider from "../providers/PostHogProvider";
import { Analytics } from "@vercel/analytics/next";
import SiteSchema from "../components/marketing/SiteSchema";

// Self-hosted through next/font so the page does not block on a Google Fonts
// stylesheet before it can paint.
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://gnxsales.com"),
  title: {
    default: "AI Sales Agent for Automated Prospecting and Outreach | GNX Sales",
    template: "%s | GNX Sales",
  },
  description:
    "GNX Sales is an AI sales agent that finds buyers, researches them, writes personalized email, follows up, and calls by AI voice. Sales automation software that books meetings on its own.",
  keywords: [
    "AI sales agent",
    "sales automation software",
    "AI agents for sales",
    "AI SDR",
    "B2B lead generation",
    "AI voice agent",
  ],
  openGraph: {
    type: "website",
    siteName: "GNX Sales",
    url: "/",
    title: "AI Sales Agent for Automated Prospecting and Outreach | GNX Sales",
    description:
      "An AI sales agent that finds buyers, writes personalized outreach, follows up, and calls by AI voice — so you only handle the conversations.",
    images: ["/gnx-sales-logo.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Sales Agent for Automated Prospecting and Outreach | GNX Sales",
    description:
      "An AI sales agent that finds buyers, writes personalized outreach, follows up, and calls by AI voice.",
    images: ["/gnx-sales-logo.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${manrope.variable} ${spaceGrotesk.variable}`}>
      <body>
        <PostHogProvider>
          <AuthProvider>{children}</AuthProvider>
        </PostHogProvider>
        <Analytics />
        <SiteSchema />
      </body>
    </html>
  );
}
