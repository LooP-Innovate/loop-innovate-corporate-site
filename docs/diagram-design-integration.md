# Diagram Design integration

## Status

- Source: `cathrynlavery/diagram-design`
- Reviewed: repository `README.md` and `skills/diagram-design/SKILL.md`
- Installed skill: `<CODEX_SKILLS_DIR>/diagram-design`
- Project profile marker: `/.diagram-design` → `loop-innovate`
- Portable profile source: `/references/diagram-design/loop-innovate.md`

The repository was first registered as a Codex marketplace. Codex CLI 0.133.0
successfully fetched the marketplace, but did not enumerate its root-local
plugin entry, so `diagram-design@diagram-design` could not be installed as a
managed plugin. The inner Agent Skill was then installed with Codex's official
`skill-installer` from the GitHub path `skills/diagram-design`.

Repository retrieval and skill registration are separate:

- The marketplace snapshot under the Codex cache is a fetched Git repository.
- `~/.codex/skills/diagram-design` is the persistent standalone skill used by
  Codex from the next turn onward.
- This project's `.diagram-design` marker selects a named brand profile. The
  marker does not install the skill by itself.

## L∞P diagram skin

The profile is derived from `styles/tokens.css`, `docs/design-system.md`, and
`skills/loop-brand/SKILL.md`.

| Role | Light | Dark |
| --- | --- | --- |
| Paper | `#f4f4f4` | `#07111d` |
| Raised paper | `#e9edf0` | `#0c1a28` |
| Ink | `#101820` | `#f7fbff` |
| Muted | `#5f666c` | `#b3bbc4` |
| Accent | `#328bd3` | `#7fcce8` |
| Link | `#165f9c` | `#7fcce8` |

Typography follows the site's declared system stacks: Helvetica Neue/display,
Inter/body with Japanese-capable fallbacks, and Consolas/technical labels. No
new webfont or npm dependency is introduced.

Diagrams retain Diagram Design's 4px coordinate grid and connector rules while
following the site language: quiet, premium, architectural, restrained;
blue/cyan only for 1–2 focal elements; no cyberpunk glow, fake telemetry,
generic SaaS card walls, or decorative infinity outside RETURN.

## Invocation

In a new Codex turn, use either natural language or the explicit skill name:

```text
$diagram-design L∞P InnovateのAI-FDEプロセスを、Web埋め込み用のprocess図として作成して
```

Useful requests:

```text
$diagram-design サービス説明をdata-flow図にして
$diagram-design AI-FDEの判断分岐をflowchartで作成して
$diagram-design FIELD→ORDER→DESIGN→BUILD→ADOPT→RETURNをloop図にして
```

Before drawing, specify or confirm the diagram type, size preset, content cuts,
and whether HTML/SVG/PNG export is required. Static self-contained HTML is the
default. Run the installed checker against generated output:

```powershell
python <CODEX_SKILLS_DIR>/diagram-design/scripts/self_check.py <diagram.html>
```

Managed marketplace updates, if supported by a future Codex CLI release, may
replace a plugin working copy. The named profile and this project marker are
kept separately so the L∞P skin survives that transition.
