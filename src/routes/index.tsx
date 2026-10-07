import { createFileRoute } from "@tanstack/react-router";
import { Experience } from "@/components/Experience";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KNOTLINE — Maritime Stories, Intelligence & Publications" },
      { name: "description", content: "Explore maritime newsletters, reports and whitepapers as immersive digital publications." },
      { property: "og:title", content: "KNOTLINE — Maritime Publication Archive" },
      { property: "og:description", content: "Explore maritime newsletters, reports and whitepapers as immersive digital publications." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <Experience />,
});
