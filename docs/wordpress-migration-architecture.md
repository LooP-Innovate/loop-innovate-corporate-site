# WordPress migration architecture

This document defines the boundary before implementation. WordPress migration has not started.

## Fixed code layer

Do not expose these systems as free-form editor markup:

- Hero Journey engine, scene blend and scroll progression
- BUILD System Window and RETURN transition
- Cursor interaction and Field → Infinity
- design tokens, motion engine and reduced-motion rules
- Header/Footer structure and responsive motion rules

They should remain version-controlled theme components with typed inputs and safe fallbacks.

## Editable content layer

WordPress editors may manage:

- About text and verified Profile data
- Services and AI-FDE description
- Pricing and FAQ
- Case Study CPT entries
- Contact information
- legal text and confirmed company facts
- approved images and alt text

Use core blocks for headings, rich text and images. Use constrained patterns/fields for FAQ, pricing and legal content. Do not convert Journey or other visual experiences into arbitrary Gutenberg blocks.

## Contact production gate

Production cannot be indexed until all of the following work end to end:

1. Contact Form 7 or an equivalent maintained form solution
2. SMTP delivery
3. administrator notification and auto-reply
4. spam protection
5. required Privacy Policy consent
6. accessible validation, success and error states
7. a verified public destination address

The current Next.js preview intentionally has no send action and must remain `noindex`. `NEXT_PUBLIC_CONTACT_READY=true` is allowed only after the complete path is verified.

## Theme options for the next phase

| Criterion | SWELL child theme | L∞P original theme |
| --- | --- | --- |
| Visual fidelity / motion | More override pressure | Highest control |
| Gutenberg compatibility | Strong baseline | Must be implemented deliberately |
| Maintenance | Vendor conventions | Full ownership |
| Performance | Plugin/theme baseline varies | Can ship only required assets |
| Technical debt | Risk of override layers | Risk of custom maintenance |

The original theme is the provisional lead because the fixed visual layer is the site’s differentiator. This is not a final selection; compare plugin compatibility, editor operations, update cost and a Journey prototype in the next phase.

## Publishing gates

- Hide the Tokushoho route, footer link and sitemap entry until every operator fact is confirmed and `publicationApproval` is explicitly approved.
- Keep canonical URL, robots and sitemap derived from the approved HTTPS production URL.
- Self-host Noto Sans JP and Inter.
- Preserve `L∞P Innovate` for text/legal/metadata and the approved `LOOP Innovate` visual logo.
- Require disclosure permission and sourced metrics for every Case Study.
