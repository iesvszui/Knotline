import { createFileRoute, notFound } from "@tanstack/react-router";
import { Experience } from "@/components/Experience";
import { getPublication } from "@/lib/publications";

export const Route = createFileRoute("/publication/$slug")({
  loader: ({ params }) => {
    const pub = getPublication(params.slug);
    if (!pub) throw notFound();
    return { title: pub.title, description: pub.description, edition: pub.edition, date: pub.date };
  },
  head: ({ loaderData, params }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.title} — KNOTLINE ${loaderData.edition}` },
          { name: "description", content: loaderData.description },
          { property: "og:title", content: `${loaderData.title} — KNOTLINE` },
          { property: "og:description", content: loaderData.description },
          { property: "og:type", content: "article" },
          { name: "twitter:card", content: "summary_large_image" },
        ]
      : [],
    scripts: loaderData
      ? [{
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org", "@type": "PublicationIssue", name: loaderData.title,
            issueNumber: loaderData.edition, datePublished: loaderData.date, description: loaderData.description,
            url: `/publication/${params.slug}`, publisher: { "@type": "Organization", name: "KNOTLINE" },
          }),
        }]
      : [],
  }),
  component: PublicationPage,
});

function PublicationPage() {
  const { slug } = Route.useParams();
  return <Experience initialSlug={slug} />;
}
