import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/site/CategoryPage";

export const Route = createFileRoute("/taxis")({
  validateSearch: (search: Record<string, unknown>) => ({
    zona: typeof search['zona'] === "string" ? (search['zona'] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Taxis y traslados en Cuba | ToenCuba" },
      {
        name: "description",
        content:
          "Taxis, almendrones y traslados al aeropuerto en Cuba. Lista completa por zona con contacto por WhatsApp.",
      },
      { property: "og:title", content: "Taxis y traslados en Cuba | ToenCuba" },
      {
        property: "og:description",
        content: "Encuentra taxis y traslados en Cuba y escribe directo por WhatsApp.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  const { zona } = Route.useSearch();
  return (
    <CategoryPage
      category="taxi"
      zona={zona}
      routeTo="/taxis"
      intro="Lista completa de taxis y traslados activos. Los destacados aparecen primero."
    />
  );
}
