# SSR Hot Reload - Quick Start

## 🚀 Recommended: Use Built-in Dev Server (Solution 1)

```bash
npm run dev:ssr
```

**What it does:**
- Starts Angular SSR dev server
- Automatically clears module cache when lazy chunks change
- Single terminal, no manual restarts needed

---

## 🔄 Alternative: Use Nodemon (Solution 2)

**Terminal 1:**
```bash
npm run watch
```

**Terminal 2:**
```bash
npm run serve:ssr:watch
```

**What it does:**
- Terminal 1: Builds and watches for changes
- Terminal 2: Runs SSR server and auto-restarts on changes

---

## 🐛 Still Having Issues?

1. **Clear browser cache:** Ctrl+Shift+R
2. **Check both terminals** for errors
3. **Manually restart:** Ctrl+C then run command again
4. **Read full guide:** `docs/ssr-hot-reload-fix.md`

---

## 📝 Files Modified

- ✅ `src/server.dev.ts` - Development server with cache clearing
- ✅ `angular.json` - Uses server.dev.ts in development mode
- ✅ `nodemon.json` - Configuration for nodemon watcher
- ✅ `package.json` - Added serve:ssr:watch script

---

## ⚠️ Important Notes

- **Development:** Uses `server.dev.ts` with hot reload
- **Production:** Uses `server.ts` (standard, no cache clearing)
- **Lazy chunks** now reload properly without manual restart
- **Browser and SSR** stay in sync during development
