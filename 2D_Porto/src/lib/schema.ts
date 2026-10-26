import { z } from 'zod';

/** "YYYY-MM" month string. */
const month = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Use YYYY-MM');
const url = z.string().min(1);

export const SocialSchema = z.object({
  label: z.string(),
  url,
  icon: z.enum(['github', 'linkedin', 'mail', 'globe', 'x', 'instagram', 'youtube']),
});

export const MissionSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/, 'ids are kebab-case'),
  type: z.enum(['launch', 'crew_assignment']),
  title: z.string(),
  org: z.string(),
  start: month,
  end: month.nullable(),
  featured: z.boolean().default(false),
  research: z.boolean().default(false),
  summary: z.string(),
  objective: z.string().optional(),
  results: z.array(z.string()).default([]),
  payload: z.array(z.string()).min(1),
  links: z
    .object({ demo: url.optional(), code: url.optional(), paper: url.optional() })
    .default({}),
});

export const CritterSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  rarity: z.enum(['common', 'uncommon', 'rare', 'legendary']),
  colors: z.tuple([z.string(), z.string()]),
  blurb: z.string(),
});

const PersonaSchema = z.object({ name: z.string(), greeting: z.string(), style: z.string() });

export const ProfileSchema = z.object({
  person: z.object({
    name: z.string(),
    short_name: z.string(),
    initials: z.string().max(3),
    title: z.string(),
    tagline: z.string(),
    location: z.string(),
    email: z.string().email(),
    website: url.optional(),
    cv: z.string().optional(),
    summary: z.string(),
    intro: z.string(),
    now: z.object({ role: z.string(), org: z.string(), blurb: z.string() }),
    open_to: z.string(),
    languages: z.array(z.object({ name: z.string(), level: z.string() })),
    interests: z.array(z.string()),
  }),
  socials: z.array(SocialSchema),
  education: z.array(
    z.object({
      school: z.string(),
      degree: z.string(),
      location: z.string(),
      start: month,
      end: month.nullable(),
      gpa: z.string().optional(),
      highlights: z.array(z.string()).default([]),
    }),
  ),
  honors: z.array(
    z.object({ title: z.string(), issuer: z.string(), date: month, note: z.string().optional() }),
  ),
  missions: z.array(MissionSchema).min(1),
  stack: z.array(z.object({ category: z.string(), items: z.array(z.string()).min(1) })).length(4, 'The radar has exactly 4 quadrants'),
  telemetry: z.object({
    github: z.string().nullable(),
    leetcode: z.string().nullable(),
    spotify: z.boolean().default(false),
  }),
  research: z.object({
    statement: z.string(),
    methods: z.array(z.string()),
    next: z.array(z.string()),
  }),
  critters: z.array(CritterSchema).length(12, 'The Critterdex holds exactly 12 critters'),
  assistant: z.object({
    twin: PersonaSchema,
    reception: PersonaSchema,
    rules: z.array(z.string()),
    suggested_prompts: z.array(z.string()),
    faq: z.array(z.object({ q: z.string(), a: z.string() })),
  }),
}).superRefine((p, ctx) => {
  const ids = new Set<string>();
  p.missions.forEach((m, i) => {
    if (ids.has(m.id)) ctx.addIssue({ code: 'custom', path: ['missions', i, 'id'], message: `Duplicate mission id "${m.id}"` });
    ids.add(m.id);
    if (m.end && m.end < m.start) ctx.addIssue({ code: 'custom', path: ['missions', i, 'end'], message: 'end is before start' });
  });
});

export type Profile = z.infer<typeof ProfileSchema>;
export type Mission = z.infer<typeof MissionSchema>;
export type Critter = z.infer<typeof CritterSchema>;
export type Social = z.infer<typeof SocialSchema>;
