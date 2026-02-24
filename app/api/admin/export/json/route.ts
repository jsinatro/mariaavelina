import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentContext, isAdmin } from "@/lib/portal";

export async function GET() {
  const { familyProjectId, role } = await getCurrentContext();
  if (!isAdmin(role)) return new NextResponse("Sem permissão", { status: 403 });
  const [people, relationships, sources, media] = await Promise.all([
    prisma.person.findMany({ where: { familyProjectId } }),
    prisma.relationship.findMany({ where: { familyProjectId } }),
    prisma.source.findMany({ where: { person: { familyProjectId } } }),
    prisma.media.findMany({ where: { person: { familyProjectId } } })
  ]);
  return NextResponse.json({ people, relationships, sources, media });
}
