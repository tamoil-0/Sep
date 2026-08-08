import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/app/page-header";
import { ApplicationBoard } from "./application-board";

export const metadata: Metadata = { title: "Postulaciones" };

export default async function AdminPostulacionesPage() {
  await requireRole(["admin", "super_admin"]);
  const supabase = await createClient();

  const [{ data: volunteers }, { data: speakers }, { data: hours }] =
    await Promise.all([
      supabase
        .from("volunteer_applications")
        .select(
          "id, full_name, email, phone, region, university, career_cycle, motivation, completed_courses, status, created_at, user_id, volunteer_roles(name, type)",
        )
        .order("created_at", { ascending: false })
        .limit(150),
      supabase
        .from("speaker_profiles")
        .select(
          "id, full_name, email, country, region, expertise, topics, story, talk_experience, availability, is_approved, is_public, created_at",
        )
        .order("created_at", { ascending: false })
        .limit(100),
      supabase
        .from("volunteer_hours")
        .select("id, date, hours, activity, approved_at, profiles(full_name, region)")
        .is("approved_at", null)
        .order("date", { ascending: false })
        .limit(60),
    ]);

  return (
    <>
      <PageHeader
        title="Postulaciones"
        description="Voluntariado, speakers y horas de voluntariado por aprobar. Aprobar una postulación otorga el rol automáticamente."
      />

      <ApplicationBoard
        volunteers={(volunteers ?? []).map((v) => {
          const role = Array.isArray(v.volunteer_roles)
            ? v.volunteer_roles[0]
            : v.volunteer_roles;
          return {
            id: v.id,
            name: v.full_name,
            email: v.email,
            phone: v.phone,
            region: v.region,
            university: v.university,
            careerCycle: v.career_cycle,
            motivation: v.motivation,
            completedCourses: v.completed_courses,
            status: v.status,
            createdAt: v.created_at,
            hasAccount: !!v.user_id,
            roleName: role?.name ?? "—",
          };
        })}
        speakers={(speakers ?? []).map((s) => ({
          id: s.id,
          name: s.full_name,
          email: s.email,
          location: [s.region, s.country].filter(Boolean).join(", "),
          expertise: s.expertise,
          topics: s.topics ?? [],
          story: s.story,
          experience: s.talk_experience,
          availability: s.availability,
          approved: s.is_approved,
          createdAt: s.created_at,
        }))}
        hours={(hours ?? []).map((h) => {
          const p = Array.isArray(h.profiles) ? h.profiles[0] : h.profiles;
          return {
            id: h.id,
            date: h.date,
            hours: Number(h.hours),
            activity: h.activity,
            volunteerName: p?.full_name ?? "—",
            region: p?.region ?? null,
          };
        })}
      />
    </>
  );
}
