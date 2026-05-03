import { createServerClient } from "@/lib/supabase/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ auditId: string }> }
) {
  const { auditId } = await params;
  const supabase = await createServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { data: audit } = await supabase
    .from("audits")
    .select("*, projects!inner(user_id)")
    .eq("id", auditId)
    .eq("projects.user_id", session.user.id)
    .single();

  if (!audit) {
    return new Response("Not found", { status: 404 });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const channel = supabase
        .channel(`audit-${auditId}`)
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "audits",
            filter: `id=eq.${auditId}`,
          },
          (payload) => {
            const data = JSON.stringify(payload.new);
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          }
        )
        .subscribe();

      request.signal.addEventListener("abort", () => {
        supabase.removeChannel(channel);
        controller.close();
      });

      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify(audit)}\n\n`)
      );
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}