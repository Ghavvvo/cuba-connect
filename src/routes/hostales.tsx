import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/site/CategoryPage";

export const Route = createFileRoute("/hostales")({
  validateSearch: (search: Record<string, unknown>): { zona?: string } =>
    typeof search['zona'] === "string" ? { zona: search['zona'] } : {},
  head: () => ({
    meta: [
      { title: "Hostales en Cuba | ToenCuba" },
      {
        name: "description",
        content:
          "Listado completo de hostales y casas particulares en Cuba. Filtra por zona y contacta al anfitrión por WhatsApp.",
      },
      { property: "og:title", content: "Hostales en Cuba | ToenCuba" },
      {
        property: "og:description",
        content: "Hostales y casas particulares en Cuba con contacto directo por WhatsApp.",
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
      category="hostal"
      zona={zona}
      routeTo="/hostales"
      intro="Lista completa de hostales activos. Los destacados aparecen primero."
    />
  );
}
