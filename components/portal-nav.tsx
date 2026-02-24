import Link from "next/link";

export function PortalNav() {
  return (
    <nav className="mb-6 flex gap-4 text-sm">
      <Link href="/portal">Dashboard</Link>
      <Link href="/portal/arvore">Árvore</Link>
      <Link href="/portal/busca">Busca</Link>
      <Link href="/portal/admin">Admin</Link>
    </nav>
  );
}
