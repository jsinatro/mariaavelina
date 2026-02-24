import { hash } from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const family = await prisma.familyProject.upsert({
    where: { slug: "familia-avelina-demo" },
    update: {},
    create: { slug: "familia-avelina-demo", name: "Família Avelina Demo", hideLivingForNonAdmin: true }
  });

  const admin = await prisma.user.upsert({
    where: { email: "admin@familia.local" },
    update: {},
    create: { name: "Sinatro", email: "admin@familia.local", passwordHash: await hash("123456", 10) }
  });

  await prisma.membership.upsert({
    where: { userId_familyProjectId: { userId: admin.id, familyProjectId: family.id } },
    update: { role: "ADMIN" },
    create: { userId: admin.id, familyProjectId: family.id, role: "ADMIN" }
  });

  const avo = await prisma.person.create({ data: { familyProjectId: family.id, name: "Aurora da Serra (fictícia)", externalId: "FS-AURORA-001", isAlive: false, birthPlace: "Vila das Flores", notes: "Matriarca fictícia para demonstração." } });
  const filho = await prisma.person.create({ data: { familyProjectId: family.id, name: "Hélio da Serra (fictício)", isAlive: false } });
  const neta = await prisma.person.create({ data: { familyProjectId: family.id, name: "Lia da Serra (fictícia)", isAlive: true } });

  await prisma.relationship.createMany({ data: [
    { familyProjectId: family.id, type: "PARENT", fromPersonId: avo.id, toPersonId: filho.id },
    { familyProjectId: family.id, type: "PARENT", fromPersonId: filho.id, toPersonId: neta.id }
  ] });

  await prisma.source.create({ data: { personId: avo.id, citationText: "Registro paroquial fictício, livro A, pág. 12." } });
  await prisma.media.create({ data: { personId: avo.id, type: "IMAGE", filename: "aurora.jpg", title: "Retrato fictício" } });
}

main().finally(async () => prisma.$disconnect());
