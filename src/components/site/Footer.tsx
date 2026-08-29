import { Link } from "@tanstack/react-router";
import { CATEGORIES } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-secondary text-secondary-foreground">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
        <div>
          <p className="text-lg font-bold">
            Toen<span className="text-primary">Cuba</span>
          </p>
          <p className="mt-2 text-sm text-secondary-foreground/70">
            Directorio de hostales, taxis y restaurantes en Cuba. Contacto directo por WhatsApp,
            sin intermediarios.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Categorías</p>
          <ul className="mt-3 space-y-2 text-sm text-secondary-foreground/80">
            {CATEGORIES.map((c) => (
              <li key={c.value}>
                <Link to={c.path} className="hover:text-primary">
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Prestadores</p>
          <ul className="mt-3 space-y-2 text-sm text-secondary-foreground/80">
            <li>
              <Link to="/prestadores/registro" className="hover:text-primary">
                Registrar mi negocio
              </Link>
            </li>
            <li>
              <Link to="/prestadores/dashboard" className="hover:text-primary">
                Panel del prestador
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-secondary-foreground/60">
        © {new Date().getFullYear()} ToenCuba
      </div>
    </footer>
  );
}
