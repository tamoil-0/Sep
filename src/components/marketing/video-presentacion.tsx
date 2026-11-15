import { cn } from "@/lib/utils";

/**
 * Video de presentación de SEP (20 s, con subtítulos incrustados).
 * Original de 29 MB comprimido a 720p (4,4 MB); `preload="none"`: no se
 * descarga hasta que alguien le da play, así no pesa en la carga de la página.
 */
export function VideoPresentacion({ className }: { className?: string }) {
  return (
    <figure className={cn("overflow-hidden rounded-lg bg-surface-0 shadow-elevated ring-1 ring-line", className)}>
      <video
        className="aspect-video w-full bg-noche-950 object-cover"
        controls
        playsInline
        preload="none"
        poster="/video/sep-presentacion-portada.jpg"
        aria-label="Video de presentación de Semillero de Emprendedores Perú: el fundador cuenta cómo nació SEP el 7 de abril de 2024 y presenta al equipo."
      >
        <source src="/video/sep-presentacion.mp4" type="video/mp4" />
        Tu navegador no puede reproducir este video.
      </video>
      <figcaption className="px-4 py-3 text-caption text-slate-ui">
        Así nació SEP: presentación del equipo fundador (20 s, con subtítulos).
      </figcaption>
    </figure>
  );
}
