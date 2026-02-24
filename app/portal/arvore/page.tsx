import { TreeView } from "@/components/tree-view";
import { buildAscTree, buildDescTree } from "@/lib/genealogy";
import { prisma } from "@/lib/prisma";
import { getCurrentContext } from "@/lib/portal";

export default async function ArvorePage() {
  const { familyProjectId, familyProject, role } = await getCurrentContext();
  const [people, relationships] = await Promise.all([
    prisma.person.findMany({ where: { familyProjectId }, orderBy: { name: "asc" } }),
    prisma.relationship.findMany({ where: { familyProjectId } })
  ]);
  const filtered = familyProject.hideLivingForNonAdmin && role !== "ADMIN" ? people.map((p) => p.isAlive ? { ...p, notes: "Oculto por privacidade" } : p) : people;
  const root = filtered[0];
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Árvore da família</h1>
      <TreeView title="Descendência" root={root ? (buildDescTree(root.id, filtered as any, relationships as any) as any) : null} />
      <TreeView title="Ascendência" root={root ? (buildAscTree(root.id, filtered as any, relationships as any) as any) : null} />
    </div>
  );
}
