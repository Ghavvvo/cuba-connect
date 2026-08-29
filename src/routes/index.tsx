import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Search, TrendingUp, Globe, Megaphone, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CATEGORIES, ZONES } from "@/lib/constants";
import { BannerSlot } from "@/components/site/BannerSlot";
import heroImage from "@/assets/hero-habana.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ToenCuba | Hostales, taxis y restaurantes en Cuba" },
      {
        name: "description",
        content:
          "Encuentra hostales, taxis y restaurantes en Cuba y escribe directo por WhatsApp. Directorio completo por zona, sin comisiones.",
      },
      { property: "og:title", content: "ToenCuba | Turismo cubano por WhatsApp" },
      {
        property: "og:description",
        content:
          "Directorio completo de hostales, taxis y restaurantes en Cuba con contacto directo por WhatsApp.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const OFFERS = [
  {
    icon: TrendingUp,
    title: "Puja por visibilidad",
    text: "Paga más y apareces más arriba en tu categoría. Si te superan, bajas de puesto pero nunca sales de la lista.",
  },
  {
    icon: Globe,
    title: "Tu propio subdominio",
    text: "tunegocio.toencuba.app: tu página como si fuera tu web, activada manualmente por el equipo.",
  },
  {
    icon: Megaphone,
    title: "Banners publicitarios",
    text: "Espacios patrocinados en las páginas de búsqueda por categoría y zona.",
  },
];

const TESTIMONIALS = [
  {
    name: "Yanet, hostal en Vedado",
    text: "Desde que subí mi puja recibo mensajes casi todos los días. Los turistas escriben directo por WhatsApp.",
  },
  {
    name: "Yoandry, taxi clásico",
    text: "Pago por transferencia y el equipo me ajusta la puja el mismo día. Simple y sin complicaciones.",
  },
  {
    name: "Marta, paladar en Centro Habana",
    text: "El subdominio me sirvió para compartir mi menú sin tener que pagar una web completa.",
  },
];

function Index() {
  const navigate = useNavigate();
  const [category, setCategory] = useState<string>("hostal");
  const [zona, setZona] = useState<string>("todas");

  const search = () => {
    const target = CATEGORIES.find((c) => c.value === category)!;
    void navigate({ to: target.path, search: zona === "todas" ? {} : { zona } });
  };

  return (
    <main>
      <section className="relative overflow-hidden bg-hero text-secondary-foreground">
        <img
          src={heroImage}
          alt="Calle colonial de La Habana con un auto clásico naranja al atardecer"
          width={1600}
          height={1000}
          className="absolute inset-0 h-full w-full object-cover opacity-35"
        />
        <div className="relative mx-auto max-w-4xl px-4 py-16 text-center sm:py-24">
          <h1 className="text-4xl font-extrabold leading-tight sm:text-6xl">
            Cuba, contacto <span className="text-primary">directo</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-secondary-foreground/85 sm:text-lg">
            Hostales, taxis y restaurantes de toda la isla. Sin comisiones, sin intermediarios:
            escribes por WhatsApp y listo.
          </p>

          <Card className="mx-auto mt-8 max-w-2xl border-0 shadow-glow">
            <CardContent className="flex flex-col gap-3 p-4 sm:flex-row">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={zona} onValueChange={setZona}>
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas las zonas</SelectItem>
                  {ZONES.map((z) => (
                    <SelectItem key={z.value} value={z.value}>
                      {z.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={search} className="sm:w-auto">
                <Search className="h-4 w-4" /> Buscar
              </Button>
            </CardContent>
          </Card>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {CATEGORIES.map((c) => (
              <Button key={c.value} asChild variant="secondary" size="sm">
                <Link to={c.path}>{c.label}</Link>
              </Button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-6">
        <BannerSlot position="top" />
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-center text-3xl font-bold">¿Tienes un negocio en Cuba?</h2>
        <p className="mx-auto mt-2 max-w-2xl text-center text-muted-foreground">
          Tres formas de ganar visibilidad. Pagos manuales por Transfermóvil, EnZona o USDT.
        </p>
        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          {OFFERS.map((o) => (
            <Card key={o.title} className="shadow-card">
              <CardContent className="p-6">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand text-primary-foreground">
                  <o.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-lg font-bold">{o.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{o.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Button asChild size="lg">
            <Link to="/prestadores/registro">Registrar mi negocio gratis</Link>
          </Button>
        </div>
      </section>

      <section className="bg-accent/40 py-12">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-3xl font-bold">Lo que dicen los prestadores</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <Card key={t.name} className="border-0 bg-card shadow-card">
                <CardContent className="p-6">
                  <Quote className="h-6 w-6 text-primary" />
                  <p className="mt-3 text-sm text-muted-foreground">{t.text}</p>
                  <p className="mt-4 text-sm font-semibold">{t.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
