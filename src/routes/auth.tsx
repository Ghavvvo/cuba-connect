import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Entrar o crear cuenta | ToenCuba" },
      {
        name: "description",
        content:
          "Accede a tu panel de prestador en ToenCuba para ver tus estadísticas y tu posición en el ranking.",
      },
      { property: "og:title", content: "Entrar a ToenCuba" },
      {
        property: "og:description",
        content: "Panel de prestadores de hostales, taxis y restaurantes en Cuba.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const demo = (e: React.FormEvent) => {
    e.preventDefault();
    toast.info("Demo de interfaz: el inicio de sesión aún no está conectado.");
  };

  return (
    <main className="mx-auto flex max-w-md flex-col px-4 py-14">
      <h1 className="text-center text-3xl font-bold">Acceso de prestadores</h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        Gestiona tu negocio, revisa tus estadísticas y sube en el ranking.
      </p>

      <Card className="mt-8 shadow-card">
        <CardHeader>
          <CardTitle>Bienvenido</CardTitle>
          <CardDescription>Entra con tu correo o crea una cuenta nueva.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Entrar</TabsTrigger>
              <TabsTrigger value="signup">Crear cuenta</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form className="mt-4 space-y-4" onSubmit={demo}>
                <div className="space-y-2">
                  <Label htmlFor="login-email">Correo</Label>
                  <Input id="login-email" type="email" placeholder="tucorreo@ejemplo.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-pass">Contraseña</Label>
                  <Input id="login-pass" type="password" placeholder="••••••••" required />
                </div>
                <Button type="submit" className="w-full">
                  Entrar
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form className="mt-4 space-y-4" onSubmit={demo}>
                <div className="space-y-2">
                  <Label htmlFor="su-name">Nombre</Label>
                  <Input id="su-name" placeholder="Yanet Pérez" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="su-email">Correo</Label>
                  <Input id="su-email" type="email" placeholder="tucorreo@ejemplo.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="su-wa">WhatsApp</Label>
                  <Input id="su-wa" placeholder="+53 5 000 0000" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="su-pass">Contraseña</Label>
                  <Input id="su-pass" type="password" placeholder="••••••••" required />
                </div>
                <Button type="submit" className="w-full">
                  Crear cuenta
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            ¿Aún no publicaste tu negocio?{" "}
            <Link to="/prestadores/registro" className="font-medium text-primary">
              Regístralo aquí
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
