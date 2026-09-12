const PATH = "/blog/what-is-a-sales-automation-platform";
const PUBLISHED = "2026-09-12";
const TITLE = "What Is a Sales Automation Platform? And What It Actually Replaces";
const DESCRIPTION =
  "What a sales automation platform runs, what it is not, the six steps of an outbound workflow, what your team should still control, and seven questions to ask a vendor.";

export const metadata = {
  title: "What Is a Sales Automation Platform?",
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: {
    type: "article",
    url: PATH,
    title: TITLE,
    description: DESCRIPTION,
    publishedTime: PUBLISHED,
    modifiedTime: PUBLISHED,
    authors: ["GNX Sales"],
    section: "Outbound, explained",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "What is a sales automation platform — GNX Sales",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description:
      "What a platform does, where it helps, what your team should still control, and the seven questions to ask a vendor.",
    images: ["/og-image.png"],
  },
};

import PublicNav from "../../../components/layout/PublicNav";
import PublicFooter from "../../../components/layout/PublicFooter";
import BlogDesignBody from "../../../components/marketing/BlogDesignBody";
import { ArticleSchema, BreadcrumbSchema } from "../../../components/marketing/SiteSchema";
import { salesAutomationArticleHtml } from "../../../components/marketing/blog/salesAutomationArticleHtml";

export default function SalesAutomationPlatformArticle() {
  return (
    <>
      <ArticleSchema
        headline={TITLE}
        description={DESCRIPTION}
        path={PATH}
        datePublished={PUBLISHED}
        articleSection="Outbound, explained"
        wordCount={2100}
      />
      <BreadcrumbSchema
        trail={[
          { name: "Blog", path: "/blog" },
          { name: "What Is a Sales Automation Platform?", path: PATH },
        ]}
      />
      <PublicNav />
      <main>
        <BlogDesignBody html={salesAutomationArticleHtml} className="blog-article" />
      </main>
      <PublicFooter />
    </>
  );
}
