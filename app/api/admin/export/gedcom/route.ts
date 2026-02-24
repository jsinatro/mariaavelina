import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentContext, isAdmin } from "@/lib/portal";
import { exportGedcom } from "@/lib/gedcom";

export async function GET() {
  const { familyProjectId, role } = await getCurrentContext();
  if (!isAdmin(role)) return new NextResponse("Sem permissão", { status: 403 });
  const [people, rels] = await Promise.all([
    prisma.person.findMany({ where: { familyProjectId } }),
    prisma.relationship.findMany({ where: { familyProjectId } })
  ]);
  const ged = exportGedcom(people, rels);
  return new NextResponse(ged, { headers: { "Content-Type": "text/plain", "Content-Disposition": "attachment; filename=genealogia.ged" } });
}
