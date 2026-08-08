"use client";

import * as React from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { Heart, Loader2, MessageCircle, Pin, Send } from "lucide-react";
import {
  createCommentAction,
  createPostAction,
  toggleLikeAction,
} from "@/server/actions/learning";
import { Badge, Card, EmptyState } from "@/components/ui/primitives";
import { Textarea } from "@/components/forms/field";
import { initials, relativeTime, cn } from "@/lib/utils";
import type { ActionResult } from "@/lib/result";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  authorName: string;
}

interface Post {
  id: string;
  content: string;
  createdAt: string;
  likes: number;
  isPinned: boolean;
  isMine: boolean;
  liked: boolean;
  authorName: string;
  authorRegion: string | null;
  comments: Comment[];
}

function PostButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-9 items-center gap-2 rounded-[8px] bg-sep-600 px-4 text-sm font-medium text-white transition-colors hover:bg-sep-700 disabled:opacity-60"
    >
      {pending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-3.5" />}
      Publicar
    </button>
  );
}

export function Feed({
  posts,
  currentUserName,
}: {
  posts: Post[];
  currentUserName: string;
}) {
  const router = useRouter();
  const [state, action] = useActionState<ActionResult<unknown> | null, FormData>(
    createPostAction,
    null,
  );
  const formRef = React.useRef<HTMLFormElement>(null);
  const [openComments, setOpenComments] = React.useState<string | null>(null);
  const [commentText, setCommentText] = React.useState("");
  const [busy, setBusy] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (state?.ok) {
      formRef.current?.reset();
      router.refresh();
    }
  }, [state, router]);

  async function like(postId: string) {
    setBusy(postId);
    await toggleLikeAction(postId);
    setBusy(null);
    router.refresh();
  }

  async function comment(postId: string) {
    if (commentText.trim().length < 1) return;
    setBusy(postId);
    const result = await createCommentAction(postId, commentText);
    setBusy(null);
    if (result.ok) {
      setCommentText("");
      router.refresh();
    }
  }

  return (
    <>
      {/* Composer */}
      <Card className="mb-5">
        <form ref={formRef} action={action}>
          <div className="flex gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full sep-gradient text-xs font-semibold text-white">
              {initials(currentUserName)}
            </span>
            <div className="min-w-0 flex-1">
              <Textarea
                name="content"
                placeholder="¿Qué estás construyendo? Comparte un avance, una duda o un logro."
                rows={3}
                required
                minLength={3}
                maxLength={4000}
                aria-label="Escribe tu publicación"
              />
              <div className="mt-3 flex items-center justify-between gap-3">
                <p className="text-xs text-mist">
                  Sé amable. Esta comunidad existe para sostenernos.
                </p>
                <PostButton />
              </div>
            </div>
          </div>
        </form>

        {state && !state.ok && state.error && (
          <p className="mt-3 rounded-[8px] bg-danger-bg px-3.5 py-2 text-sm text-danger" role="alert">
            {state.error}
          </p>
        )}
      </Card>

      {/* Feed */}
      {posts.length === 0 ? (
        <EmptyState
          icon={<MessageCircle className="size-5" />}
          title="Todavía no hay publicaciones"
          description="Sé el primero en compartir algo con la comunidad."
        />
      ) : (
        <div className="space-y-3">
          {posts.map((p) => (
            <Card key={p.id} className="p-5">
              {p.isPinned && (
                <Badge tone="gold" className="mb-3">
                  <Pin className="size-3" />
                  Fijado por el equipo SEP
                </Badge>
              )}

              <div className="flex gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full sep-gradient text-xs font-semibold text-white">
                  {initials(p.authorName)}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-2">
                    <p className="text-sm font-medium text-ink">{p.authorName}</p>
                    {p.authorRegion && (
                      <span className="text-xs text-slate-ui">· {p.authorRegion}</span>
                    )}
                    <span className="text-xs text-mist">· {relativeTime(p.createdAt)}</span>
                  </div>

                  <p className="mt-2 whitespace-pre-line text-[0.9375rem] leading-relaxed text-graphite">
                    {p.content}
                  </p>

                  {/* Acciones */}
                  <div className="mt-3.5 flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => like(p.id)}
                      disabled={busy === p.id}
                      className={cn(
                        "inline-flex items-center gap-1.5 text-xs transition-colors disabled:opacity-50",
                        p.liked
                          ? "font-medium text-danger"
                          : "text-slate-ui hover:text-ink",
                      )}
                      aria-pressed={p.liked}
                    >
                      <Heart className={cn("size-4", p.liked && "fill-current")} />
                      {p.likes > 0 && <span className="tabular">{p.likes}</span>}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setOpenComments(openComments === p.id ? null : p.id)
                      }
                      className="inline-flex items-center gap-1.5 text-xs text-slate-ui transition-colors hover:text-ink"
                      aria-expanded={openComments === p.id}
                    >
                      <MessageCircle className="size-4" />
                      {p.comments.length > 0 ? (
                        <span className="tabular">{p.comments.length}</span>
                      ) : (
                        "Comentar"
                      )}
                    </button>
                  </div>

                  {/* Comentarios */}
                  {(openComments === p.id || p.comments.length > 0) && (
                    <div className="mt-4 space-y-3 border-t border-line pt-4">
                      {p.comments.map((c) => (
                        <div key={c.id} className="flex gap-2.5">
                          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-surface-2 text-[0.625rem] font-semibold text-graphite">
                            {initials(c.authorName)}
                          </span>
                          <div className="min-w-0">
                            <p className="text-xs">
                              <span className="font-medium text-ink">{c.authorName}</span>
                              <span className="ml-1.5 text-mist">
                                {relativeTime(c.createdAt)}
                              </span>
                            </p>
                            <p className="mt-0.5 text-sm leading-relaxed text-graphite">
                              {c.content}
                            </p>
                          </div>
                        </div>
                      ))}

                      {openComments === p.id && (
                        <div className="flex gap-2">
                          <input
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                comment(p.id);
                              }
                            }}
                            placeholder="Escribe un comentario…"
                            maxLength={2000}
                            aria-label="Escribe un comentario"
                            className="h-9 flex-1 rounded-[8px] border border-line bg-white px-3 text-sm outline-none placeholder:text-mist focus:border-sep-400"
                          />
                          <button
                            type="button"
                            onClick={() => comment(p.id)}
                            disabled={busy === p.id || commentText.trim().length < 1}
                            className="inline-flex size-9 items-center justify-center rounded-[8px] bg-sep-600 text-white transition-colors hover:bg-sep-700 disabled:opacity-40"
                            aria-label="Enviar comentario"
                          >
                            {busy === p.id ? (
                              <Loader2 className="size-4 animate-spin" />
                            ) : (
                              <Send className="size-3.5" />
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
