const PATH = "/blog/how-to-automate-lead-generation";
const PUBLISHED = "2026-10-20";
const TITLE = "How to Automate Lead Generation, Enrichment, Follow-ups and Cold Calling";
const DESCRIPTION =
  "The four stages of outbound in the order that works: lead generation, enrichment, follow-ups and cold calling, with what to automate and what to keep.";
const SOCIAL_IMAGE = `${PATH}/opengraph-image`;

export const metadata = {
  title: "How to Automate Lead Generation, Follow-ups and Cold Calling",
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
        alt: "How to automate lead generation, enrichment, follow-ups and cold calling, GNX Sales",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description:
      "Most founders automate outbound in the wrong order. Here is the order that works, stage by stage.",
    images: [SOCIAL_IMAGE],
  },
};

import PublicNav from "../../../components/layout/PublicNav";
import PublicFooter from "../../../components/layout/PublicFooter";
import BlogDesignBody from "../../../components/marketing/BlogDesignBody";
import { ArticleSchema, BreadcrumbSchema } from "../../../components/marketing/SiteSchema";
import { automateOutboundArticleHtml } from "../../../components/marketing/blog/automateOutboundArticleHtml";

export default function AutomateOutboundArticle() {
  return (
    <>
      <ArticleSchema
        headline={TITLE}
        description={DESCRIPTION}
        path={PATH}
        datePublished={PUBLISHED}
        articleSection="Outbound, explained"
        wordCount={1700}
      />
      <BreadcrumbSchema
        trail={[
          { name: "Blog", path: "/blog" },
          { name: "How to Automate Lead Generation, Enrichment, Follow-ups and Cold Calling", path: PATH },
        ]}
      />
      <PublicNav />
      <main>
        <BlogDesignBody html={automateOutboundArticleHtml} className="blog-article" />
      </main>
      <PublicFooter />
    </>
  );
}
