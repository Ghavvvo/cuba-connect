import { createFileRoute } from "@tanstack/react-router";
import { ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIES, ZONES, categoryLabel, zoneLabel } from "@/lib/constants";
import { MOCK_BANNERS } from "@/lib/mock";

export const Route = createFileRoute("/admin/banners")({
  component: AdminBanners,
});

function AdminBanners() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
      <Card className="h-fit shadow-card">
        <CardContent className="p-6">
          <h2 className="text-lg font-bold">Nuevo banner</h2>
          <form className="mt-4 space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <Label htmlFor="b-img">Imagen (URL Cloudinary)</Label>
              <Input id="b-img" placeholder="https://res.cloudinary.com/..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="b-url">Enlace de destino</Label>
              <Input id="b-url" placeholder="https://..." />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Categoría</Label>
                <Select defaultValue="todas">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas</SelectItem>
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
                <Select defaultValue="todas">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas</SelectItem>
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
              <Label>Posición</Label>
              <Select defaultValue="top">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="top">Arriba del listado</SelectItem>
                  <SelectItem value="between">Entre resultados</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled>
              Crear banner
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {MOCK_BANNERS.map((b) => (
          <Card key={b.id} className="shadow-card">
            <CardContent className="flex flex-wrap items-center gap-4 p-4">
              <div className="grid h-16 w-28 shrink-0 place-items-center rounded-md bg-muted text-muted-foreground">
                <ImageIcon className="h-5 w-5" />
              </div>
              <div className="min-w-40 flex-1">
                <p className="text-sm font-semibold">
                  {b.category ? categoryLabel(b.category) : "Todas las categorías"} ·{" "}
                  {b.zone ? zoneLabel(b.zone) : "Todas las zonas"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Posición: {b.position === "top" ? "Arriba del listado" : "Entre resultados"}
                </p>
              </div>
              <Switch checked={b.active} aria-label="Activar banner" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
