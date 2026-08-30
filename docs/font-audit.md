# Font audit

Audit date: 2026-08-30. Target: Windows Chromium, 1440 × 900.

## Actual starting state

The CSS named `Inter`, but no web font was loaded. On Windows, Latin text therefore resolved mainly to Arial and Japanese text to Yu Gothic/Meiryo fallbacks. Fractional weights such as 350–470 were not guaranteed and could be synthesized differently between machines.

## A/B/C comparison

| Candidate | Hero / Journey | Body and navigation | Decision |
| --- | --- | --- | --- |
| A. System fallback | Elegant but visibly thin; weight varied by environment | Long Japanese copy was the least stable | Rejected for production consistency |
| B. Noto Sans JP + Inter | Strongest five-second legibility while preserving the editorial scale | Clear body rhythm and stable Latin labels | Adopted |
| C. Zen Kaku Gothic New + Inter | Quiet and refined, but the large Japanese headline became lighter | Body copy was less assertive on the dark surface | Not adopted |

All three retained the intended two-line Hero headline and one-line desktop descriptor at 1440 × 900 with zero horizontal overflow. B was also checked on the About hero so the decision was not based on the Journey alone.

## Implementation decision

`Inter` and `Noto Sans JP` are loaded through `next/font/google`. Next.js self-hosts the downloaded files, so production pages do not make runtime font requests to Google. CSS variables retain Yu Gothic/Meiryo as failure-safe fallbacks. Variable weights preserve the existing editorial hierarchy.

For WordPress, export and self-host the approved font files with equivalent `font-display: swap`, unicode ranges, and 300–700 weight coverage. Re-run every explicit Japanese heading break after migration.
