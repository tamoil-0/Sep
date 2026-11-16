import { Container } from "@/components/ui/primitives";
import { CourseSkeleton } from "@/components/ui/course-skeleton";

/** Ficha pública del curso: silueta inmediata al navegar entre cursos. */
export default function CursoPublicoLoading() {
  return (
    <Container size="wide" className="py-8 sm:py-10">
      <CourseSkeleton dark />
    </Container>
  );
}
