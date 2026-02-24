import { Person, Relationship } from "@prisma/client";

export function buildDescTree(rootId: string, people: Person[], relationships: Relationship[], visited = new Set<string>()) {
  const person = people.find((p) => p.id === rootId);
  if (!person) return null;
  const repeated = visited.has(rootId);
  const nextVisited = new Set(visited);
  nextVisited.add(rootId);
  const childIds = relationships.filter((r) => r.type === "PARENT" && r.fromPersonId === rootId).map((r) => r.toPersonId);
  return {
    person,
    repeated,
    children: childIds.map((id) => buildDescTree(id, people, relationships, nextVisited)).filter(Boolean)
  };
}

export function buildAscTree(rootId: string, people: Person[], relationships: Relationship[], visited = new Set<string>()) {
  const person = people.find((p) => p.id === rootId);
  if (!person) return null;
  const repeated = visited.has(rootId);
  const nextVisited = new Set(visited);
  nextVisited.add(rootId);
  const parentIds = relationships.filter((r) => r.type === "PARENT" && r.toPersonId === rootId).map((r) => r.fromPersonId);
  return {
    person,
    repeated,
    parents: parentIds.map((id) => buildAscTree(id, people, relationships, nextVisited)).filter(Boolean)
  };
}

export function ahnentafel(rootId: string, people: Person[], relationships: Relationship[]) {
  const result: { n: number; person: Person }[] = [];
  const map = new Map(people.map((p) => [p.id, p]));

  const walk = (personId: string, n: number) => {
    const p = map.get(personId);
    if (!p) return;
    result.push({ n, person: p });
    const parents = relationships.filter((r) => r.type === "PARENT" && r.toPersonId === personId).map((r) => r.fromPersonId);
    if (parents[0]) walk(parents[0], n * 2);
    if (parents[1]) walk(parents[1], n * 2 + 1);
  };

  walk(rootId, 1);
  return result.sort((a, b) => a.n - b.n);
}
