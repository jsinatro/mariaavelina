import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentContext, isAdmin } from "@/lib/portal";
import { htmlToPdfBuffer } from "@/lib/pdf";

export async function POST(req: Request) {
  const { familyProjectId, role, familyProject } = await getCurrentContext();
  if (!isAdmin(role)) return new NextResponse("Sem permissão", { status: 403 });
  const { size = "A5", showLiving = false } = await req.json().catch(() => ({}));
  const people = await prisma.person.findMany({ where: { familyProjectId }, include: { sources: true, media: true }, take: 50 });
  const filtered = showLiving ? people : people.filter((p) => !p.isAlive);
  const html = `
  <html><body style='font-family:serif'>
    <h1>${familyProject.name} - Livro da Família</h1>
    <h2>Sumário</h2>
    <ol>${filtered.map((p) => `<li>${p.name}</li>`).join("")}</ol>
    <h2>Introdução</h2><p>Este é um livro genealógico gerado automaticamente (MVP).</p>
    ${filtered.map((p) => `<section><h3>${p.name}</h3><p>${p.notes ?? "Biografia curta (placeholder)."}</p><p>Fontes: ${p.sources.map((s) => s.citationText).join("; ") || "-"}</p></section>`).join("")}
    <h2>Apêndice de Fontes</h2>
    <ul>${filtered.flatMap((p) => p.sources.map((s) => `<li>${p.name}: ${s.citationText}</li>`)).join("")}</ul>
  </body></html>`;
  const pdf = await htmlToPdfBuffer(html, size === "A5" ? "A5" : "A4");
  return new NextResponse(pdf, { headers: { "Content-Type": "application/pdf", "Content-Disposition": "attachment; filename=livro-familia.pdf" } });
}
