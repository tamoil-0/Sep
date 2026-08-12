import Image from "next/image";

import { Logo } from "@/components/brand/logo";
import { SEP_PHOTOS } from "@/components/marketing/real-photo";
import { cn } from "@/lib/utils";

type CoursePhoto = {
  src: string;
  alt: string;
  position?: string;
};

const coursePhotos: Record<string, CoursePhoto> = {
  "design-thinking-aplicado": {
    src: SEP_PHOTOS.workshop,
    alt: "Participantes de SEP resolviendo un reto colaborativo durante un taller",
    position: "50% 48%",
  },
  "scrum-proyectos-sociales": {
    src: SEP_PHOTOS.team,
    alt: "Equipo juvenil de SEP reunido durante una sesión de trabajo",
    position: "50% 42%",
  },
  "liderazgo-impacto-regional": {
    src: SEP_PHOTOS.communityOutdoor,
    alt: "Jóvenes reunidos como parte de una experiencia de comunidad y liderazgo",
    position: "50% 45%",
  },
  "metodologias-agiles-en-el-aula": {
    src: SEP_PHOTOS.methodology,
    alt: "Jóvenes analizando ideas y hallazgos durante una actividad práctica",
    position: "50% 48%",
  },
};

export function CourseMedia({
  slug,
  title,
  category,
  coverUrl,
  className,
  priority = false,
}: {
  slug: string;
  title: string;
  category?: string | null;
  coverUrl?: string | null;
  className?: string;
  priority?: boolean;
}) {
  const mappedPhoto = coursePhotos[slug];
  const src = coverUrl ?? mappedPhoto?.src;

  if (src) {
    return (
      <figure
        className={cn(
          "group relative isolate overflow-hidden rounded-[12px] bg-sep-950",
          className,
        )}
      >
        <Image
          src={src}
          alt={coverUrl ? `Portada del curso ${title}` : (mappedPhoto?.alt ?? `Portada del curso ${title}`)}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 28vw, (min-width: 640px) 48vw, 92vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.025]"
          style={{ objectPosition: mappedPhoto?.position }}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-sep-950/45 via-transparent to-transparent" />
      </figure>
    );
  }

  return (
    <div
      role="img"
      aria-label={`Portada visual SEP para ${title}`}
      className={cn(
        "relative isolate overflow-hidden rounded-[12px] sep-gradient text-white",
        className,
      )}
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />
      <div aria-hidden className="absolute -right-12 -top-16 size-44 rounded-full border-[24px] border-white/10" />
      <div className="relative flex h-full min-h-36 flex-col justify-between p-5">
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-gold-500">
          {category ?? "Programa SEP"}
        </span>
        <div>
          <Logo className="h-12" variant="white" />
          <p className="mt-1 max-w-[85%] text-sm font-medium leading-snug text-white/90">
            {title}
          </p>
        </div>
      </div>
    </div>
  );
}
