import { useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { MessageCircle, MapPin, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchPropertyBySlug } from "@/lib/queries";
import { supabase } from "@/integrations/supabase/client";
import { categoryLabel, optimizedImage, waLink, zoneLabel } from "@/lib/constants";

export const Route = createFileRoute("/propiedad/$slug")({
  head: () => ({
    meta: [
      { title: "Detalle del negocio | ToenCuba" },
      {
        name: "description",
        content:
          "Ficha completa del prestador: fotos, zona, descripción y contacto directo por WhatsApp.",
      },
      { property: "og:title", content: "Detalle del negocio | ToenCuba" },
      {
        property: "og:description",
        content: "Fotos, zona y contacto por WhatsApp del prestador en ToenCuba.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PropertyDetail,
});

function PropertyDetail() {
  const { slug } = Route.useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["property", slug],
    queryFn: () => fetchPropertyBySlug(slug),
  });

  useEffect(() => {
    if (data?.slug) void supabase.rpc("increment_views", { _slug: data.slug });
  }, [data?.slug]);

  if (isLoading) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-8">
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="mt-4 h-8 w-2/3" />
      </main>
    );
  }

  if (!data) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">No encontramos este negocio</h1>
        <p className="mt-2 text-muted-foreground">
          Puede que ya no esté activo en el directorio.
        </p>
        <Button asChild className="mt-6">
          <Link to="/">Volver al inicio</Link>
        </Button>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <img
        src={optimizedImage(data.cover_url ?? data.photo_url, 1200)}
        alt={`Foto principal de ${data.name}`}
        className="h-64 w-full rounded-xl object-cover shadow-card sm:h-80"
      />

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <Badge variant="secondary">{categoryLabel(data.category)}</Badge>
        <Badge variant="outline" className="gap-1">
          <MapPin className="h-3 w-3" /> {zoneLabel(data.zone)}
        </Badge>
        <span className="flex items-center gap-1 text-sm text-muted-foreground">
          <Eye className="h-3.5 w-3.5" /> {data.views} visitas
        </span>
      </div>

      <h1 className="mt-3 text-3xl font-bold sm:text-4xl">{data.name}</h1>
      {data.description && (
        <p className="mt-4 whitespace-pre-line text-muted-foreground">{data.description}</p>
      )}

      <div className="sticky bottom-4 mt-8">
        <Button
          asChild
          size="lg"
          className="w-full"
          onClick={() => void supabase.rpc("increment_clicks", { _slug: data.slug })}
        >
          <a
            href={waLink(data.whatsapp, `Hola ${data.name}, los encontré en ToenCuba.`)}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle className="h-5 w-5" /> Escribir por WhatsApp
          </a>
        </Button>
      </div>
    </main>
  );
}
