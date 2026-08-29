import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PropertyCard } from "./PropertyCard";
import { BannerSlot } from "./BannerSlot";
import { fetchLeaderboard } from "@/lib/queries";
import { ZONES, categoryLabel } from "@/lib/constants";

export function CategoryPage({
  category,
  zona,
  routeTo,
  intro,
}: {
  category: string;
  zona?: string;
  routeTo: string;
  intro: string;
}) {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ["leaderboard", category, zona ?? null],
    queryFn: () => fetchLeaderboard(category, zona ?? null),
  });

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-3xl font-bold sm:text-4xl">{categoryLabel(category)} en Cuba</h1>
      <p className="mt-2 text-muted-foreground">{intro}</p>

      <div className="mt-6">
        <BannerSlot category={category} zone={zona} position="top" />
      </div>

      <div className="mt-6 flex items-center gap-3">
        <Select
          value={zona ?? "todas"}
          onValueChange={(v) =>
            navigate({
              to: routeTo,
              search: v === "todas" ? {} : { zona: v },
            })
          }
        >
          <SelectTrigger className="w-56">
            <SelectValue placeholder="Todas las zonas" />
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
        {!isLoading && (
          <span className="text-sm text-muted-foreground">{data?.length ?? 0} resultados</span>
        )}
      </div>

      <div className="mt-6 space-y-4">
        {isLoading &&
          [0, 1, 2].map((i) => <Skeleton key={i} className="h-44 w-full rounded-xl" />)}

        {!isLoading && data?.length === 0 && (
          <p className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground">
            Todavía no hay negocios activos en esta zona.
          </p>
        )}

        {data?.map((p, i) => (
          <div key={p.id} className="space-y-4">
            <PropertyCard property={p} rank={i + 1} />
            {i === 2 && <BannerSlot category={category} zone={zona} position="between" />}
          </div>
        ))}
      </div>
    </main>
  );
}
