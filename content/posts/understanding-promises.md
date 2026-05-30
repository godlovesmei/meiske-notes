---
title: Understanding promises in JavaScript
description: A short mental model for async flow — when to reach for promises, async/await, and error boundaries.
date: 2026-05-12
category: learn
---

JavaScript concurrency is cooperative: one thread, many tasks interleaved. Promises represent a value that will exist later. Treat them as contracts, not callbacks with extra steps.

## The mental model

A promise has three states: pending, fulfilled, or rejected. Once settled, it never changes. That immutability is what makes `async/await` predictable — you are not juggling nested callbacks, you are awaiting a single outcome.

```js
async function fetchUser(id) {
  const response = await fetch(`/api/users/${id}`)
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }
  return response.json()
}
```

## Error handling

Unhandled rejections are silent failures in production. Always decide where errors surface:

- **At the boundary** — API routes and server handlers catch and map to HTTP status codes.
- **At the call site** — UI code shows a toast or inline message.
- **Never both** — double-wrapping hides the original stack trace.

## When to parallelize

`Promise.all` runs tasks concurrently; `Promise.allSettled` keeps going after failures. Use `all` when every result is required; use `allSettled` for independent telemetry or prefetching.

## Takeaway

Reach for `async/await` for readability. Reach for raw promises when you need combinators (`race`, `any`, `all`). Keep error handling at the layer that can act on it.
