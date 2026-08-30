# Case Study content model

Canonical TypeScript contract: `lib/site/case-study-schema.ts`.

WordPress CPT slug: `case_study` (public rewrite may remain `/case-studies/` so a second case can be added without URL migration).

| Field | Type | Publication rule |
| --- | --- | --- |
| `title` | text | Required |
| `industry` | text/taxonomy | Use a generic industry when the client is anonymous |
| `challenge` | rich text | Required; no identifying operational data |
| `scope` | repeatable text | Required |
| `solution` | rich text | Required |
| `implementation` | repeatable text | Required |
| `outcome` | rich text | Required; no unsourced claims |
| `technologies` | taxonomy/repeater | Actual technologies only |
| `image` | media + alt | Optional; must be approved and anonymized |
| `publishStatus` | draft / review / published | Must be `published` |
| `clientDisclosurePermission` | pending / anonymous-approved / named-approved | `pending` blocks publication |
| `verifiedMetrics` | repeater: label, value, source | Every number needs a verification source |

The current source record is marked `anonymous-approved` and has an empty `verifiedMetrics` array. The operator must reconfirm that status against the Content Master before WordPress publication; changing it to `pending` automatically withholds the case from the rendered page. No fictional case or outcome number may be added to make the archive look fuller.
