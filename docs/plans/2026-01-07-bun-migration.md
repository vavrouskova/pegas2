# Migrace z Node.js/npm na Bun

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Nahradit Node.js a npm za Bun pro rychlejší instalaci závislostí a spouštění skriptů.

**Architecture:** Bun je drop-in replacement pro Node.js a npm. Migrace zahrnuje instalaci Bun, odstranění npm lock souboru, vytvoření Bun konfigurace a reinstalaci závislostí.

**Tech Stack:** Bun 1.x, Next.js 16, React 19

---

## Předpoklady

- macOS (Darwin) - systém uživatele
- Homebrew nainstalovaný (doporučeno pro instalaci Bun)
- Aktuální verze Node.js: v22.13.1

## Potenciální rizika

1. **Sentry SDK** - @sentry/nextjs může mít problémy s Bun, je třeba otestovat
2. **Native moduly** - `sharp` může vyžadovat rekompilaci
3. **React Compiler** - experimentální feature, může mít edge cases

---

### Task 1: Instalace Bun

**Files:**
- Žádné soubory se nemění

**Step 1: Nainstaluj Bun přes Homebrew**

```bash
brew install oven-sh/bun/bun
```

**Step 2: Ověř instalaci**

Run: `bun --version`
Expected: Verze Bun (např. `1.1.x` nebo novější)

**Step 3: Ověř, že Bun je v PATH**

Run: `which bun`
Expected: `/opt/homebrew/bin/bun` nebo podobná cesta

---

### Task 2: Vytvoření Bun konfigurace

**Files:**
- Create: `bunfig.toml`
- Delete: `.npmrc` (po migraci již nepotřebný)

**Step 1: Vytvoř bunfig.toml**

Vytvoř soubor `bunfig.toml` v kořenu projektu:

```toml
[install]
# Ekvivalent legacy-peer-deps=true z .npmrc
peer = false

[install.lockfile]
# Použij textový lockfile pro lepší git diff
print = "yarn"
```

**Step 2: Ověř syntaxi**

Run: `bun --help`
Expected: Help output bez chyb (potvrzuje, že Bun čte config správně)

---

### Task 3: Záloha a odstranění npm artefaktů

**Files:**
- Delete: `package-lock.json`
- Delete: `node_modules/`

**Step 1: Vytvoř zálohu package-lock.json (volitelné)**

```bash
cp package-lock.json package-lock.json.backup
```

**Step 2: Odstraň node_modules**

```bash
rm -rf node_modules
```

**Step 3: Odstraň package-lock.json**

```bash
rm package-lock.json
```

**Step 4: Ověř čistý stav**

Run: `ls -la | grep -E "(node_modules|package-lock)"`
Expected: Žádný výstup (soubory neexistují)

---

### Task 4: Instalace závislostí přes Bun

**Files:**
- Create: `bun.lockb` (automaticky vygenerováno)

**Step 1: Spusť bun install**

```bash
bun install
```

Expected:
- Rychlá instalace (výrazně rychlejší než npm)
- Vytvoření `bun.lockb` souboru
- Vytvoření `node_modules/` adresáře

**Step 2: Ověř, že bun.lockb existuje**

Run: `ls -la bun.lockb`
Expected: Soubor existuje s přiměřenou velikostí

**Step 3: Ověř, že kritické balíčky jsou nainstalovány**

Run: `ls node_modules/next node_modules/react node_modules/@sentry`
Expected: Adresáře existují

---

### Task 5: Aktualizace package.json skriptů

**Files:**
- Modify: `package.json`

**Step 1: Aktualizuj skripty pro explicitní použití Bun**

Změň sekci `scripts` v `package.json`:

```json
{
  "scripts": {
    "dev": "bun --bun next dev --turbopack",
    "build": "bun --bun next build --turbopack",
    "start": "bun --bun next start",
    "lint": "bun eslint"
  }
}
```

**Poznámka:** Flag `--bun` zajistí, že Next.js běží v Bun runtime místo Node.js.

---

### Task 6: Testování dev serveru

**Files:**
- Žádné změny

**Step 1: Spusť dev server**

```bash
bun run dev
```

