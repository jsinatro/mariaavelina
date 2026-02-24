import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentContext, canEdit } from "@/lib/portal";
import { personSchema } from "@/lib/validators";

export async function GET() {
  const { familyProjectId } = await getCurrentContext();
  const rows = await prisma.person.findMany({ where: { familyProjectId }, orderBy: { name: "asc" } });
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const { familyProjectId, role } = await getCurrentContext();
  if (!canEdit(role)) return new NextResponse("Sem permissão", { status: 403 });
  const body = personSchema.parse(await req.json());
  const person = await prisma.person.create({
    data: {
      familyProjectId,
      name: body.name,
      externalId: body.externalId,
      gender: body.gender,
      birthDate: body.birthDate ? new Date(body.birthDate) : null,
      deathDate: body.deathDate ? new Date(body.deathDate) : null,
      isAlive: body.isAlive,
      birthPlace: body.birthPlace,
      deathPlace: body.deathPlace,
      notes: body.notes
    }
  });
  return NextResponse.json(person);
}
