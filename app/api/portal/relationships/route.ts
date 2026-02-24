import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentContext, canEdit } from "@/lib/portal";
import { relationshipSchema } from "@/lib/validators";

export async function POST(req: Request) {
  const { familyProjectId, role } = await getCurrentContext();
  if (!canEdit(role)) return new NextResponse("Sem permissão", { status: 403 });
  const body = relationshipSchema.parse(await req.json());
  const row = await prisma.relationship.create({ data: { ...body, familyProjectId } });
  return NextResponse.json(row);
}
