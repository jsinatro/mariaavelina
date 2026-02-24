export type GedPerson = { id: string; name: string; birthDate?: string; deathDate?: string };
export type GedRelationship = { fromId: string; toId: string; type: "PARENT" };

export function parseGedcom(input: string) {
  const lines = input.split(/\r?\n/);
  const people: GedPerson[] = [];
  const rels: GedRelationship[] = [];
  const indi: Record<string, GedPerson> = {};
  let current = "";

  for (const line of lines) {
    const m = line.match(/^0 @(I\d+)@ INDI/);
    if (m) {
      current = m[1];
      indi[current] = { id: current, name: current };
      continue;
    }
    if (current && line.includes("1 NAME")) indi[current].name = line.replace("1 NAME", "").trim();
    if (current && line.includes("1 BIRT")) indi[current].birthDate = "";
    if (current && line.includes("2 DATE")) {
      const v = line.replace("2 DATE", "").trim();
      if (!indi[current].birthDate) indi[current].birthDate = v;
      else indi[current].deathDate = v;
    }
    if (line.startsWith("0 @F") && line.includes(" FAM")) current = "";
    const husb = line.match(/1 HUSB @(I\d+)@/);
    const wife = line.match(/1 WIFE @(I\d+)@/);
    const chil = line.match(/1 CHIL @(I\d+)@/);
    if (chil && (husb || wife)) {
      if (husb) rels.push({ fromId: husb[1], toId: chil[1], type: "PARENT" });
      if (wife) rels.push({ fromId: wife[1], toId: chil[1], type: "PARENT" });
    }
  }

  Object.values(indi).forEach((p) => people.push(p));
  return { people, relationships: rels };
}

export function exportGedcom(people: { id: string; name: string }[], rels: { fromPersonId: string; toPersonId: string; type: string }[]) {
  let out = "0 HEAD\n1 SOUR PORTAL-LIVRO-ARVORE\n1 GEDC\n2 VERS 5.5\n";
  people.forEach((p, i) => {
    out += `0 @I${i + 1}@ INDI\n1 NAME ${p.name}\n1 REFN ${p.id}\n`;
  });
  rels.filter((r) => r.type === "PARENT").forEach((r, i) => {
    out += `0 @F${i + 1}@ FAM\n1 HUSB @${r.fromPersonId}@\n1 CHIL @${r.toPersonId}@\n`;
  });
  out += "0 TRLR\n";
  return out;
}
