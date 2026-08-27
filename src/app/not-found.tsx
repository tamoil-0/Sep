import { ArrowLeft, Compass } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { getSessionUser } from "@/lib/auth/session";
import { ContextualHelp } from "@/components/ui/contextual-help";

export default async function NotFound() {
  const user = await getSessionUser();
  return (
    <main id="contenido" className="flex min-h-dvh items-center justify-center bg-surface-1 px-4 py-12">
      <div className="w-full max-w-lg text-center">
        <Logo className="mx-auto h-12" />
        <span className="mx-auto mt-10 flex size-14 items-center justify-center rounded-lg bg-sep-50 text-sep-600">
          <Compass className="size-6" />
        </span>
        <p className="mt-6 text-caption font-semibold uppercase tracking-[.12em] text-sep-600">Error 404</p>
        <h1 className="mt-2 font-display text-h1 font-semibold text-ink">Esta página no está aquí</h1>
        <p className="mx-auto mt-3 max-w-md text-body text-slate-ui">
          Puede que el enlace haya cambiado o ya no esté disponible. Puedes volver al inicio o explorar los programas de SEP.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Button href={user ? "/panel" : "/"} variant="primary">
            <ArrowLeft />{user ? "Volver a mi panel" : "Ir al inicio"}
          </Button>
          <Button href="/cursos" variant="outline">Explorar programas</Button>
        </div>
        <ContextualHelp
          className="mt-8"
          title="¿Llegaste aquí desde un enlace de SEP?"
          description="Envíanos el enlace que intentabas abrir para ayudarte a encontrar la página correcta."
        />
      </div>
    </main>
  );
}
