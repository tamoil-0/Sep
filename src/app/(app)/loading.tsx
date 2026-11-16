import { CargandoSEP } from "@/components/ui/cargando-sep";

/** Carga de cualquier vista del panel: el sidebar sigue en su lugar (layout). */
export default function AppLoading() {
  return <CargandoSEP mensaje="Preparando tu panel…" />;
}
