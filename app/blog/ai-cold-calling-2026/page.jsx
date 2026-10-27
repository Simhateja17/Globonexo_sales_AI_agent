const PATH = "/blog/ai-cold-calling-2026";
const PUBLISHED = "2026-10-27";
const TITLE = "AI Cold Calling in 2026: Is It Legal, Does It Work, and When Should a Startup Use It?";
const DESCRIPTION =
  "AI cold calling is not banned in the US, but consent rules apply. It works when you place calls well, not just more of them. The data, the law and a 30-day pilot.";
const SOCIAL_IMAGE = `${PATH}/opengraph-image`;

export const metadata = {
  title: "AI Cold Calling in 2026: Is It Legal and Does It Work?",
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
        alt: "AI cold calling in 2026: is it legal, does it work, GNX Sales",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description:
      "370 dials book one meeting. Here is what AI changes, what the law says, and a 30-day pilot.",
    images: [SOCIAL_IMAGE],
  },
};

import PublicNav from "../../../components/layout/PublicNav";
import PublicFooter from "../../../components/layout/PublicFooter";
import BlogDesignBody from "../../../components/marketing/BlogDesignBody";
import { ArticleSchema, BreadcrumbSchema } from "../../../components/marketing/SiteSchema";
import { aiColdCallingArticleHtml } from "../../../components/marketing/blog/aiColdCallingArticleHtml";

export default function AiColdCallingArticle() {
  return (
    <>
      <ArticleSchema
        headline={TITLE}
        description={DESCRIPTION}
        path={PATH}
        datePublished={PUBLISHED}
        articleSection="Outbound, explained"
        wordCount={3000}
      />
      <BreadcrumbSchema
        trail={[
          { name: "Blog", path: "/blog" },
          { name: TITLE, path: PATH },
        ]}
      />
      <PublicNav />
      <main>
        <BlogDesignBody html={aiColdCallingArticleHtml} className="blog-article" />
      </main>
      <PublicFooter />
    </>
  );
}
