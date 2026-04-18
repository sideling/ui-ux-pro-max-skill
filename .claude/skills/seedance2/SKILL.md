---
name: ckm:seedance2
description: "Seedance2 video prompt engineering for camera angles, movements, cuts, and transitions. Generate cinematic AI video with precise shot language."
argument-hint: "[shot-type | movement | transition | topic]"
metadata:
  author: nextlevelbuilder
  version: "1.0.0"
---

# Seedance2 — Camera & Editing Intelligence

Seedance2 is ByteDance's video generation model. This skill provides a complete cinematography vocabulary for writing precise, cinematic Seedance2 prompts — covering every camera angle, movement, cut, and transition used in professional filmmaking.

## When to Use

- User asks about Seedance2 prompts, video generation, or AI video
- User wants camera angle terminology or shot types
- User needs cutting, editing, or transition vocabulary
- User asks "how do I describe camera movement in a prompt"
- User invokes `/seedance2`

## Reference Library

| Topic | File | Contains |
|-------|------|----------|
| Camera Angles & Shots | `references/camera-angles.md` | 40+ shot types with prompt keywords |
| Camera Movements | `references/camera-movements.md` | 30+ movement techniques with descriptions |
| Cuts & Transitions | `references/editing-transitions.md` | 25+ editing techniques with use cases |
| Prompt Templates | `references/prompt-templates.md` | Ready-to-use Seedance2 prompt formulas |

## Routing

1. Parse `$ARGUMENTS` for intent keywords
2. If `angle` / `shot` / `framing` → load `references/camera-angles.md`
3. If `movement` / `motion` / `pan` / `dolly` → load `references/camera-movements.md`
4. If `cut` / `transition` / `edit` / `wipe` → load `references/editing-transitions.md`
5. If `prompt` / `template` / `generate` → load `references/prompt-templates.md`
6. If broad request ("list all", "best") → load all four references and synthesize
7. Always output prompt-ready keywords the user can copy directly into Seedance2

## Output Format

For each technique, provide:
- **Name** — official cinematography term
- **Seedance2 keyword** — exact prompt text
- **Effect** — what it achieves visually
- **Best for** — ideal scenes/genres
- **Example prompt snippet** — copy-paste ready

## Quick Reference

```
ANGLES:  extreme wide shot · wide shot · medium shot · close-up · extreme close-up
         over-the-shoulder · point of view · bird's eye · worm's eye · dutch angle

MOVES:   pan · tilt · dolly in/out · truck · pedestal · crane · arc · handheld
         steadicam · whip pan · push in · pull back · drone · zoom · rack focus

CUTS:    straight cut · jump cut · match cut · J-cut · L-cut · smash cut
         dissolve · fade in/out · wipe · iris · cross-dissolve · montage
```
