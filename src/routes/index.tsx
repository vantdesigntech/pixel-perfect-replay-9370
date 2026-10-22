import { createFileRoute } from "@tanstack/react-router";
import { Terminal } from "@/terminal/Terminal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Trading Bot Terminal" },
      { name: "description", content: "Trading terminal interface for a local Python trading bot." },
      { property: "og:title", content: "Trading Bot Terminal" },
      { property: "og:description", content: "Trading terminal interface for a local Python trading bot." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Terminal,
});
