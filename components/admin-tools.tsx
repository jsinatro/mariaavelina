"use client";

import { useState } from "react";

export function AdminTools() {
  const [jsonInput, setJsonInput] = useState("");
  const [gedcomInput, setGedcomInput] = useState("");
  const [msg, setMsg] = useState("");

  async function post(url: string, payload: any) {
    const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    setMsg(await res.text());
  }

  return (
    <div className="space-y-4">
      <div className="card">
        <h3 className="font-semibold">Importar JSON</h3>
        <textarea className="mt-2 min-h-32 w-full rounded border p-2" value={jsonInput} onChange={(e)=>setJsonInput(e.target.value)} />
        <button className="mt-2 rounded border px-3 py-2" onClick={() => post("/api/admin/import/json", { raw: jsonInput })}>Importar</button>
      </div>
      <div className="card">
        <h3 className="font-semibold">Importar GEDCOM</h3>
        <textarea className="mt-2 min-h-32 w-full rounded border p-2" value={gedcomInput} onChange={(e)=>setGedcomInput(e.target.value)} />
        <button className="mt-2 rounded border px-3 py-2" onClick={() => post("/api/admin/import/gedcom", { raw: gedcomInput })}>Importar GEDCOM</button>
      </div>
      <p>{msg}</p>
    </div>
  );
}
