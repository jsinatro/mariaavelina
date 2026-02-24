import { prisma } from "@/lib/prisma";
import { getCurrentContext } from "@/lib/portal";

export default async function PortalHome() {
  const { familyProjectId, familyProject } = await getCurrentContext();
  const total = await prisma.person.count({ where: { familyProjectId } });
  return <div className="card"><h1 className="text-2xl font-bold">Dashboard · {familyProject.name}</h1><p className="mt-2">Pessoas cadastradas: {total}</p></div>;
}
