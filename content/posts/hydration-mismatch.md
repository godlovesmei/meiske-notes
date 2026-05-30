---
title: Debugging a Vue hydration mismatch
description: What the warning means, the usual suspects, and a checklist I run before blaming the framework.
date: 2026-05-24
category: debugging
tags:
  - vue
  - ssr
---

Hydration mismatches mean the HTML the server sent does not match what the client Vue app expects on first paint. Vue recovers, but you lose SSR benefits and may see flicker.

## Read the warning carefully

The console names the component and often the DOM node. Start there — not in unrelated layout files.

## Common causes

| Cause | Fix |
| --- | --- |
| `Date.now()` or `Math.random()` in template | Move to `onMounted` or pass from server |
| Browser-only APIs during SSR | Wrap in `<ClientOnly>` or `import.meta.client` guard |
| Invalid HTML nesting | Fix markup (`<p>` inside `<p>`, etc.) |
| Third-party widgets injecting markup | Load script after mount |

## Minimal reproduction

Strip the page to static markup. Add one dynamic piece back at a time. Hydration bugs compound — a single stray `new Date()` in a footer can poison the whole tree.

## Verification

```bash
pnpm build && pnpm preview
```

Test with JavaScript disabled in DevTools (briefly) to confirm server HTML is sane. Re-enable JS and watch the console on hard refresh.

## After the fix

Add a regression test or a lint rule if the bug was structural (invalid HTML). For one-off timing issues, a short comment near the guard documents intent for future you.
