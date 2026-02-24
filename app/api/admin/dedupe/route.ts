import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentContext, isAdmin } from "@/lib/portal";

export async function GET() {
  const { familyProjectId, role } = await getCurrentContext();
  if (!isAdmin(role)) return new NextResponse("Sem permissão", { status: 403 });
  const people = await prisma.person.findMany({ where: { familyProjectId } });
  const suggestions: any[] = [];
  for (let i = 0; i < people.length; i++) {
    for (let j = i + 1; j < people.length; j++) {
      const a = people[i], b = people[j];
      if ((a.externalId && a.externalId === b.externalId) || (a.name === b.name && String(a.birthDate) === String(b.birthDate))) {
        suggestions.push({ a, b, reason: a.externalId === b.externalId ? "externalId" : "nome+data" });
      }
    }
  }
  return NextResponse.json(suggestions);
}

export async function POST(req: Request) {
  const { role } = await getCurrentContext();
  if (!isAdmin(role)) return new NextResponse("Sem permissão", { status: 403 });
  const { keepId, removeId } = await req.json();
  await prisma.relationship.updateMany({ where: { fromPersonId: removeId }, data: { fromPersonId: keepId } });
  await prisma.relationship.updateMany({ where: { toPersonId: removeId }, data: { toPersonId: keepId } });
  await prisma.source.updateMany({ where: { personId: removeId }, data: { personId: keepId } });
  await prisma.media.updateMany({ where: { personId: removeId }, data: { personId: keepId } });
  await prisma.person.delete({ where: { id: removeId } });
  return new NextResponse("Merge concluído");
}
