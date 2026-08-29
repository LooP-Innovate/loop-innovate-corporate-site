<!-- diagram-design-profile
name: L∞P Innovate
slug: loop-innovate
source-url: none
created: 2026-08-24
updated: 2026-08-24
notes: Derived from the local L∞P Innovate website tokens and design system
-->
# Style Guide

L∞P Innovate diagram skin for service explanations, corporate diagrams, and
AI-FDE process visuals. This profile preserves Diagram Design's editorial
grammar while matching the site's quiet, premium, human-centered,
architectural visual language.

## Tokens

### Semantic roles

| Role | Purpose | Default (light) | Default (dark) |
|---|---|---|---|
| `paper` | Page background, default node fill | `#f4f4f4` | `#07111d` |
| `paper-2` | Diagram container bg, secondary fill | `#e9edf0` | `#0c1a28` |
| `ink` | Primary text, primary stroke | `#101820` | `#f7fbff` |
| `muted` | Secondary text, default arrow stroke | `#5f666c` | `#b3bbc4` |
| `soft` | Sublabels, boundary labels | `#66717a` | `#8f9ba7` |
| `rule` | Hairline borders | `rgba(16,24,32,0.16)` | `rgba(247,251,255,0.14)` |
| `rule-solid` | Stronger borders, baselines | `#cbd2d7` | `rgba(247,251,255,0.28)` |
| `accent` | Focal / 1–2 max per diagram | `#328bd3` | `#7fcce8` |
| `accent-tint` | Fill for accent-bordered boxes | `rgba(50,139,211,0.10)` | `rgba(127,204,232,0.12)` |
| `link` | HTTP/API calls, external arrows | `#165f9c` | `#7fcce8` |

Contrast receipts: light `ink/paper` 16.27:1, light `muted/paper` 5.30:1,
light `soft/paper` 4.54:1, dark `ink/paper` 18.25:1, dark
`muted/paper` 9.78:1, and dark `soft/paper` 6.70:1.

### Series palette (multi-series chart types only)

Use the accent for one focal series. These secondary colors are reserved for
charts where overlapping series require distinction and must not leak into
architecture or process diagrams.

| Token | Light | Dark | Notes |
|---|---|---|---|
| `series-1` | `#5e7a9b` | `#82a0c0` | Dusty blue |
| `series-2` | `#7c8f6f` | `#9caf8f` | Sage |
| `series-3` | `#8a7d6b` | `#afa391` | Warm neutral |
| `series-4` | `#6e6479` | `#8d8298` | Slate |
| `series-5` | `#66717a` | `#8f9ba7` | Blue-grey |

## Typography

| Role | Family | Size | Weight | Usage |
|---|---|---|---|---|
| `title` | Helvetica Neue, Arial, Yu Gothic, Hiragino Kaku Gothic ProN, Meiryo, sans-serif | 28px | 400 | Page H1; rare display moments |
| `node-name` | Inter, Helvetica Neue, Arial, Yu Gothic, Hiragino Kaku Gothic ProN, Meiryo, sans-serif | 12px | 600 | Human-readable Japanese/Latin labels |
| `sublabel` | Consolas, Monaco, Courier New, monospace | 8px | 400 | Port, protocol, URL, field type |
| `eyebrow` | Consolas, Monaco, Courier New, monospace | 8px | 500, tracked 0.16em, uppercase | Type tags, axis labels |
| `arrow-label` | Consolas, Monaco, Courier New, monospace | 8px | 400, tracked 0.06em | Arrow annotations |
| `callout` | Helvetica Neue, Arial, Yu Gothic, Hiragino Kaku Gothic ProN, Meiryo, sans-serif | 16px | 400 | Restrained editorial asides |

Use no external font import. Preserve Japanese legibility and avoid Latin-style
tracking on Japanese sentences. Mono is only for technical content.

## Stroke, radius, spacing

| Token | Value | Use |
|---|---|---|
| `stroke-thin` | `0.8` | Tag-box outlines, leaf nodes |
| `stroke-default` | `1` | Most strokes |
| `stroke-strong` | `1.2` | Emphasis strokes |
| `radius-sm` | `4` | Small tags |
| `radius-md` | `6` | Node boxes |
| `radius-lg` | `8` | Containers, rings |
| `grid` | `4` | Every coordinate, size, and gap follows a 4px grid |

Recommended spacing vocabulary: 8, 12, 16px inside nodes; 20, 24, 32, 40,
or 48px between nodes; generous whitespace around the figure. Use alignment and
surface contrast, not shadows, nested cards, translucent panels, or universal
pills.

## Node type → treatment

| Type | Fill | Stroke |
|---|---|---|
| `focal` (1–2 max) | `accent-tint` | `accent` |
| `backend` | `paper` | `ink` |
| `store` | `ink @ 0.05` | `muted` |
| `external` | `ink @ 0.03` | `ink @ 0.30` |
| `input` | `muted @ 0.10` | `soft` |
| `optional` | `ink @ 0.02` | `ink @ 0.20` dashed `4,3` |
| `security` | `accent @ 0.05` | `accent @ 0.50` dashed `4,4` |

## L∞P-specific rules

- Build hierarchy with proportion, whitespace, material contrast, and a few
  precise blue/cyan accents.
- Use the accent on at most 1–2 focal elements. Do not flood surfaces with
  blue/cyan.
- Prefer editorial grids and structured relationships over generic SaaS card
  walls.
- Do not invent metrics, telemetry, customers, outcomes, certifications, or
  case-study evidence.
- Reject cyberpunk glow, neon overload, fake AI decoration, random glowing
  blobs, and excessive glassmorphism.
- An infinity symbol belongs only to RETURN. It must be a horizontal interwoven
  ribbon with two closed, uncropped loops and restrained blue-to-cyan light.
- Static output is the default. Motion must be optional, deterministic,
  reduced-motion safe, and must not change meaning.
- Use orthogonal rounded connectors, clear label masks, and the complexity
  budget from the installed Diagram Design skill.
