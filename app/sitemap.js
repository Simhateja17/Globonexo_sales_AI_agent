const SITE_URL = "https://gnxsales.com";

const PUBLIC_ROUTES = [
  "/",
  "/solutions",
  "/platform",
  "/voice",
  "/accuracy",
  "/pricing",
  "/about",
  "/faq",
  "/contact",
  "/help",
  "/terms",
  "/privacy",
  "/refund",
  "/cookies",
];

export default function sitemap() {
  return PUBLIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
  }));
}
