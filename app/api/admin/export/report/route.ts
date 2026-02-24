import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentContext, isAdmin } from "@/lib/portal";
import { ahnentafel, buildDescTree } from "@/lib/genealogy";
import { htmlToPdfBuffer } from "@/lib/pdf";

function renderDesc(node: any, lvl = 0): string {
  if (!node) return "";
  return `<li>${"&nbsp;".repeat(lvl * 4)}${node.person.name}</li><ul>${(node.children ?? []).map((c: any) => renderDesc(c, lvl + 1)).join("")}</ul>`;
}

export async function GET(req: Request) {
  const { familyProjectId, role } = await getCurrentContext();
  if (!isAdmin(role)) return new NextResponse("Sem permissão", { status: 403 });
  const mode = new URL(req.url).searchParams.get("mode") ?? "desc";
  const [people, rels] = await Promise.all([
    prisma.person.findMany({ where: { familyProjectId } }),
    prisma.relationship.findMany({ where: { familyProjectId } })
  ]);
  const root = people[0];
  const html = mode === "asc"
    ? `<h1>Ahnentafel simplificado</h1><ol>${ahnentafel(root.id, people, rels).map((x) => `<li>${x.n}. ${x.person.name}</li>`).join("")}</ol>`
    : `<h1>Relatório de Descendência</h1><ul>${renderDesc(buildDescTree(root.id, people as any, rels as any))}</ul>`;
  const pdf = await htmlToPdfBuffer(`<html><body>${html}</body></html>`, "A4");
  return new NextResponse(pdf, { headers: { "Content-Type": "application/pdf", "Content-Disposition": `attachment; filename=relatorio-${mode}.pdf` } });
}
