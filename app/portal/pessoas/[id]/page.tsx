import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentContext } from "@/lib/portal";

export default async function PessoaPage({ params }: { params: { id: string } }) {
  const { familyProjectId, role, familyProject } = await getCurrentContext();
  const person = await prisma.person.findFirstOrThrow({
    where: { id: params.id, familyProjectId },
    include: { sources: true, media: true, fromRelations: true, toRelations: true }
  });

  const hidden = familyProject.hideLivingForNonAdmin && role !== "ADMIN" && person.isAlive;

  return (
    <div className="space-y-4">
      <div className="text-sm text-slate-500">{familyProject.name} → <Link href="/portal/arvore">Árvore</Link> → Pessoa</div>
      <div className="card">
        <h1 className="text-2xl font-bold">{person.name}</h1>
        <p>ID interno: {person.id}</p>
        <p>ID externo: {person.externalId ?? "-"}</p>
        <p>Status: {person.isAlive ? "Vivo" : "Falecido"}</p>
        <p>Local nascimento: {hidden ? "Oculto" : (person.birthPlace ?? "-")}</p>
        <p>Notas: {hidden ? "Oculto" : (person.notes ?? "-")}</p>
      </div>
      <div className="card"><h2 className="font-semibold">Relacionamentos</h2><p>Pais: {person.toRelations.filter(r=>r.type==='PARENT').length} | Filhos: {person.fromRelations.filter(r=>r.type==='PARENT').length} | Cônjuges: {person.fromRelations.filter(r=>r.type==='SPOUSE').length}</p></div>
      <div className="card"><h2 className="font-semibold">Fontes</h2>{person.sources.map(s=><p key={s.id}>{s.citationText}</p>)}</div>
      <div className="card"><h2 className="font-semibold">Mídias</h2>{person.media.map(m=><p key={m.id}>{m.title ?? m.filename}</p>)}</div>
    </div>
  );
}
