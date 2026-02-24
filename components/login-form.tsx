"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export function LoginForm() {
  const [email, setEmail] = useState("admin@familia.local");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState("");

  return (
    <form className="space-y-3" onSubmit={async (e) => {
      e.preventDefault();
      const result = await signIn("credentials", { email, password, callbackUrl: "/portal" });
      if (result?.error) setError("Credenciais inválidas");
    }}>
      <input className="w-full rounded border p-2" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="email" />
      <input className="w-full rounded border p-2" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="senha" />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button className="rounded bg-brand px-4 py-2 text-white">Entrar</button>
    </form>
  );
}