Expected:
- Server nastartuje bez chyb
- Turbopack se inicializuje
- Aplikace je dostupná na `http://localhost:3000`

**Step 2: Otevři prohlížeč a ověř funkčnost**

- Načti hlavní stránku
- Zkontroluj konzoli v DevTools pro chyby
- Ověř, že hot reload funguje (uprav nějaký komponent)

**Step 3: Zastav server**

`Ctrl+C`

---

### Task 7: Testování production buildu

**Files:**
- Žádné změny

**Step 1: Spusť build**

```bash
bun run build
```

Expected:
- Build proběhne bez chyb
- Sentry source maps se nahrají (pokud je CI)
- `.next/` adresář je vytvořen

**Step 2: Spusť production server**

```bash
bun run start
```

Expected:
- Server nastartuje
- Aplikace běží na `http://localhost:3000`

**Step 3: Ověř funkčnost v production módu**

- Otevři stránku v prohlížeči
- Zkontroluj, že stránky se načítají správně

---

### Task 8: Testování lintu

**Files:**
- Žádné změny

**Step 1: Spusť lint**

```bash
bun run lint
```

Expected:
- ESLint proběhne bez chyb
- Případné linting chyby jsou očekávané (existující problémy)

---

### Task 9: Odstranění nepotřebných souborů

**Files:**
- Delete: `.npmrc`
- Delete: `package-lock.json.backup` (pokud existuje)

**Step 1: Odstraň .npmrc**

```bash
rm .npmrc
```

**Step 2: Odstraň zálohu (pokud existuje)**

```bash
rm -f package-lock.json.backup
```

---

### Task 10: Aktualizace CLAUDE.md

**Files:**
- Modify: `CLAUDE.md`

**Step 1: Aktualizuj sekci Development Commands**

Změň sekci `## Development Commands`:

```markdown
## Development Commands

```bash
# Start development server with Turbopack (using Bun runtime)
bun run dev

# Build for production with Turbopack
bun run build

# Start production server
bun run start

# Run linter
bun run lint

# Install dependencies
bun install
```
```

**Step 2: Přidej poznámku o Bun do Architecture sekce**

Přidej na začátek sekce `## Architecture`:

```markdown
### Runtime

- Uses **Bun** as JavaScript runtime and package manager (instead of Node.js/npm)
- Bun provides faster dependency installation and script execution
- Configuration in `bunfig.toml`
```

---

### Task 11: Commit změn

**Files:**
- Všechny změněné soubory

**Step 1: Zkontroluj stav**

```bash
git status
```

Expected:
- Deleted: `package-lock.json`, `.npmrc`
- New: `bun.lockb`, `bunfig.toml`
- Modified: `package.json`, `CLAUDE.md`

**Step 2: Přidej soubory**

```bash
git add -A
```

**Step 3: Vytvoř commit**

```bash
git commit -m "chore: migrate from Node.js/npm to Bun

- Replace npm with Bun package manager
- Add bunfig.toml configuration
- Update package.json scripts to use Bun runtime
- Remove package-lock.json and .npmrc
- Update CLAUDE.md with Bun commands

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Troubleshooting

### Sharp modul nefunguje

Pokud `sharp` způsobuje problémy:

```bash
bun remove sharp
bun add sharp
```

### Sentry nefunguje

Pokud Sentry SDK má problémy s Bun runtime, lze použít Node.js pro build:

```json
{
  "scripts": {
    "build": "next build --turbopack"
  }
}
```

A spouštět přes `bun run build` (Bun spustí next přímo, bez `--bun` flagu).

### Rollback na npm

Pokud je potřeba vrátit se k npm:

```bash
rm -rf node_modules bun.lockb bunfig.toml
git checkout package.json .npmrc
npm install
```

---

## Verifikace dokončení

Po dokončení všech tasků ověř:

1. ✅ `bun --version` funguje
2. ✅ `bun run dev` spustí dev server
3. ✅ `bun run build` vytvoří production build
4. ✅ `bun run start` spustí production server
5. ✅ `bun run lint` spustí ESLint
6. ✅ Aplikace funguje v prohlížeči bez chyb
7. ✅ Git commit je vytvořen
