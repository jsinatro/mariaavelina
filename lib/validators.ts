import { z } from "zod";

export const personSchema = z.object({
  id: z.string().optional(),
  externalId: z.string().optional().nullable(),
  name: z.string().min(2),
  gender: z.string().optional().nullable(),
  birthDate: z.string().optional().nullable(),
  deathDate: z.string().optional().nullable(),
  isAlive: z.boolean().default(true),
  birthPlace: z.string().optional().nullable(),
  deathPlace: z.string().optional().nullable(),
  notes: z.string().optional().nullable()
});

export const relationshipSchema = z.object({
  type: z.enum(["PARENT", "SPOUSE"]),
  fromPersonId: z.string(),
  toPersonId: z.string(),
  metadata: z.string().optional().nullable()
});

export const sourceSchema = z.object({
  personId: z.string(),
  citationText: z.string().min(3),
  url: z.string().url().optional().nullable()
});

export const mediaSchema = z.object({
  personId: z.string(),
  type: z.enum(["IMAGE", "PDF"]),
  filename: z.string(),
  title: z.string().optional().nullable()
});
