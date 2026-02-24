import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentContext, canEdit } from "@/lib/portal";
import { sourceSchema } from "@/lib/validators";

export async function POST(req: Request) {
  const { role } = await getCurrentContext();
  if (!canEdit(role)) return new NextResponse("Sem permissão", { status: 403 });
  const body = sourceSchema.parse(await req.json());
  return NextResponse.json(await prisma.source.create({ data: body }));
}
