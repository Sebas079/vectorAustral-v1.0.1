import type { Metadata } from "next";

export const siteUrl = new URL("https://vectoraustral.com.ar/");
const canonicalUrl = siteUrl.origin;

const homeTitle = "Automatizaciones con n8n en Argentina | Vector Austral";
const homeDescription =
  "Conectamos las herramientas de tu negocio con automatizaciones a medida en n8n. Reducí tareas manuales y respondé mejor a tus clientes en Argentina.";

export const homeMetadata: Metadata = {
  metadataBase: siteUrl,
  title: homeTitle,
  description: homeDescription,
  alternates: {
    canonical: canonicalUrl,
  },
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: canonicalUrl,
    siteName: "Vector Austral",
    title: homeTitle,
    description: homeDescription,
  },
  twitter: {
    card: "summary",
    title: homeTitle,
    description: homeDescription,
  },
};

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Vector Austral",
  url: canonicalUrl,
  logo: new URL("/assets/brand/vector-austral-logo.svg", siteUrl).toString(),
};
