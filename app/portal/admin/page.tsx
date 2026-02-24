import { AdminTools } from "@/components/admin-tools";
import { PersonForm } from "@/components/person-form";
import { getCurrentContext, isAdmin } from "@/lib/portal";
import { prisma } from "@/lib/prisma";

export default async function AdminPage() {
  const { role, familyProjectId } = await getCurrentContext();
  if (!isAdmin(role)) return <div className="card">Acesso somente ADMIN.</div>;
  const people = await prisma.person.findMany({ where: { familyProjectId }, take: 20, orderBy: { createdAt: "desc" } });
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Admin</h1>
      <div className="card"><h2 className="mb-2 font-semibold">CRUD Pessoa</h2><PersonForm /></div>
      <div className="card"><h2 className="mb-2 font-semibold">Últimas pessoas</h2>{people.map(p=><p key={p.id}>{p.name}</p>)}</div>
      <AdminTools />
    </div>
  );
}
