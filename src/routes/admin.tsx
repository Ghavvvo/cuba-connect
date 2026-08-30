import { createFileRoute, Link, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Panel de administración | ToenCuba" },
      {
        name: "description",
        content: "Gestión interna de negocios, pujas y banners publicitarios de ToenCuba.",
      },
      { property: "og:title", content: "Panel de administración | ToenCuba" },
      { property: "og:description", content: "Gestión de negocios, pujas y banners." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLayout,
});

const TABS = [
  { to: "/admin", label: "Negocios" },
  { to: "/admin/bids", label: "Pujas" },
  { to: "/admin/banners", label: "Banners" },
] as const;

function AdminLayout() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold">Administración</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Vista de demostración con datos de ejemplo.
      </p>
      <nav className="mt-6 flex flex-wrap gap-2 border-b border-border pb-3">
        {TABS.map((t) => (
          <Link
            key={t.to}
            to={t.to}
            activeOptions={{ exact: t.to === "/admin" }}
            className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            activeProps={{ className: "bg-accent/60 text-foreground" }}
          >
            {t.label}
          </Link>
        ))}
      </nav>
      <div className="mt-8">
        <Outlet />
      </div>
    </main>
  );
}
