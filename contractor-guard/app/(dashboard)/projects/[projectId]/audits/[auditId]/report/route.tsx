import React from "react";
import { createServerClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { AuditPDF } from "@/components/report/audit-pdf";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ auditId: string }> }
) {
  const { auditId } = await params;
  const supabase = await createServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: audit } = await (supabase as any)
    .from("audits")
    .select("*, projects!inner(user_id)")
    .eq("id", auditId)
    .eq("projects.user_id", session.user.id)
    .single();

  if (!audit) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { data: results } = await (supabase as any)
    .from("audit_results")
    .select("*")
    .eq("audit_id", auditId);

  const pdfBuffer = await renderToBuffer(
    <AuditPDF audit={audit} results={results ?? []} />
  );

  return new NextResponse(pdfBuffer as unknown as BodyInit, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="audit-${auditId}.pdf"`,
    },
  });
}