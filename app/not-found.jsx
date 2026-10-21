import SiteResultPage from "../components/marketing/SiteResultPage";

export const metadata = {
  title: { absolute: "Page not found · GNX Sales" },
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <SiteResultPage
      eyebrow="Error 404"
      title="This page is"
      accent="not here."
      text="The link may be old, or the page moved. Everything else is where you left it, including your workspace."
      primary={{ label: "Back to home", href: "/" }}
      secondary={{ label: "Sign in", href: "/login" }}
      bigText="404"
      sectionTitle="Maybe you were looking for"
      cards={[
        { icon: "star", title: "Pricing", text: "Plans with enrichment and AI calling, from $59 a month.", href: "/pricing", linkLabel: "See pricing" },
        { icon: "spark", title: "How the agent works", text: "Finds buyers, checks every fact, writes each email and waits for your OK.", href: "/platform", linkLabel: "Meet the agent" },
        { icon: "book", title: "Help Center", text: "Setup guides for inboxes, campaigns, calling and billing.", href: "/help", linkLabel: "Get help" },
      ]}
    />
  );
}
