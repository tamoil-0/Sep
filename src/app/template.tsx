import { PaginaEntra } from "@/components/ui/pagina-entra";

/**
 * Template de SERVIDOR: solo pasa `children` al componente cliente. Si el
 * template fuera "use client", Next le serializa sus props y eso impide
 * prerenderizar las páginas (todas quedaban dinámicas y lentas).
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <PaginaEntra>{children}</PaginaEntra>;
}
