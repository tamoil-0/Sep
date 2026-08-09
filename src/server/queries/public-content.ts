import "server-only";
import { unstable_cache } from "next/cache";
import { createPublicClient } from "@/lib/supabase/public";

export const getPublishedPosts = unstable_cache(
  async () => {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("blog_posts")
      .select("id, slug, title, excerpt, tags, published_at, profiles(full_name)")
      .eq("is_published", true)
      .order("published_at", { ascending: false });
    return data ?? [];
  },
  ["public-blog-posts-v1"],
  { revalidate: 300, tags: ["public-blog"] },
);

export const getPublicProjects = unstable_cache(
  async () => {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("projects")
      .select("id, title, problem, solution, region")
      .eq("is_public", true)
      .limit(6);
    return data ?? [];
  },
  ["public-projects-v1"],
  { revalidate: 300, tags: ["public-projects"] },
);

export const getSchoolNetwork = unstable_cache(
  async () => {
    const supabase = createPublicClient();
    const [{ data: schools }, { count: workshops }, { count: students }] =
      await Promise.all([
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

    return { schools: schools ?? [], workshops: workshops ?? 0, students: students ?? 0 };
  },
  ["public-school-network-v1"],
  { revalidate: 300, tags: ["public-schools"] },
);
