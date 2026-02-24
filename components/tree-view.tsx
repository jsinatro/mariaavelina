"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Node = {
  person: { id: string; name: string; isAlive: boolean };
  repeated: boolean;
  children?: Node[];
  parents?: Node[];
};

function NodeBlock({ node, query }: { node: Node; query: string }) {
  const highlighted = query && node.person.name.toLowerCase().includes(query.toLowerCase());
  const relNodes = node.children ?? node.parents ?? [];
  return (
    <details open className="ml-4">
      <summary className={`cursor-pointer rounded px-1 ${highlighted ? "bg-yellow-200" : ""}`}>
        <Link href={`/portal/pessoas/${node.person.id}`}>{node.person.name}</Link>
        {node.repeated && <span className="ml-2 text-xs text-amber-600">(referência repetida)</span>}
      </summary>
      <div>{relNodes.map((child) => <NodeBlock key={child.person.id + String(Math.random())} node={child} query={query} />)}</div>
    </details>
  );
}

export function TreeView({ title, root }: { title: string; root: Node | null }) {
  const [query, setQuery] = useState("");
  const [expandAll, setExpandAll] = useState(true);
  const key = useMemo(() => `${title}-${expandAll}`, [title, expandAll]);
  return (
    <div className="card">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="my-3 flex gap-2">
        <input className="rounded border p-2" placeholder="Buscar nome" value={query} onChange={(e) => setQuery(e.target.value)} />
        <button className="rounded border px-2" onClick={() => setExpandAll(true)}>Expandir tudo</button>
        <button className="rounded border px-2" onClick={() => setExpandAll(false)}>Recolher tudo</button>
      </div>
      <div key={key}>{root ? <NodeBlock node={root} query={query} /> : <p>Sem dados.</p>}</div>
    </div>
  );
}
