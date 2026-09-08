const SITE_URL = "https://gnxsales.com";

// Priority reflects how much of the commercial intent each page carries, and
// changeFrequency reflects how often the content genuinely moves. Legal pages
// are listed because they are public, not because we want them ranking.
const PUBLIC_ROUTES = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" },
  { path: "/platform", priority: 0.9, changeFrequency: "monthly" },
  { path: "/solutions", priority: 0.9, changeFrequency: "monthly" },
  { path: "/voice", priority: 0.9, changeFrequency: "monthly" },
  { path: "/pricing", priority: 0.9, changeFrequency: "weekly" },
  { path: "/sales-automation-software", priority: 0.8, changeFrequency: "monthly" },
  { path: "/ai-sdr-tools", priority: 0.8, changeFrequency: "monthly" },
  { path: "/b2b-lead-generation-tools", priority: 0.8, changeFrequency: "monthly" },
  { path: "/ai-sales-agent-guide", priority: 0.8, changeFrequency: "monthly" },
  { path: "/cold-email-software", priority: 0.7, changeFrequency: "monthly" },
  { path: "/solutions/agencies", priority: 0.8, changeFrequency: "monthly" },
  { path: "/solutions/b2b-startups", priority: 0.8, changeFrequency: "monthly" },
  { path: "/accuracy", priority: 0.7, changeFrequency: "monthly" },
  { path: "/faq", priority: 0.6, changeFrequency: "monthly" },
  { path: "/about", priority: 0.5, changeFrequency: "yearly" },
  { path: "/contact", priority: 0.5, changeFrequency: "yearly" },
  { path: "/help", priority: 0.5, changeFrequency: "monthly" },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/refund", priority: 0.3, changeFrequency: "yearly" },
  { path: "/cookies", priority: 0.3, changeFrequency: "yearly" },
];

export default function sitemap() {
  const lastModified = new Date();
  return PUBLIC_ROUTES.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
