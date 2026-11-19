# Resolyx Brand Assets

This directory contains official brand assets for the Resolyx AI Helpdesk application.

## Approved Logo Specification
- **Symbol**: Headset and speech-bubble symbol with integrated cyan checkmark accent.
- **Symbol Gradient**: Electric blue (`#0284C7`) to radiant cyan (`#06B6D4`) and purple (`#8B5CF6`).
- **Checkmark Accent**: Glowing cyan.
- **Wordmark**: Resolyx (lowercase geometric typography with glowing cyan 'i' dot and gradient 'x').
- **Subtitle**: "AI Helpdesk" (cyan `#06B6D4` / `#38BDF8`).
- **Reference Background**: Dark slate / charcoal (`#1E2225` / `#0B1020`).

## Recommended Files
Place your exported logo files in this directory:
- `resolyx.png`: Official primary logo (full lockup on dark background).
- `resolyx-symbol.png`: Standalone headset speech-bubble symbol with checkmark.

## In-Code Fallback
The `ResolvaLogo` and `BrandMark` components (`src/components/brand/`) automatically check for `/brand/resolyx.png`. If the raster file is not present or fails to load, it falls back seamlessly to the precision SVG vector representation matching these exact specifications, ensuring pixel-perfect fidelity at any display resolution.
