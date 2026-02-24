import { NextResponse } from "next/server";
import { getCurrentContext, canEdit } from "@/lib/portal";
import { prisma } from "@/lib/prisma";
import { personSchema } from "@/lib/validators";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { role, familyProjectId } = await getCurrentContext();
  if (!canEdit(role)) return new NextResponse("Sem permissão", { status: 403 });
  const body = personSchema.partial().parse(await req.json());
  const exists = await prisma.person.findFirst({ where: { id: params.id, familyProjectId } });
  if (!exists) return new NextResponse("Não encontrado", { status: 404 });
  const p = await prisma.person.update({ where: { id: params.id }, data: body as any });
  return NextResponse.json(p);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const { role, familyProjectId } = await getCurrentContext();
  if (!canEdit(role)) return new NextResponse("Sem permissão", { status: 403 });
  const exists = await prisma.person.findFirst({ where: { id: params.id, familyProjectId } });
  if (!exists) return new NextResponse("Não encontrado", { status: 404 });
  await prisma.person.delete({ where: { id: params.id } });
  return new NextResponse("ok");
}
