# Complete BioDapt Project

## Goal Description
Resolve all outstanding issues: high‑severity npm vulnerabilities, missing UI components, premium visual polish (glass‑morphism, micro‑animations, dark mode), SEO/meta tags, theme persistence, and ensure the build script runs on Windows with proper execution policy.

## User Review Required
> [!IMPORTANT]
> Please confirm:
> - Use Google Font **Inter** (or specify another).
> - Persist dark‑mode preference in `localStorage`?
> - Add copy‑to‑clipboard buttons on the API Docs page?
> - Any additional pages you need beyond the current set?

## Open Questions
> [!WARNING]
> - Should we upgrade any dependencies (e.g., React 19 to latest) to resolve vulnerabilities?
> - Do you want the build step to produce a production bundle now, or only dev testing?

## Proposed Changes
---
### Front‑end
- **src/components/Header.tsx**: Add theme toggle (sun/moon) with `useTheme` hook, store in `localStorage`.
- **src/index.css**: Import Inter font, set `font-family`, add `.glass-card` utilities (backdrop‑blur, translucent background). Apply to `RecommendationCard`, `InfoCard`, material cards.
- **src/App.tsx**: Wrap routes with a `ContentPage` component that uses `react-helmet-async` for dynamic `<title>` and `<meta description>`.
- **Dark mode**: Ensure Tailwind `dark:` variants everywhere, test contrast.
- **Micro‑animations**: Use `framer-motion` hover effects on cards, buttons, and metric icons.
- **Missing pages**: Implement full JSX for `ApiDocsPage` (add copy‑to‑clipboard), `PricingPage`, `ResearchPage`, `DatasetPage`, `ModelPage`, `CasesPage`, `FaqPage`, `ContactPage` with responsive layout and SEO.
- **PolicyPage / LicensePage**: Add back‑link to home, consistent styling.
- **Theme persistence**: Create `hooks/useTheme.ts` that reads/writes `localStorage` and toggles `document.documentElement.classList`.

### Back‑end
- No changes required; endpoints already functional.

### Vite Configuration
- **vite.config.ts**: Add `server.proxy` to forward `/api/*` to `http://localhost:5000`.
- Ensure Tailwind plugin and React plugin are imported.

### Tailwind Configuration
- Verify `darkMode: 'class'` is set.
- Add custom plugin for `.glass-card` (backdrop‑blur, border, background opacity).
- Add required `dark:` color variants.

### Security & Build
- Run `npm audit fix --force` (already attempted) – we will adjust PowerShell execution policy.
- Add PowerShell script in `README.md`:
```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned -Force
```
- Update `package.json` scripts to include a safe build command.
- Ensure `npm run build` works after policy change.

### Development Workflow
- Document steps in `README.md` for `npm run dev:full` and building production.

## Verification Plan
### Automated Tests
- Run `npm run dev:full` and check console for errors.
- Navigate each route (`/`, `/advisor`, `/materials`, `/radar`, `/about`, `/api-docs`, `/pricing`, `/research`, `/dataset`, `/model`, `/cases`, `/faq`, `/contact`, `/privacy`, `/terms`, `/license`).
- Verify theme toggle persists after reload.
- Verify copy‑to‑clipboard works (clipboard API).
- Run `npm audit` to ensure no high severity vulnerabilities remain.
- Run `npm run build` successfully.

### Manual Verification
- Visually inspect dark mode, glass‑morphism cards, hover animations.
- Test SEO meta tags via browser dev tools.
- Test responsive layout on mobile widths.
- Confirm API Docs copy‑to‑clipboard copies correct endpoint URLs.
