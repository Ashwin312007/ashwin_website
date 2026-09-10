# Spatial / Liquid Glass portfolio redesign

## Direction

Use a simple, premium spatial interface with a dark midnight palette, as requested in the latest color revision. Preserve all portfolio facts, projects, résumé links, filters, native dialogs, and optional terminal. This is a web interpretation of glass materials, not Apple's native Liquid Glass rendering.

## Plan and design system

1. Environment: deep charcoal and midnight blue, with restrained indigo and teal ambient light behind smoky translucent surfaces.
2. Hierarchy: a centered personal introduction; floating pill navigation; a separate three-item highlights dock.
3. Materials: low-opacity silver edge highlights, subtle inner reflections, dark shadows, and backdrop blur. Use off-white text and pale-blue accents, including dialogs, mobile menus, focus states, and solid fallbacks.
4. Content: spacious rounded project panels, one featured rover contribution diagram, compact expandable experience, and filterable skills.
5. Consistency: carry the material, radius, typography, and focus treatment through the mobile menu, project dialogs, contact actions, favicon, and terminal.
6. Accessibility: visible focus, native modal keyboard behavior, reduced-motion and reduced-transparency styling, and solid surface fallbacks.
7. Validation: production build, changed-file lint, visual checks at desktop and phone sizes, overflow checks, and representative interaction checks.

## Skills and references

- Sites building: preserve the existing Next.js application and hosting configuration; apply one coherent visual system across the page.
- Browser: inspect the actual rendered interface and check responsive layout and interactions.
- Local Next.js 16.2.4 CSS documentation.
- [Apple Materials guidance](https://developer.apple.com/design/human-interface-guidelines/materials): material hierarchy, navigation, and legibility.
- [Apple Liquid Glass overview](https://developer.apple.com/documentation/TechnologyOverviews/liquid-glass): depth, fluidity, and consistent hierarchy.
- Earlier research: [Anthropic frontend-design](https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md) and [Vercel Web Interface Guidelines](https://github.com/vercel-labs/web-interface-guidelines).

The previous conceptual artwork is retained in public/images but is no longer displayed in the hero. No additional image, video, hosting, or plugin installation is needed for this CSS-native redesign.

## Verification of the preceding spatial layout

- Production build and TypeScript passed. Google Font fetching required network-enabled build execution.
- Changed TypeScript/TSX files passed ESLint.
- Reviewed desktop hero, project, and contact layouts, plus the 390px phone hero and 320px project dialog.
- No horizontal overflow at measured 320px, 390px, and 768px viewport widths.
- Mobile menu navigation and skill filtering passed. Project dialogs keep keyboard focus inside; Escape closes and restores the opener's focus.
- Terminal opens and closes with the matching light material. No browser console errors reported during these checks.
- Darkened the primary button gradient after measuring white-text contrast on its lightest stop.

## Delivery boundary

The user approved publishing this redesign to the existing GitHub repository and its connected Vercel website. Preserve that deployment setup; do not create a separate hosted site.
