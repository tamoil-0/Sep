import "server-only";
import { unstable_cache } from "next/cache";
import { createPublicClient } from "@/lib/supabase/public";
import { assertQueryResults } from "@/lib/supabase/query";

export const getPublishedPosts = unstable_cache(
  async () => {
    const supabase = createPublicClient();
    const result = await supabase
      .from("blog_posts")
      .select("id, slug, title, excerpt, cover_url, tags, published_at")
      .eq("is_published", true)
      .order("published_at", { ascending: false });
    assertQueryResults("publico:blog", result);
    return result.data ?? [];
  },
  ["public-blog-posts-v2"],
  { revalidate: 300, tags: ["public-blog"] },
);

export const getPublicProjects = unstable_cache(
  async () => {
    const supabase = createPublicClient();
    const result = await supabase
      .from("projects")
      .select("id, title, problem, solution, region")
      .eq("is_public", true)
      .limit(6);
    assertQueryResults("publico:proyectos", result);
    return result.data ?? [];
  },
  ["public-projects-v1"],
  { revalidate: 300, tags: ["public-projects"] },
);

export const getSchoolNetwork = unstable_cache(
  async () => {
    const supabase = createPublicClient();
    const [schoolsResult, workshopsResult, studentsResult] = await Promise.all([
        supabase
          .from("institutions")
          .select("id, name, region, province")
          .eq("type", "colegio")
          .eq("is_verified", true)
          .limit(12),
        supabase
          .from("workshops")
          .select("id", { count: "exact", head: true })
          .eq("status", "realizado"),
        supabase
          .from("workshop_attendees")
          .select("id", { count: "exact", head: true })
          .eq("attended", true),
      ]);
    assertQueryResults("publico:colegios", schoolsResult, workshopsResult, studentsResult);
    const schools = schoolsResult.data;
    const workshops = workshopsResult.count;
    const students = studentsResult.count;

    return { schools: schools ?? [], workshops: workshops ?? 0, students: students ?? 0 };
  },
  ["public-school-network-v1"],
  { revalidate: 300, tags: ["public-schools"] },
);
