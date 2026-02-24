import { NextResponse } from "next/server";
import { getCurrentContext, isAdmin } from "@/lib/portal";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const payloadSchema = z.object({
  raw: z.string()
});

const genealogyJsonSchema = z.object({
  people: z.array(z.object({ name: z.string(), externalId: z.string().optional(), isAlive: z.boolean().optional() })),
  relationships: z.array(z.object({ fromIdx: z.number(), toIdx: z.number(), type: z.enum(["PARENT", "SPOUSE"]) })).optional()
});

export async function POST(req: Request) {
  const { familyProjectId, role } = await getCurrentContext();
  if (!isAdmin(role)) return new NextResponse("Sem permissão", { status: 403 });
  const { raw } = payloadSchema.parse(await req.json());
  const parsed = genealogyJsonSchema.parse(JSON.parse(raw));
  const created = await Promise.all(parsed.people.map((p) => prisma.person.create({ data: { familyProjectId, name: p.name, externalId: p.externalId, isAlive: p.isAlive ?? true } })));
  for (const rel of parsed.relationships ?? []) {
    await prisma.relationship.create({ data: { familyProjectId, type: rel.type, fromPersonId: created[rel.fromIdx].id, toPersonId: created[rel.toIdx].id } });
  }
  return new NextResponse(`Importados ${created.length} registros`);
}
