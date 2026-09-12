const TITLE = "Blog: Outbound, Explained";
const DESCRIPTION =
  "How automated outbound actually works: what a platform runs, what your team keeps, and what to check before you buy one. A four-part series from GNX Sales.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/blog" },
  openGraph: {
    type: "website",
    url: "/blog",
    title: TITLE,
    description:
      "A four-part series on how automated outbound works — what a platform runs and what your team keeps.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Outbound, explained — the GNX Sales blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description:
      "A four-part series on how automated outbound works — what a platform runs and what your team keeps.",
    images: ["/og-image.png"],
  },
};

import PublicNav from "../../components/layout/PublicNav";
import PublicFooter from "../../components/layout/PublicFooter";
import BlogDesignBody from "../../components/marketing/BlogDesignBody";
import { BlogSchema, BreadcrumbSchema } from "../../components/marketing/SiteSchema";
import { blogIndexHtml } from "../../components/marketing/blog/blogIndexHtml";

export default function BlogIndexPage() {
  return (
    <>
      <BlogSchema
        name="Outbound, explained"
        description={DESCRIPTION}
        posts={[
          {
            path: "/blog/what-is-a-sales-automation-platform",
            headline: "What Is a Sales Automation Platform? And What It Actually Replaces",
            description:
              "What a platform does, where it helps, what your team should still control, and the seven questions to ask a vendor.",
            datePublished: "2026-09-12",
          },
        ]}
      />
      <BreadcrumbSchema trail={[{ name: "Blog", path: "/blog" }]} />
      <PublicNav />
      <main>
        <BlogDesignBody html={blogIndexHtml} />
      </main>
      <PublicFooter />
    </>
  );
}
