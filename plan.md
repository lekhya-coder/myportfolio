# Professional Resume Portfolio — Implementation Plan

## Product direction

A single-page personal resume portfolio for recruiters, technical selection teams, and professional networking. The page uses editable profile data from the supplied resume, distinguishes selected practice from employment history, presents resume evidence instead of unattributed testimonials, and includes a server-backed AI recruiter assistant that classifies questions and returns only shared resume-grounded answers.

## Design system

- **Design movement:** editorial Swiss-modernism with a quiet technology-studio finish: disciplined typography, strong alignment, generous whitespace, and precise utility details rather than decorative noise.
- **Core principles:** (1) scan-first hierarchy for recruiters, (2) credible and calm visual language, (3) purposeful motion that communicates state, and (4) every interactive element is keyboard-accessible and visibly labeled.
- **Color philosophy:** deep navy creates trust and focus; warm paper and white surfaces keep the portfolio human and legible; charcoal provides durable contrast; a restrained electric-lime accent marks actions and availability without becoming playful.
- **Layout paradigm:** a left-rail navigation and metadata spine paired with full-width editorial sections. Content is grouped by narrative rhythm—statement, proof, selected work, social proof, conversation—instead of a repeated centered card grid.
- **Signature elements:** lime hairline rules, monospaced section indexes such as `01 / profile`, outlined pill tags that read like a compact recruiter brief, a subtle technical grid, and the hero’s `01 / BUILD SIGNAL` marker.
- **Interaction philosophy:** controls feel like tools in a studio—direct, reversible, and quiet. Theme switching preserves the user's preference, the chatbot keeps its context locally, and anchors expose the next action.
- **Animation:** use short ease-out reveals on section entry, a slow hero orbital detail, restrained hover translation on project cards, and an intentionally visible typing state in the assistant. Respect `prefers-reduced-motion` by disabling nonessential transitions.
- **Typography system:** `DM Sans` for readable UI and body copy, paired with `Space Mono` for labels, dates, metrics, and the wordmark. Headlines use tight tracking and a clear 48–72px desktop scale; body copy stays in a 15–18px readable range.
- **Brand essence:** a focused, evidence-led professional profile that helps a hiring team understand fit in under two minutes. Personality: **precise, thoughtful, quietly ambitious**.
- **Brand voice:** clear, warm, and specific; no inflated claims. Example lines: “I turn complex product problems into calm, useful systems.” and “Ask the assistant for a faster route through the work.”
- **Wordmark & logo:** a compact 3D `LS /` monogram badge with layered depth and a small circuit icon, paired with a two-line wordmark instead of a generic text logo.
- **Signature brand color:** `#C7F36B` electric lime, used only for actions, focus states, availability, and the portfolio's editorial rule system.

## Implementation approach

- Use the initialized React + Express + tRPC starter. Keep the page public and self-contained; no database is needed for placeholder profile data or local chat history.
- Build the portfolio page in `client/src/pages/Home.tsx` with small local render helpers for repeated sections, keeping the data model at the top of the file for easy replacement.
- Replace the starter CSS with a responsive design-token system in `client/src/index.css`, using CSS custom properties for light/dark themes and a mobile-first layout.
- Enable the existing switchable `ThemeProvider` and persist the theme preference in local storage.
- Add a public `assistant.chat` tRPC mutation backed by the managed `invokeLLM` helper as a narrow intent classifier. The returned intent selects a fixed response from `shared/profileFacts.ts`, so AI classification cannot introduce unsupported employers, metrics, dates, or project details.
- Build the floating assistant in the page with suggested prompts, message timestamps, typing state, clear-history control, escape-to-close, and a compact mobile layout. If the server call is unavailable, provide the same shared fact response locally rather than leaving the visitor with an empty state.
- Use a display-only Contact section with the supplied phone, email, LinkedIn, GitHub, LeetCode, CodeChef, location, internship focus, and academic details; do not collect visitor-entered information.
- Add a profile-photo block with initials and a clear label rather than inventing a real likeness. Reuse the supplied resume PDF at `/resume.pdf` for view and download actions.
- Add a recruiter snapshot strip and correct the achievement label to `SYNTH VISION`, including the supplied Krithomedh organizer attribution.
- Enrich every major section with resume-grounded context: a three-part About focus map, a complete technical skill breakdown, deeper project explanations, expanded strengths, and an additional technical-evidence card.
- Add `public/manus-routes.json`, metadata, and descriptive initial body content for the public root route.

## Project structure

- `client/src/App.tsx` — app shell, theme provider, error boundary, and route table.
- `client/src/pages/Home.tsx` — editable profile data, page sections, interactions, chatbot panel, and display-only contact details.
- `client/src/index.css` — design tokens, responsive layout, dark mode, animations, accessibility states, and component styling.
- `server/routers.ts` — public `assistant.chat` mutation with AI intent classification and fixed safe responses.
- `client/index.html` — title, description, social metadata, and font loading.
- `public/manus-routes.json` — crawler-visible route manifest.
- `public/resume.pdf` — supplied downloadable resume artifact.
- `plan.md` / `TODO.md` — source-of-truth implementation plan and acceptance outcomes.

## Build and serving workflow

Run the configured `pnpm dev` server on port 3000 for Preview. Use `pnpm check`, `pnpm test`, and `pnpm build` before checkpointing. The server-only deployment keeps `/api/*` available for the chatbot and serves the compiled frontend from the same Express process. Keep browser-facing links relative inside the app and do not invent a canonical URL until a production origin is explicitly configured.
