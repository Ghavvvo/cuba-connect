import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/site/CategoryPage";

export const Route = createFileRoute("/restaurantes")({
  validateSearch: (search: Record<string, unknown>) => ({
    zona: typeof search['zona'] === "string" ? (search['zona'] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Restaurantes y paladares en Cuba | ToenCuba" },
      {
        name: "description",
        content:
          "Paladares y restaurantes en Cuba ordenados por destacados. Filtra por zona y reserva por WhatsApp.",
      },
      { property: "og:title", content: "Restaurantes y paladares en Cuba | ToenCuba" },
      {
        property: "og:description",
        content: "Paladares y restaurantes cubanos con reserva directa por WhatsApp.",
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
      category="restaurante"
      zona={zona}
      routeTo="/restaurantes"
      intro="Lista completa de restaurantes y paladares activos. Los destacados aparecen primero."
    />
  );
}
