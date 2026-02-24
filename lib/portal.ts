import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";

export async function getCurrentContext() {
  const session = await requireSession();
  const familyProjectId = session.user.familyProjectId;
  const role = session.user.role;
  const familyProject = await prisma.familyProject.findUniqueOrThrow({ where: { id: familyProjectId } });
  return { session, familyProjectId, role, familyProject };
}

export function canEdit(role: string) {
  return role === "ADMIN" || role === "EDITOR";
}

export function isAdmin(role: string) {
  return role === "ADMIN";
}
