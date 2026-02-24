import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentContext, isAdmin } from "@/lib/portal";
import { htmlToPdfBuffer } from "@/lib/pdf";

export async function GET(req: Request) {
  const { familyProjectId, role } = await getCurrentContext();
  if (!isAdmin(role)) return new NextResponse("Sem permissão", { status: 403 });
  const format = new URL(req.url).searchParams.get("format") ?? "svg";
  const people = await prisma.person.findMany({ where: { familyProjectId }, take: 20 });
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='${80 + people.length * 40}'><style>text{font-family:Arial;font-size:14px}</style>${people.map((p, i) => `<rect x='20' y='${20+i*35}' width='260' height='26' fill='#fff' stroke='#1f4b99'/><text x='30' y='${38+i*35}'>${p.name}</text>`).join("")}</svg>`;
  if (format === "pdf") {
    const pdf = await htmlToPdfBuffer(`<html><body>${svg}</body></html>`, "A4");
    return new NextResponse(pdf, { headers: { "Content-Type": "application/pdf" } });
  }
  return new NextResponse(svg, { headers: { "Content-Type": "image/svg+xml" } });
}
