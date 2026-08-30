import { createFileRoute } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { categoryLabel, zoneLabel } from "@/lib/constants";
import { MOCK_PROPERTIES } from "@/lib/mock";

export const Route = createFileRoute("/admin/")({
  component: AdminProperties,
});

function AdminProperties() {
  return (
    <Card className="shadow-card">
      <CardContent className="overflow-x-auto p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Negocio</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Zona</TableHead>
              <TableHead>Puja</TableHead>
              <TableHead>Subdominio</TableHead>
              <TableHead>Activo</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_PROPERTIES.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.name}</TableCell>
                <TableCell>{categoryLabel(p.category)}</TableCell>
                <TableCell>{zoneLabel(p.zone)}</TableCell>
                <TableCell>{p.bid_amount} USD</TableCell>
                <TableCell>
                  {p.subdomain ? (
                    <Badge variant="secondary">{p.subdomain}.toencuba.app</Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <Switch checked={p.active} aria-label={`Activar ${p.name}`} />
                </TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="secondary" disabled>
                    Editar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
