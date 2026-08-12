import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/session";
import { getCatalog, getMyEnrollments } from "@/server/queries/courses";
import { PageHeader } from "@/components/app/page-header";
import { CourseCatalog } from "@/components/app/course-catalog";

export const metadata: Metadata = { title: "Catálogo de cursos" };

export default async function CatalogoPage() {
  const user = await requireRole(["estudiante", "mentor", "admin", "super_admin"]);
  const [courses, enrollments] = await Promise.all([
    getCatalog(),
    getMyEnrollments(user.id),
  ]);

  const enrolledIds = new Set(
    enrollments.map((e) => e.course?.id).filter(Boolean) as string[],
  );

  return (
    <>
      <PageHeader
        title="Catálogo de cursos"
        description="Formación práctica para llevar ideas a la acción. Revisa la modalidad, disponibilidad y condiciones de cada curso."
      />
      <CourseCatalog
        courses={courses.map((c) => ({
          id: c.id,
          slug: c.slug,
          title: c.title,
          subtitle: c.subtitle,
          description: c.description,
          category: c.category,
          audience: c.audience,
          status: c.status,
          totalHours: Number(c.total_hours),
          sessionsCount: c.sessions_count,
          weeks: c.weeks,
          isFree: c.is_free,
          priceCents: c.price_cents,
          coverUrl: c.cover_url,
          enrolled: enrolledIds.has(c.id),
        }))}
      />
    </>
  );
}
