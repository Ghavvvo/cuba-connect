import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIES, ZONES } from "@/lib/constants";

export const Route = createFileRoute("/prestadores/registro")({
  head: () => ({
    meta: [
      { title: "Registra tu negocio gratis | ToenCuba" },
      {
        name: "description",
        content:
          "Publica tu hostal, taxi o restaurante en ToenCuba. Registro gratis y contacto directo por WhatsApp con los turistas.",
      },
      { property: "og:title", content: "Publica tu negocio en ToenCuba" },
      {
        property: "og:description",
        content: "Registro gratuito para prestadores turísticos en Cuba.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RegistroPage,
});

const STEPS = [
  "Envías el formulario con los datos de tu negocio.",
  "El equipo te escribe por WhatsApp para validar la información.",
  "Tu negocio se activa y aparece en la lista de su categoría.",
];

function RegistroPage() {
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Demo de interfaz: registro simulado, aún no se envía a ningún servidor.");
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-bold sm:text-4xl">Publica tu negocio</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Registro gratuito. Apareces al final de la lista y puedes subir de puesto pujando cuando
        quieras.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card className="shadow-card">
          <CardContent className="p-6">
            <form className="space-y-5" onSubmit={submit}>
              <div className="space-y-2">
                <Label htmlFor="name">Nombre del negocio</Label>
                <Input id="name" placeholder="Hostal Villa D2" required />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Categoría</Label>
                  <Select defaultValue="hostal">
                    <SelectTrigger>
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
                </div>
                <div className="space-y-2">
                  <Label>Zona</Label>
                  <Select defaultValue="vedado">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ZONES.map((z) => (
                        <SelectItem key={z.value} value={z.value}>
                          {z.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="wa">WhatsApp (con prefijo 53)</Label>
                <Input id="wa" placeholder="5350000000" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="desc">Descripción</Label>
                <Textarea
                  id="desc"
                  rows={4}
                  placeholder="Cuenta en pocas líneas qué ofreces, precios orientativos y ubicación."
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="photo">Foto principal (URL)</Label>
                  <Input id="photo" placeholder="https://res.cloudinary.com/..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cover">Foto de portada (URL)</Label>
                  <Input id="cover" placeholder="https://res.cloudinary.com/..." />
                </div>
              </div>

              <Button type="submit" size="lg" className="w-full sm:w-auto">
                Enviar registro
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="h-fit border-0 bg-accent/40 shadow-card">
          <CardContent className="p-6">
            <h2 className="text-lg font-bold">¿Cómo sigue el proceso?</h2>
            <ul className="mt-4 space-y-4">
              {STEPS.map((s) => (
                <li key={s} className="flex gap-3 text-sm text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs text-muted-foreground">
              Los pagos de pujas, subdominios y banners son manuales por Transfermóvil, EnZona o
              USDT.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
