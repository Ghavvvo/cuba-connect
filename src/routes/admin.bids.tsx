import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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

export const Route = createFileRoute("/admin/bids")({
  component: AdminBids,
});

function AdminBids() {
  const ranked = [...MOCK_PROPERTIES].sort(
    (a, b) =>
      b.bid_amount - a.bid_amount ||
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  return (
    <Card className="shadow-card">
      <CardContent className="overflow-x-auto p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">#</TableHead>
              <TableHead>Negocio</TableHead>
              <TableHead>Categoría / Zona</TableHead>
              <TableHead className="w-40">Puja (USD)</TableHead>
              <TableHead className="text-right">Guardar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ranked.map((p, i) => (
              <TableRow key={p.id}>
                <TableCell className="font-bold text-primary">{i + 1}</TableCell>
                <TableCell className="font-medium">{p.name}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {categoryLabel(p.category)} · {zoneLabel(p.zone)}
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    defaultValue={p.bid_amount}
                    aria-label={`Puja de ${p.name}`}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <Button size="sm" disabled>
                    Actualizar
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
