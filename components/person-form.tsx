"use client";

import { useState } from "react";

export function PersonForm({ onCreated }: { onCreated?: () => void }) {
  const [name, setName] = useState("");
  const [externalId, setExternalId] = useState("");

  return (
    <form className="grid gap-2" onSubmit={async (e) => {
      e.preventDefault();
      await fetch("/api/portal/persons", { method: "POST", body: JSON.stringify({ name, externalId, isAlive: true }) });
      setName("");
      setExternalId("");
      onCreated?.();
    }}>
      <input className="rounded border p-2" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Nome" required />
      <input className="rounded border p-2" value={externalId} onChange={(e)=>setExternalId(e.target.value)} placeholder="ID externo opcional" />
      <button className="rounded bg-brand px-3 py-2 text-white">Salvar pessoa</button>
    </form>
  );
}
