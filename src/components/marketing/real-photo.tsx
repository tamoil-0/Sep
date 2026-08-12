import Image from "next/image";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Mapa editorial de recursos reales de SEP. Conservamos las rutas originales
 * para no romper referencias, pero los nombres semánticos documentan el uso
 * correcto de cada fotografía, captura o pieza gráfica.
 */
export const SEP_PHOTOS = {
  community: "/img/c00e2972-ab9a-449b-bf7a-c7f1b442baee.jpg",
  workshop: "/img/f29ad55a-cc0f-4df8-b4c8-b3a86d228ff7.jpg",
  team: "/img/13137c4b-37be-43c1-bd8a-7b1dfad4a659.jpg",
  methodology: "/img/4b94ec74-b5cc-4e92-ac59-e779ba21ca90.jpg",
  virtual: "/img/2ab58e3c-b9ee-4c0b-86db-9d68b390a6dd.jpg",
  alliance: "/img/daabcf2e-36b0-4669-92ae-6ef10e3942fb.jpg",
  heroPresentation: "/img/new_images/d768cd16-fbc4-46f4-abe9-cef81a6bb4f5.jpg",
  communityTeam: "/img/new_images/ef9bc2e3-9a1d-4649-b600-9c8b5f5dfa93.jpg",
  communityOutdoor: "/img/new_images/eb0c0c0d-70e5-4333-af8f-619380d02091.jpg",
  communityGroup: "/img/new_images/4499b7d3-f1fb-4d56-9ffc-779a66448463.jpg",
  eventPresence: "/img/new_images/3ea70c6c-d4d6-4f99-a92c-608202b0dc60.jpg",
  mentorsProgram: "/img/new_images/7961f3ed-4caf-4850-870b-86de787d1802.jpg",
  bootcampPoster: "/img/new_images/9d029a4f-71ec-444a-a943-ecc9b90f9781.jpg",
  northStarMediaPartner: "/img/new_images/2d6ab556-c603-4fe0-bdae-e322cf78f5cf.jpg",
  innovationMediaPartner: "/img/new_images/54e4f2cf-6422-4e2f-b1ea-27da7283063e.jpg",
  virtualBootcamp: "/img/new_images/287d0326-b7d0-4f21-b888-970b2c31d205.jpg",
  virtualTourism: "/img/new_images/e74d9629-0a1d-4e95-9a2f-b486731526e4.jpg",
  recognitionEvent: "/img/new_images/f65374c2-41a0-4c34-9874-28be325374e0.jpg",
} as const;

type MediaImageProps = {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  priority?: boolean;
  label?: string;
  kind?: "photo" | "poster";
};

export function MediaImage({
  src,
  alt,
  className,
  imageClassName,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  priority = false,
  label,
  kind = "photo",
}: MediaImageProps) {
  return (
    <figure
      className={cn(
        "group relative isolate min-h-56 overflow-hidden rounded-[20px] shadow-[0_18px_50px_-24px_rgba(18,16,28,.45)]",
        kind === "photo" ? "bg-sep-950" : "bg-surface-1",
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className={cn(
          "transition-transform duration-700 ease-out",
          kind === "photo"
            ? "object-cover group-hover:scale-[1.025]"
            : "object-contain p-3 sm:p-4",
          imageClassName,
        )}
      />
      {kind === "photo" && (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-sep-950/65 via-transparent to-transparent" />
      )}
      {label && (
        <figcaption
          className={cn(
            "absolute inset-x-0 bottom-0 flex items-center gap-2 p-4 text-xs font-medium sm:p-5",
            kind === "photo" ? "text-white" : "bg-white/92 text-graphite backdrop-blur-sm",
          )}
        >
          <MapPin className={cn("size-3.5", kind === "photo" ? "text-gold-500" : "text-sep-600")} />
          {label}
        </figcaption>
      )}
    </figure>
  );
}

export function RealPhoto(props: Omit<MediaImageProps, "kind">) {
  return <MediaImage {...props} kind="photo" />;
}

export function HeroPhoto() {
  return (
    <div className="relative mx-auto w-full max-w-[620px]">
      <RealPhoto
        src={SEP_PHOTOS.heroPresentation}
        alt="Expositora durante una actividad presencial de Semillero de Emprendedores Perú"
        priority
        sizes="(min-width: 1280px) 560px, (min-width: 1024px) 46vw, 92vw"
        label="Formación y liderazgo en acción"
        className="aspect-[4/3] min-h-0 rounded-[24px] border border-white/20"
        imageClassName="object-[52%_50%]"
      />
    </div>
  );
}

export function ExperienceGallery() {
  return (
    <div className="grid auto-rows-[180px] gap-3 sm:auto-rows-[220px] sm:grid-cols-2 lg:auto-rows-[250px] lg:grid-cols-12">
      <RealPhoto
        src={SEP_PHOTOS.workshop}
        alt="Jóvenes participando en una dinámica colaborativa de SEP"
        label="Aprender haciendo"
        className="min-h-0 sm:row-span-2 lg:col-span-7"
        sizes="(min-width: 1024px) 58vw, (min-width: 640px) 50vw, 100vw"
      />
      <RealPhoto
        src={SEP_PHOTOS.heroPresentation}
        alt="Presentación presencial durante una actividad de SEP"
        label="Compartir ideas"
        className="min-h-0 lg:col-span-5"
        imageClassName="object-[52%_48%]"
        sizes="(min-width: 1024px) 42vw, (min-width: 640px) 50vw, 100vw"
      />
      <RealPhoto
        src={SEP_PHOTOS.methodology}
        alt="Equipo desarrollando una propuesta con notas y herramientas ágiles"
        label="Metodologías aplicadas"
        className="min-h-0 lg:col-span-2"
        sizes="(min-width: 1024px) 17vw, (min-width: 640px) 50vw, 100vw"
      />
      <RealPhoto
        src={SEP_PHOTOS.communityTeam}
        alt="Comunidad juvenil reunida después de una actividad"
        label="Comunidad que se conecta"
        className="min-h-0 lg:col-span-3"
        imageClassName="object-[50%_46%]"
        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
      />
    </div>
  );
}
