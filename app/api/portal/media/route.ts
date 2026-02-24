import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentContext, canEdit } from "@/lib/portal";
import { mediaSchema } from "@/lib/validators";

export async function POST(req: Request) {
  const { role } = await getCurrentContext();
  if (!canEdit(role)) return new NextResponse("Sem permissão", { status: 403 });
  const body = mediaSchema.parse(await req.json());
  return NextResponse.json(await prisma.media.create({ data: body }));
}
