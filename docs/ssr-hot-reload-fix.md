# Angular SSR Lazy Chunk Hot Reload Fix

## The Problem

When developing with Angular SSR and lazy-loaded components (`loadComponent`), the SSR server caches the lazy chunk modules in memory. When you modify a lazy component:

1. ✅ Angular CLI rebuilds the lazy chunk (e.g., `chunk-UKRSHW5W.mjs`)
2. ✅ Browser bundle updates and hot reloads
3. ❌ **SSR server still uses the OLD cached version in memory**
4. 🐛 Result: Mismatch between server-rendered HTML and client-side hydration = bugs

The message "Page reload sent to client(s)" only triggers browser reload, NOT server process restart.

---

## Solution Options

### **Solution 1: Use Custom Development Server (Recommended)**

The `server.dev.ts` file watches for changes in the `dist/silan-angular/server` folder and clears Node's module cache automatically.

**How it works:**
- Watches the server dist folder for `.mjs` file changes
- Clears module cache for all chunk files
- Reloads the bootstrap module dynamically
- No manual restart needed!

**Already configured in `angular.json`:**
```json
"development": {
    "ssr": {
        "entry": "src/server.dev.ts"
    }
}
```

**Usage:**
```bash
npm run dev:ssr
```

This uses the Angular CLI's built-in SSR dev server with the hot-reload enabled server file.

---

### **Solution 2: Use Nodemon for Auto-Restart (Alternative)**

Nodemon watches the server output folder and restarts the Node process when files change.

**Usage:**

Terminal 1 - Build and watch:
```bash
npm run watch
```

Terminal 2 - Run SSR server with nodemon:
```bash
npm run serve:ssr:watch
```

**Configuration in `nodemon.json`:**
- Watches `dist/silan-angular/server/**`
- Ignores browser bundle changes
- Auto-restarts on any `.mjs` file change
- 500ms delay to avoid rapid restarts

**Pros:**
- Simple, proven solution
- Works with existing server.ts
- Separate from Angular CLI

**Cons:**
- Requires running two terminals
- Full process restart (slightly slower)

---

### **Solution 3: Manual Restart (Fallback)**

If neither solution works, you can manually restart:

**For `ng serve --ssr`:**
```bash
Ctrl+C
npm run dev:ssr
```

**For standalone server:**
```bash
Ctrl+C
npm run serve:ssr:silan-angular
```

---

## Installation

If using Solution 2 (nodemon), install the dependency:

```bash
npm install --save-dev nodemon
```

---

## Comparison

| Solution | Setup | Speed | Reliability | Terminals |
|----------|-------|-------|-------------|-----------|
| Custom server.dev.ts | ⭐⭐⭐ Easy | ⚡⚡⚡ Fast | ⭐⭐⭐ High | 1 |
| Nodemon | ⭐⭐ Medium | ⚡⚡ Medium | ⭐⭐⭐ High | 2 |
| Manual restart | ⭐⭐⭐ None | ⚡ Slow | ⭐⭐ Medium | 1 |

---

## Recommended Workflow

**Development with Hot Reload:**
```bash
npm run dev:ssr
```

This starts the Angular SSR dev server with:
- ✅ Automatic lazy chunk cache clearing
- ✅ Live browser reload
- ✅ Server-side hot reload
- ✅ Single terminal

**Production Build:**
```bash
npm run build
npm run serve:ssr:silan-angular
```

Production uses the standard `server.ts` without dev-specific module cache clearing.

---

## Technical Details

### Why This Happens

Node.js caches ES modules using their resolved file path. When you use dynamic imports:

```typescript
loadComponent: () => import('./lazy.component').then(m => m.Component)
```

Node resolves this ONCE and caches the module. Subsequent imports return the cached version, even if the file on disk changed.

### How Solution 1 Works

```typescript
// Clear specific module from cache
delete require.cache[modulePath];

// Force re-import with cache-busting query param
await import(`./main.server.mjs?t=${Date.now()}`);
```

### How Solution 2 Works

Nodemon watches file changes and sends `SIGTERM` to the Node process, causing a full restart. This clears ALL module caches naturally.

---

## Troubleshooting

**Issue: "Module not found" errors**
- Make sure the build completed before the server tries to reload
- Check `nodemon.json` delay setting (increase if needed)

**Issue: Still seeing old cached version**
- Clear browser cache (Ctrl+Shift+R)
- Check if using the correct npm script
- Verify `angular.json` has the `server.dev.ts` entry for development

**Issue: Server crashes on file change**
- Check for syntax errors in your components
- Look at the terminal output for the actual error
- May need to manually restart once to recover

---

## Additional Tips

1. **Disable browser cache during development:**
   - Open DevTools → Network tab → Check "Disable cache"

2. **Use Angular DevTools extension:**
   - Helps debug hydration mismatches

3. **Monitor both terminals:**
   - If using nodemon, watch both build and serve outputs

4. **Keep dependencies updated:**
   - `@angular/ssr` and `@angular/build` should be latest versions

---

## Scripts Reference

```json
{
  "dev:ssr": "ng run silan-angular:serve-ssr",           // Development with hot reload
  "serve:ssr:watch": "nodemon",                          // Alternative with nodemon
  "serve:ssr:silan-angular": "node dist/.../server.mjs", // Production server
  "watch": "ng build --watch --configuration development" // Build watcher
}
```
