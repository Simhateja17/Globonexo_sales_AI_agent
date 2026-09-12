// Organization and SoftwareApplication schema, rendered once from the root
// layout so every page carries the publisher identity, and the product is
// described in one place rather than drifting between pages.
const SITE_URL = "https://gnxsales.com";

const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "GNX Sales",
  legalName: "Globonexo, Inc.",
  url: SITE_URL,
  logo: `${SITE_URL}/gnx-sales-logo.png`,
  description:
    "GNX Sales builds AI sales agents that find buyers, start conversations, and book meetings for small sales teams.",
  email: "support@gnxsales.com",
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "support@gnxsales.com",
      url: `${SITE_URL}/contact`,
      availableLanguage: ["English"],
    },
  ],
};

const website = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: "GNX Sales",
  publisher: { "@id": `${SITE_URL}/#organization` },
};

const application = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": `${SITE_URL}/#software`,
  name: "GNX Sales",
  url: SITE_URL,
  applicationCategory: "BusinessApplication",
  applicationSubCategory: "Sales Automation Software",
  operatingSystem: "Web browser",
  description:
    "An AI sales agent that sources and qualifies leads, writes personalized email sequences, follows up, drafts replies, places AI voice calls, and books meetings.",
  publisher: { "@id": `${SITE_URL}/#organization` },
  featureList: [
    "Lead sourcing and enrichment",
    "Ideal customer profile qualification",
    "AI-written email sequences",
    "Automated follow-ups and reply drafting",
    "AI voice calling with pre-launch simulation testing",
    "Meeting booking against real calendar availability",
    "Campaign and voice-call analytics",
  ],
};

export default function SiteSchema() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify([organization, website, application]),
      }}
    />
  );
}

// Breadcrumbs for pages that sit below the top level. Emitted as data only —
// the visible navigation already exists in the header and footer.
export function BreadcrumbSchema({ trail }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...trail].map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Article schema for blog posts. The publisher and author both point back to
// the Organization node the root layout already emits, so there is one identity
// across the site rather than a second, slightly different company on each post.
export function ArticleSchema({
  headline,
  description,
  path,
  datePublished,
  dateModified,
  image = "/og-image.png",
  wordCount,
  articleSection,
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${SITE_URL}${path}#article`,
    headline,
    description,
    url: `${SITE_URL}${path}`,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}${path}` },
    datePublished,
    dateModified: dateModified || datePublished,
    image: [`${SITE_URL}${image}`],
    author: { "@id": `${SITE_URL}/#organization` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    isPartOf: { "@id": `${SITE_URL}/blog#blog` },
    inLanguage: "en",
    ...(wordCount ? { wordCount } : {}),
    ...(articleSection ? { articleSection } : {}),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// The blog index itself, plus the posts it lists. Posts that are not written
// yet are deliberately absent — listing an unpublished URL is a broken promise
// to a crawler.
export function BlogSchema({ name, description, posts = [] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${SITE_URL}/blog#blog`,
    name,
    description,
    url: `${SITE_URL}/blog`,
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "en",
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      "@id": `${SITE_URL}${post.path}#article`,
      headline: post.headline,
      description: post.description,
      url: `${SITE_URL}${post.path}`,
      datePublished: post.datePublished,
      author: { "@id": `${SITE_URL}/#organization` },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
