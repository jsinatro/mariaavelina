"use client";

import Link from "next/link";
import { useState } from "react";

export default function BuscaPage() {
  const [q, setQ] = useState("");
  const [items, setItems] = useState<any[]>([]);

  return (
    <div className="card">
      <h1 className="text-2xl font-bold">Busca global</h1>
      <div className="mt-3 flex gap-2">
        <input className="rounded border p-2" value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Nome ou ID" />
        <button className="rounded border px-3" onClick={async()=>setItems(await (await fetch(`/api/portal/search?q=${encodeURIComponent(q)}`)).json())}>Buscar</button>
      </div>
      <ul className="mt-3 space-y-1">{items.map((p)=> <li key={p.id}><Link href={`/portal/pessoas/${p.id}`}>{p.name}</Link></li>)}</ul>
    </div>
  );
}
