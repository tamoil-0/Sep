import type { Metadata } from "next";
import { MapPin, Users } from "lucide-react";
import { requireRole } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { PageHeader, Kpi, KpiGrid } from "@/components/app/page-header";
import { Feed } from "./feed";

export const metadata: Metadata = { title: "Comunidad SEP" };

export default async function ComunidadPage() {
  const user = await requireRole(["estudiante", "mentor", "admin", "super_admin"]);
  const supabase = await createClient();

  const [{ data: posts }, { count: members }, { data: regionRows }, { data: myLikes }] =
    await Promise.all([
      supabase
        .from("posts")
        .select(
          "id, content, created_at, likes_count, is_pinned, user_id, profiles(full_name, region, avatar_url)",
        )
        .eq("is_hidden", false)
        .order("is_pinned", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(40),
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("profiles").select("region").not("region", "is", null),
      supabase.from("post_likes").select("post_id").eq("user_id", user.id),
    ]);

  // Comentarios en una sola consulta para las publicaciones visibles,
  // en lugar de una por post.
  const postIds = (posts ?? []).map((p) => p.id);
  const { data: allComments } = postIds.length
    ? await supabase
        .from("comments")
        .select("id, post_id, content, created_at, profiles(full_name)")
        .in("post_id", postIds)
        .eq("is_hidden", false)
        .order("created_at")
    : { data: [] };

  const commentsByPost = new Map<
    string,
    { id: string; content: string; createdAt: string; authorName: string }[]
  >();

  for (const c of allComments ?? []) {
    const author = Array.isArray(c.profiles) ? c.profiles[0] : c.profiles;
    const list = commentsByPost.get(c.post_id) ?? [];
    list.push({
      id: c.id,
      content: c.content,
      createdAt: c.created_at,
      authorName: author?.full_name ?? "Miembro SEP",
    });
    commentsByPost.set(c.post_id, list);
  }

  const liked = new Set((myLikes ?? []).map((l) => l.post_id));
  const regions = new Set((regionRows ?? []).map((r) => r.region));

  const feed = (posts ?? []).map((p) => {
    const author = Array.isArray(p.profiles) ? p.profiles[0] : p.profiles;
    return {
      id: p.id,
      content: p.content,
      createdAt: p.created_at,
      likes: p.likes_count,
      isPinned: p.is_pinned,
      isMine: p.user_id === user.id,
      liked: liked.has(p.id),
      authorName: author?.full_name ?? "Miembro SEP",
      authorRegion: author?.region ?? null,
      comments: commentsByPost.get(p.id) ?? [],
    };
  });

  return (
    <>
      <PageHeader
        title="Comunidad SEP"
        description="Comparte lo que estás construyendo. Aquí nadie está solo."
      />

      <KpiGrid>
        <Kpi label="Miembros" value={members ?? 0} icon={<Users className="size-4" />} />
        <Kpi label="Regiones activas" value={regions.size} icon={<MapPin className="size-4" />} />
        <Kpi label="Publicaciones" value={feed.length} />
        <Kpi
          label="Tu región"
          value={user.region ?? "—"}
          hint="Conecta con gente cerca"
        />
      </KpiGrid>

      <div className="mt-8">
        <Feed posts={feed} currentUserName={user.fullName} />
      </div>
    </>
  );
}
