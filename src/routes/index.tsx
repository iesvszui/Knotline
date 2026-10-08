import { createFileRoute } from "@tanstack/react-router";
import { Experience } from "@/components/Experience";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KNOTLINE — Our Monthly Newspaper" },
      { name: "description", content: "Discover our monthly newspaper celebrating birthdays, new joiners, festivals, achievements, and the moments we share." },
      { property: "og:title", content: "KNOTLINE — Monthly Newspaper Archive" },
      { property: "og:description", content: "Discover our monthly newspaper celebrating birthdays, new joiners, festivals, achievements, and the moments we share." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <Experience />,
});
