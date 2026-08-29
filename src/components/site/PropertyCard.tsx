import { Link } from "@tanstack/react-router";
import { MessageCircle, MapPin, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { optimizedImage, waLink, zoneLabel } from "@/lib/constants";
import type { Property } from "@/lib/queries";
import { supabase } from "@/integrations/supabase/client";

export function PropertyCard({ property, rank }: { property: Property; rank: number }) {
  const bid = Number(property.bid_amount);

  const handleWhatsApp = () => {
    void supabase.rpc("increment_clicks", { _slug: property.slug });
  };

  return (
    <Card className="overflow-hidden p-0 shadow-card transition-shadow hover:shadow-glow">
      <div className="flex flex-col sm:flex-row">
        <Link
          to="/propiedad/$slug"
          params={{ slug: property.slug }}
          className="relative block sm:w-56"
        >
          <img
            src={optimizedImage(property.photo_url, 600)}
            alt={`Foto de ${property.name}`}
            loading="lazy"
            className="h-44 w-full object-cover sm:h-full"
          />
          <span className="absolute left-3 top-3 grid h-8 min-w-8 place-items-center rounded-full bg-secondary px-2 text-sm font-bold text-secondary-foreground">
            #{rank}
          </span>
        </Link>

        <div className="flex flex-1 flex-col gap-3 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <Link to="/propiedad/$slug" params={{ slug: property.slug }}>
                <h3 className="text-lg font-bold hover:text-primary">{property.name}</h3>
              </Link>
              <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" /> {zoneLabel(property.zone)}
              </p>
            </div>
            {bid > 0 && (
              <Badge className="gap-1 bg-brand text-primary-foreground">
                <Trophy className="h-3 w-3" /> Destacado
              </Badge>
            )}
          </div>

          {property.description && (
            <p className="line-clamp-2 text-sm text-muted-foreground">{property.description}</p>
          )}

          <div className="mt-auto flex flex-wrap gap-2">
            <Button asChild variant="secondary" size="sm">
              <Link to="/propiedad/$slug" params={{ slug: property.slug }}>
                Ver detalles
              </Link>
            </Button>
            <Button asChild size="sm" onClick={handleWhatsApp}>
              <a
                href={waLink(property.whatsapp, `Hola ${property.name}, los vi en ToenCuba.`)}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
