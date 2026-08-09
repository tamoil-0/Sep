import Image from "next/image";
import { Camera, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export const SEP_PHOTOS = {
  community: "/img/c00e2972-ab9a-449b-bf7a-c7f1b442baee.jpg",
  workshop: "/img/f29ad55a-cc0f-4df8-b4c8-b3a86d228ff7.jpg",
  team: "/img/13137c4b-37be-43c1-bd8a-7b1dfad4a659.jpg",
  methodology: "/img/4b94ec74-b5cc-4e92-ac59-e779ba21ca90.jpg",
  virtual: "/img/2ab58e3c-b9ee-4c0b-86db-9d68b390a6dd.jpg",
  alliance: "/img/daabcf2e-36b0-4669-92ae-6ef10e3942fb.jpg",
} as const;

export function RealPhoto({
  src,
  alt,
  className,
  imageClassName,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  priority = false,
  label,
}: {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  priority?: boolean;
  label?: string;
}) {
  return (
    <figure
      className={cn(
        "group relative isolate min-h-56 overflow-hidden rounded-[20px] bg-sep-950 shadow-[0_18px_50px_-24px_rgba(18,16,28,.45)]",
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
          "object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]",
          imageClassName,
        )}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-sep-950/70 via-transparent to-transparent" />
      {label && (
        <figcaption className="absolute inset-x-0 bottom-0 flex items-center gap-2 p-4 text-xs font-medium text-white sm:p-5">
          <MapPin className="size-3.5 text-gold-500" />
          {label}
        </figcaption>
      )}
    </figure>
  );
}

export function HeroPhoto() {
  return (
    <div className="relative mx-auto w-full max-w-[620px] pb-7 sm:pb-10">
      <RealPhoto
        src={SEP_PHOTOS.community}
        alt="Comunidad de jóvenes de SEP reunida al finalizar un taller"
        priority
        sizes="(min-width: 1280px) 560px, (min-width: 1024px) 46vw, 92vw"
        label="Comunidad SEP · Áncash"
        className="aspect-[4/3] min-h-0 border border-white/20 rounded-[24px]"
        imageClassName="object-[50%_78%]"
      />
      <div className="absolute -bottom-1 -left-2 hidden w-[42%] rounded-[16px] border-4 border-sep-700 bg-white p-1.5 shadow-2xl sm:block lg:-left-7">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[11px]">
          <Image
            src={SEP_PHOTOS.methodology}
            alt="Jóvenes trabajando una metodología ágil en equipo"
            fill
            sizes="220px"
            className="object-cover"
          />
        </div>
      </div>
      <div className="absolute -right-2 bottom-3 rounded-full border border-white/20 bg-white/95 px-3.5 py-2 text-xs font-semibold text-sep-800 shadow-xl sm:bottom-5 lg:-right-4">
        <span className="flex items-center gap-2">
          <Camera className="size-3.5 text-sep-600" />
          Impacto real
        </span>
      </div>
    </div>
  );
}

export function ExperienceGallery() {
  return (
    <div className="grid auto-rows-[180px] gap-3 sm:auto-rows-[220px] sm:grid-cols-2 lg:auto-rows-[250px] lg:grid-cols-3">
      <RealPhoto
        src={SEP_PHOTOS.workshop}
        alt="Jóvenes participando en una dinámica colaborativa de SEP"
        label="Aprender haciendo"
        className="min-h-0 sm:row-span-2 lg:col-span-2"
        sizes="(min-width: 1024px) 66vw, (min-width: 640px) 50vw, 100vw"
      />
      <RealPhoto
        src={SEP_PHOTOS.team}
        alt="Equipo de jóvenes durante una sesión de trabajo de SEP"
        label="Equipos con propósito"
        className="min-h-0"
        sizes="(min-width: 640px) 33vw, 100vw"
      />
      <RealPhoto
        src={SEP_PHOTOS.methodology}
        alt="Equipo desarrollando una propuesta con notas y herramientas ágiles"
        label="Metodologías aplicadas"
        className="min-h-0"
        sizes="(min-width: 640px) 33vw, 100vw"
      />
    </div>
  );
}
