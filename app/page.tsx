import Link from "next/link";

export default function HomePage() {
  return (
    <main className="container-page space-y-10">
      <section className="card">
        <h1 className="text-3xl font-bold">Portal + Livro + Árvore</h1>
        <p className="mt-3 text-slate-600">Portal genealógico privado para famílias, com geração de livro e árvore de impressão.</p>
        <Link href="/contato" className="mt-6 inline-block rounded-lg bg-brand px-4 py-2 font-semibold text-white">Quero meu Portal</Link>
      </section>
    </main>
  );
}
