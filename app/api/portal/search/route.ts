import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentContext } from "@/lib/portal";

export async function GET(req: Request) {
  const { familyProjectId } = await getCurrentContext();
  const q = new URL(req.url).searchParams.get("q") ?? "";
  const rows = await prisma.person.findMany({ where: { familyProjectId, OR: [{ name: { contains: q, mode: "insensitive" } }, { externalId: { contains: q } }, { id: { contains: q } }] }, take: 20 });
  return NextResponse.json(rows);
}
