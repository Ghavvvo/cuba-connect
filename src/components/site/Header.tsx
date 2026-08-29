import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CATEGORIES } from "@/lib/constants";
import { useAuth } from "@/hooks/useAuth";

const navLinkClass =
  "text-sm font-medium text-secondary-foreground/80 transition-colors hover:text-primary";

export function Header() {
  const { user } = useAuth();

  const links = (
    <>
      {CATEGORIES.map((c) => (
        <Link key={c.value} to={c.path} className={navLinkClass}>
          {c.label}
        </Link>
      ))}
      <Link to="/prestadores/registro" className={navLinkClass}>
        Publicar mi negocio
      </Link>
      <Link to={user ? "/prestadores/dashboard" : "/auth"} className={navLinkClass}>
        {user ? "Mi panel" : "Entrar"}
      </Link>
    </>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-secondary text-secondary-foreground">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand text-base font-bold text-primary-foreground">
            T
          </span>
          <span className="text-lg font-bold tracking-tight">
            Toen<span className="text-primary">Cuba</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">{links}</nav>

        <div className="hidden md:block">
          <Button asChild size="sm">
            <Link to="/prestadores/registro">Quiero aparecer</Link>
          </Button>
        </div>

        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" aria-label="Abrir menú">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-64">
            <nav className="mt-10 flex flex-col gap-5">{links}</nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
