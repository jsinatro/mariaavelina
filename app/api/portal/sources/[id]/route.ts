import { NextResponse } from "next/server";
import { getCurrentContext, canEdit } from "@/lib/portal";
import { prisma } from "@/lib/prisma";

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const { role } = await getCurrentContext();
  if (!canEdit(role)) return new NextResponse("Sem permissão", { status: 403 });
  await prisma.source.delete({ where: { id: params.id } });
  return new NextResponse("ok");
}
