import { usePortfolioSection } from "@/lib/portfolioStore";
import type { Portfolio } from "@/data/portfolio";

export function JsonLd() {
  const { data: p } = usePortfolioSection<Portfolio["personal"]>("identity");

  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: p.fullName,
    jobTitle: p.title,
    description: p.bio,
    url: window.location.origin,
    email: `mailto:${p.email}`,
    telephone: p.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: p.location,
    },
    sameAs: [p.linkedin, p.github].filter(Boolean),
    knowsAbout: [
      "DevOps", "Cloud Engineering", "Docker", "Kubernetes",
      "Jenkins", "AWS", "CI/CD", "Python",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
