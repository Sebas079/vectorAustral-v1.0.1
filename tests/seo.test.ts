import { describe, expect, it } from "vitest";

import robots from "../app/robots";
import sitemap from "../app/sitemap";
import { homeMetadata, organizationJsonLd, siteUrl } from "../lib/seo";
import { landingContent } from "../sources/content/landing";

describe("organic SEO", () => {
  it("defines Argentina-focused canonical and social metadata", () => {
    expect(siteUrl.origin).toBe("https://vectoraustral.com.ar");
    expect(homeMetadata.alternates?.canonical).toBe(
      "https://vectoraustral.com.ar",
    );
    expect(homeMetadata.openGraph).toMatchObject({
      type: "website",
      locale: "es_AR",
      url: "https://vectoraustral.com.ar",
      siteName: "Vector Austral",
    });
    expect(homeMetadata.title).toContain("n8n");
    expect(homeMetadata.description).toContain("Argentina");
  });

  it("keeps the only sitemap URL canonical and excludes API routes", () => {
    expect(sitemap()).toEqual([{ url: "https://vectoraustral.com.ar" }]);
  });

  it("allows public crawling and points crawlers to the sitemap", () => {
    expect(robots()).toEqual({
      rules: {
        userAgent: "*",
        allow: "/",
        disallow: "/api/",
      },
      sitemap: "https://vectoraustral.com.ar/sitemap.xml",
    });
  });

  it("describes the verified organization and prioritizes n8n in the landing H1", () => {
    expect(organizationJsonLd).toEqual({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Vector Austral",
      url: "https://vectoraustral.com.ar",
      logo: "https://vectoraustral.com.ar/assets/brand/vector-austral-logo.svg",
    });
    expect(landingContent.hero.title).toContain("n8n");
  });
});
