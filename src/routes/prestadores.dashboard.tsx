import { createFileRoute, Link } from "@tanstack/react-router";
import { Eye, MessageCircle, Trophy, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ADMIN_WHATSAPP, categoryLabel, waLink, zoneLabel } from "@/lib/constants";
import { MOCK_MY_PROPERTY, mockRanking } from "@/lib/mock";

export const Route = createFileRoute("/prestadores/dashboard")({
  head: () => ({
    meta: [
      { title: "Panel del prestador | ToenCuba" },
      {
        name: "description",
        content:
          "Consulta tus visitas, clics de WhatsApp y tu posición en el ranking de tu categoría y zona.",
      },
      { property: "og:title", content: "Panel del prestador | ToenCuba" },
      {
        property: "og:description",
        content: "Estadísticas, posición en el ranking y solicitud de puja.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const p = MOCK_MY_PROPERTY;
  const { pos, total, topBid } = mockRanking(p);
  const falta = Math.max(0, topBid - p.bid_amount + 1);

  const stats = [
    { icon: Eye, label: "Visitas", value: p.views.toLocaleString("es") },
    { icon: MessageCircle, label: "Clics de WhatsApp", value: p.clicks.toLocaleString("es") },
    { icon: Trophy, label: "Puesto actual", value: `#${pos} de ${total}` },
    { icon: TrendingUp, label: "Tu puja", value: `${p.bid_amount} USD` },
  ];

  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">{p.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {categoryLabel(p.category)} · {zoneLabel(p.zone)}
          </p>
        </div>
        <Badge variant={p.active ? "default" : "secondary"}>
          {p.active ? "Activo" : "Pendiente de validación"}
        </Badge>
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        Vista de demostración con datos de ejemplo.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="shadow-card">
            <CardContent className="p-5">
              <s.icon className="h-5 w-5 text-primary" />
              <p className="mt-3 text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-6 border-0 bg-accent/40 shadow-card">
        <CardContent className="flex flex-wrap items-center justify-between gap-4 p-6">
          <div>
            <h2 className="text-lg font-bold">
              Estás en el puesto #{pos} de {total} {categoryLabel(p.category).toLowerCase()} en{" "}
              {zoneLabel(p.zone)}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              El puesto #1 paga {topBid} USD. Te faltan {falta} USD para superarlo.
            </p>
          </div>
          <Button asChild size="lg">
            <a
              href={waLink(
                ADMIN_WHATSAPP,
                `Hola, quiero subir mi puja de ${p.name} (${categoryLabel(p.category)}, ${zoneLabel(p.zone)}). Actualmente pago ${p.bid_amount} USD.`,
              )}
              target="_blank"
              rel="noreferrer"
            >
              Solicitar puja
            </a>
          </Button>
        </CardContent>
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card className="shadow-card">
          <CardContent className="p-6">
            <h2 className="text-lg font-bold">Editar mi negocio</h2>
            <form className="mt-4 space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2">
                <Label htmlFor="d-name">Nombre</Label>
                <Input id="d-name" defaultValue={p.name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="d-wa">WhatsApp</Label>
                <Input id="d-wa" defaultValue={p.whatsapp} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="d-desc">Descripción</Label>
                <Textarea id="d-desc" rows={4} defaultValue="Habitaciones con aire y desayuno." />
              </div>
              <Button type="submit" disabled>
                Guardar cambios
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="h-fit shadow-card">
          <CardContent className="p-6">
            <h2 className="text-lg font-bold">Tu subdominio</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {p.subdomain
                ? `${p.subdomain}.toencuba.app está activo.`
                : "Aún no tienes subdominio activo."}
            </p>
            <Button asChild variant="secondary" className="mt-4">
              <a
                href={waLink(ADMIN_WHATSAPP, `Hola, quiero un subdominio para ${p.name}.`)}
                target="_blank"
                rel="noreferrer"
              >
                Consultar por WhatsApp
              </a>
            </Button>
            <div className="mt-6 text-sm">
              <Link to="/propiedad/$slug" params={{ slug: p.slug }} className="text-primary">
                Ver mi página pública
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
