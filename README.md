# Portal + Livro + Árvore (MVP)

MVP vendável para genealogia privada multi-tenant com:
- Site público (marketing)
- Portal por família/projeto com autenticação
- CRUD de pessoas, relações, fontes e mídias
- Árvore colapsável (ascendência/descendência) com busca e marcação de repetidos
- Importação JSON e GEDCOM (parcial)
- Exportação JSON, GEDCOM, relatório PDF, livro PDF e árvore SVG/PDF

## Stack
- Next.js 14 (App Router) + TypeScript + Tailwind
- Prisma + SQLite (dev), pronto para PostgreSQL (basta trocar `DATABASE_PROVIDER` e `DATABASE_URL`)
- NextAuth (Credentials)
- Playwright para HTML -> PDF

## Por que essas entidades no Prisma?
- `FamilyProject` (tenant): separa dados de cada família/cliente e configura privacidade por tenant.
- `User` + `Membership` + `Role`: controle de acesso multi-tenant (ADMIN, EDITOR, VIEWER).
- `Person`: núcleo genealógico para portal, livro e árvore (IDs internos/externos, dados biográficos, status de vida).
- `Relationship`: estrutura flexível para parentesco e casamento sem duplicar colunas por tipo.
- `Source`: rastreabilidade de evidências por pessoa.
- `Media`: anexos de imagem/PDF com interface preparada para storage local hoje e S3 depois.

## Como rodar localmente
```bash
cp .env.example .env
npm install
npx prisma migrate dev --name init
npm run prisma:seed
npm run dev
```

Acesse:
- Marketing: `http://localhost:3000`
- Login: `http://localhost:3000/login`
- Portal: `http://localhost:3000/portal`

Credenciais seed:
- `admin@familia.local`
- `123456`

## Geração de PDFs
O projeto usa Playwright em rotas de exportação:
- `/api/admin/export/report?mode=desc`
- `/api/admin/export/report?mode=asc`
- `/api/admin/export/book` (POST)
- `/api/admin/export/tree?format=pdf`

## Deploy (sugestão)
- Vercel para app Next.js
- PostgreSQL gerenciado (Neon, Supabase, RDS)
- Ajuste variáveis:
  - `DATABASE_PROVIDER=postgresql`
  - `DATABASE_URL=...`
  - `NEXTAUTH_URL=https://seu-dominio`
  - `NEXTAUTH_SECRET=...`

## Limitações conhecidas deste MVP
- Import GEDCOM é parcial (pessoas + relações básicas)
- Upload de mídia está modelado, mas sem fluxo completo de upload em formulário no portal
- Árvore de impressão SVG prioriza simplicidade (layout linear vetorial)
- “Magic link” não implementado (somente Credentials)
