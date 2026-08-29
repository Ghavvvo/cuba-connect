import { useQuery } from "@tanstack/react-query";
import { fetchBanners } from "@/lib/queries";
import { optimizedImage } from "@/lib/constants";

export function BannerSlot({
  category,
  zone,
  position = "top",
}: {
  category?: string | null;
  zone?: string | null;
  position?: "top" | "between";
}) {
  const { data } = useQuery({
    queryKey: ["banners", category ?? null, zone ?? null],
    queryFn: () => fetchBanners(category, zone),
  });

  const banners = (data ?? []).filter((b) => (b.position ?? "top") === position);
  if (!banners.length) return null;

  return (
    <div className="space-y-3">
      {banners.map((b) => (
        <a
          key={b.id}
          href={b.target_url ?? "#"}
          target="_blank"
          rel="noreferrer"
          className="block overflow-hidden rounded-xl border border-border"
        >
          <img
            src={optimizedImage(b.image_url, 1200)}
            alt="Espacio publicitario patrocinado"
            loading="lazy"
            className="h-auto w-full object-cover"
          />
        </a>
      ))}
    </div>
  );
}
