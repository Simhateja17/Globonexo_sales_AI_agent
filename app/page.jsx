import LandingPage from "../components/landing/LandingPage";

export const metadata = {
  title: {
    absolute: "AI Sales Agent for Automated Prospecting and Outreach | GNX Sales",
  },
  description:
    "GNX Sales is an AI sales agent that finds buyers, researches them, writes personalized email, follows up, and calls by AI voice. Sales automation software that books meetings on its own.",
  alternates: { canonical: "/" },
  openGraph: { url: "/" },
};

export default function Page() {
  return <LandingPage />;
}
