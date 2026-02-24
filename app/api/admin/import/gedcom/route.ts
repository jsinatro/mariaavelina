import { NextResponse } from "next/server";
import { getCurrentContext, isAdmin } from "@/lib/portal";
import { prisma } from "@/lib/prisma";
import { parseGedcom } from "@/lib/gedcom";

export async function POST(req: Request) {
  const { familyProjectId, role } = await getCurrentContext();
  if (!isAdmin(role)) return new NextResponse("Sem permissão", { status: 403 });
  const { raw } = await req.json();
  const parsed = parseGedcom(raw);
  const map = new Map<string, string>();
  for (const p of parsed.people) {
    const created = await prisma.person.create({ data: { familyProjectId, name: p.name, externalId: p.id } });
    map.set(p.id, created.id);
  }
  for (const rel of parsed.relationships) {
    const from = map.get(rel.fromId), to = map.get(rel.toId);
    if (from && to) await prisma.relationship.create({ data: { familyProjectId, type: "PARENT", fromPersonId: from, toPersonId: to } });
  }
  return new NextResponse(`GEDCOM importado: ${parsed.people.length} pessoas`);
}
