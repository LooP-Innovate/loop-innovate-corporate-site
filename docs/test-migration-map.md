# Test Migration Map

Inventory at the Next.js reference: **17 files / 67 tests**.

- **A — 50:** reimplement as automated PHP/WordPress or theme-JavaScript tests.
- **B — 15:** migrate to the pre-launch manual QA checklist.
- **C — 2:** Next.js-specific checks; no direct WordPress equivalent.

Migration phases used below:

- **M1:** publication guards, routing and SEO;
- **M2:** theme/content/asset integration;
- **M3:** fixed Journey engine;
- **M4:** pre-launch manual QA.

| # | Test | Current purpose | A/B/C | WordPress equivalent | Phase | Reason |
| ---: | --- | --- | :---: | --- | :---: | --- |
| 1 | asset resolver: FIELD video selection | Desktop/mobile source resolution | A | Theme resolver unit test; update to accepted responsive-still contract if legacy video is retired | M3 | Fixed engine behavior |
| 2 | asset resolver: video fallback | Poster/placeholder fallback | A | Theme resolver unit test | M3 | Prevent blank scene |
| 3 | asset resolver: reduced-motion video skip | Avoid video for reduced motion | A | Theme preference unit/integration test | M3 | Accessibility contract |
| 4 | asset resolver: mobile-specific source | Prefer mobile source | A | Responsive manifest test | M3 | Delivery contract |
| 5 | asset resolver: bounded direction preload | Preload range/direction | A | Theme resolver unit test | M3 | Performance and correctness |
| 6 | asset resolver: invalid preload input | Fail fast on invalid values | A | Theme resolver validation test | M3 | Safety invariant |
| 7 | asset resolver: crossfade stability | Blend deadband stability | A | Theme resolver/timeline unit test | M3 | Prevent flicker |
| 8 | brand logo: official variants | PNG dimensions and RGBA contract | A | Asset-integrity CI | M2 | Prevent accidental replacement |
| 9 | business clarity: Hero | Hero explains business without narrowing scope | B | Desktop/mobile/a11y copy parity review | M4 | Editorial/visual judgment |
| 10 | business clarity: FIELD LOOP separation | Separate philosophy and delivery model | B | Content parity review | M4 | Meaning/context review |
| 11 | business clarity: pricing | Four ranges and tax note | B | Pricing editorial/legal review | M4 | Human sign-off |
| 12 | business clarity: Next fonts/env defaults | `next/font` and Next env defaults | C | Font migration QA and SEO guard tests replace it | — | Framework-specific |
| 13 | Case Study: approved anonymous case | Permit truthful anonymous case; no invented metrics | A | CPT publication query/render test | M1 | Publication safety |
| 14 | Case Study: pending disclosure | Block pending permission | A | CPT guard PHPUnit/integration test | M1 | Customer disclosure safety |
| 15 | Case Study: gate wired to render | Prevent guard bypass | A | WP_Query/template/REST integration test | M1 | All-surface enforcement |
| 16 | FIELD TO INFINITY: singular/linkage | Unique, scroll-linked, lightweight expression | B | Browser/performance QA | M4 | Visual interaction judgment |
| 17 | FIELD TO INFINITY: accessible/static | A11y, reduced motion, responsive behavior | B | Browser/a11y QA | M4 | Multi-device judgment |
| 18 | final visual assets: Next Image integration | Two optimized visuals and Next config | C | Asset allowlist CI plus manual placement QA | — | Next Image-specific |
| 19 | final visual assets: restrained background | Background placement and gradient | B | Visual regression/manual comparison | M4 | Visual fidelity |
| 20 | final visual polish: founder portrait | About-only placement and alt text | B | Page/a11y visual QA | M4 | Content and visual review |
| 21 | final visual polish: principles SVG | SVG, hover and reduced motion | B | Browser/a11y QA | M4 | Interaction judgment |
| 22 | final visual polish: FIELD LOOP clarity | Opacity/gradient/filter contract | B | Screenshot comparison | M4 | Visual fidelity |
| 23 | interaction timeline: BUILD boundaries | BUILD step boundaries | A | Theme JavaScript unit test | M3 | Timing invariant |
| 24 | interaction timeline: static BUILD | Reduced-motion BUILD final state | A | Theme JavaScript unit test | M3 | Accessibility invariant |
| 25 | interaction timeline: RETURN dawn | RETURN phase boundaries | A | Theme JavaScript unit test | M3 | Timing invariant |
| 26 | interaction timeline: ADOPT primary | ADOPT-to-RETURN contract | A | Theme JavaScript unit test | M3 | Locked sequence |
| 27 | interaction timeline: particles/erosion/wash | RETURN exit phases | A | Theme JavaScript unit test | M3 | Locked transition |
| 28 | interaction timeline: reversible | Forward/reverse scroll reversibility | A | Theme unit plus browser test | M3 | Engine correctness |
| 29 | interaction timeline: static exit | Reduced-motion exit state | A | Theme JavaScript unit test | M3 | Accessibility invariant |
| 30 | interaction timeline: CSS state values | Coherent custom-property values | A | Theme integration test | M3 | JS/CSS contract |
| 31 | interaction timeline: clamps | Reject/clamp invalid progress | A | Theme JavaScript unit test | M3 | Safety invariant |
| 32 | layer config: bounded layer set | Six-scene layer counts | A | Manifest schema test | M3 | Composition invariant |
| 33 | layer config: unique/canonical/WebP | URL uniqueness, existence and format | A | Asset-integrity CI | M3 | Broken asset prevention |
| 34 | layer config: duplicate semantics | No duplicated people/infinity marks | A | Manifest semantic test | M3 | Composition safety |
| 35 | legal trust: unconfirmed facts | Tokushoho fail-closed config | A | PHPUnit/config validation | M1 | Legal publication gate |
| 36 | legal trust: route contract | Route/link/sitemap suppression | A | Route/footer/hub/direct-access integration test | M1 | All-surface enforcement |
| 37 | legal trust: required clauses | Privacy/Terms clause completeness | B | Legal/editorial sign-off checklist | M4 | Requires human/legal review |
| 38 | micro polish: FIELD TO SYSTEM | One-shot typewriter and reduced motion | B | Browser QA | M4 | Motion fidelity |
| 39 | micro polish: cursor orb | Pointer conditions and behavior | B | Desktop/input/reduced-motion QA | M4 | Device interaction |
| 40 | micro polish: content hierarchy | Final copy hierarchy | B | Content parity review | M4 | Editorial judgment |
| 41 | reduced-motion contract | Journey and Corporate motion | B | OS/browser accessibility QA | M4 | End-to-end perception |
| 42 | return assets: R-13 before R-14 | Exit asset ordering | A | Manifest/order test | M3 | Transition invariant |
| 43 | return assets: WebP files | Exit asset existence/format | A | Asset-integrity CI | M3 | Broken asset prevention |
| 44 | scene config: Japanese phrase lines | Locked heading breaks | B | Four-viewport visual/copy QA | M4 | Typography judgment |
| 45 | scene config: six-scene order | Scene order/config validity | A | Theme configuration test | M3 | Locked Journey structure |
| 46 | scene config: anchors/transitions | Stills, 510svh and transition contract | A | Theme configuration test | M3 | Locked architecture |
| 47 | scene config: manifest/aliases | Single-source derivation | A | Manifest derivation test | M3 | Avoid drift |
| 48 | scene config: duplicate/index/blend errors | Configuration validation | A | Theme validation test | M3 | Fail-fast safety |
| 49 | scene config: status/overlay/focal errors | Configuration validation | A | Theme validation test | M3 | Fail-fast safety |
| 50 | SEO: HTTPS/contact/indexing | Global indexing truth table | A | PHPUnit truth table and rendered-head test | M1 | Publication safety |
| 51 | SEO: Tokushoho facts | Tokushoho readiness matrix | A | PHPUnit validation matrix | M1 | Legal publication safety |
| 52 | SEO: identity/production wiring | JSON-LD, route, sitemap and guards | A | WP hooks/output integration test | M1 | Prevent bypass |
| 53 | still resolver: desktop primary | Desktop still resolution | A | Theme resolver unit test | M3 | Fixed engine behavior |
| 54 | still resolver: mobile/fallback | Responsive still fallback | A | Theme resolver unit test | M3 | Responsive behavior |
| 55 | still resolver: poster fallback | Poster fallback | A | Theme resolver unit test | M3 | Prevent blank scene |
| 56 | still resolver: null placeholder | Safe null on missing media | A | Theme resolver unit test | M3 | Fail-safe rendering |
| 57 | still resolver: focal tiers | Desktop/tablet/mobile focal point | A | Theme resolver unit test | M3 | Visual composition |
| 58 | timeline: six checkpoints | Progress-to-scene mapping | A | Theme timeline unit test | M3 | Engine invariant |
| 59 | timeline: 20% boundary | Boundary precision | A | Theme timeline unit test | M3 | Engine precision |
| 60 | timeline: reverse checkpoints | Reverse mapping | A | Theme timeline unit test | M3 | Reversibility |
| 61 | timeline: blend window | Blend calculation | A | Theme timeline unit test | M3 | Visual continuity |
| 62 | timeline: clamp/one scene | Edge cases | A | Theme timeline unit test | M3 | Robustness |
| 63 | timeline: rail conversion | Rail-index conversion | A | Theme timeline unit test | M3 | Navigation correctness |
| 64 | timeline: weighted BUILD/ADOPT→RETURN | Segment allocation | A | Theme timeline unit test | M3 | Locked pacing |
| 65 | timeline: weighted round trip | Conversion reversibility | A | Theme timeline unit test | M3 | Engine correctness |
| 66 | timeline: RETURN endpoint tail | Calm endpoint contract | A | Theme timeline unit test | M3 | Locked ending |
| 67 | timeline: invalid inputs | Fail-fast validation | A | Theme timeline validation test | M3 | Safety invariant |

## Priority migration gates

The following cannot be postponed to a visual-only checklist and must remain A or
B as shown: indexing publication gate, Tokushoho publication gate, Contact
readiness, legal-route integrity, Case Study gate, placeholder/dummy rejection,
sitemap/robots gating and public HTTPS validation.

Before WordPress becomes public, all M1 automated tests must pass; all M3 tests must
pass before Journey parity review; and every B item must be signed off at the four
reference viewports plus reduced-motion mode.
