const PATH = "/blog/sales-automation-for-marketing-agencies";
const PUBLISHED = "2026-10-13";
const TITLE = "Sales Automation for Marketing Agencies: Who Sells for the Agency That Sells Growth?";
const DESCRIPTION =
  "Only 14% of agencies call their pipeline healthy. Five pains of agency new business, what automation fixes, and a five-step workflow.";
const SOCIAL_IMAGE = `${PATH}/opengraph-image`;

export const metadata = {
  title: "Sales Automation for Marketing Agencies",
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
        url: SOCIAL_IMAGE,
        width: 1200,
        height: 630,
        alt: "Sales automation for marketing agencies, GNX Sales",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description:
      "Why agency pipelines stall, what sales automation fixes, and what your team should keep.",
    images: [SOCIAL_IMAGE],
  },
};

import PublicNav from "../../../components/layout/PublicNav";
import PublicFooter from "../../../components/layout/PublicFooter";
import BlogDesignBody from "../../../components/marketing/BlogDesignBody";
import { ArticleSchema, BreadcrumbSchema } from "../../../components/marketing/SiteSchema";
import { agenciesArticleHtml } from "../../../components/marketing/blog/agenciesArticleHtml";

export default function AgenciesArticle() {
  return (
    <>
      <ArticleSchema
        headline={TITLE}
        description={DESCRIPTION}
        path={PATH}
        datePublished={PUBLISHED}
        articleSection="Outbound, explained"
        wordCount={1500}
      />
      <BreadcrumbSchema
        trail={[
          { name: "Blog", path: "/blog" },
          { name: "Sales Automation for Marketing Agencies", path: PATH },
        ]}
      />
      <PublicNav />
      <main>
        <BlogDesignBody html={agenciesArticleHtml} className="blog-article" />
      </main>
      <PublicFooter />
    </>
  );
}
