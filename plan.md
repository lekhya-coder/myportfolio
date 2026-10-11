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
- Build the floating assistant as a text-first, resume-grounded chatbot with suggested prompts, message timestamps, typing state, clear-history control, escape-to-close, and a compact mobile layout. Make the Avatar Lab character the visible identity in its launcher and chat header. If the server call is unavailable, provide the same shared fact response locally rather than leaving the visitor with an empty state.
- Keep the profile summary action area focused on topic-based routes (`Trace the builds` and `Find the right fit`) instead of clipboard-copy or generic conversation prompts.
- Use a display-only Contact section with the supplied phone, email, LinkedIn, GitHub, LeetCode, CodeChef, location, internship focus, and academic details; do not collect visitor-entered information.
- Add a profile-photo block with a flat, animated LS monogram, live circuit signals, and a clear label rather than inventing a real likeness. Reuse the supplied resume PDF at `/resume.pdf` for view and download actions.
- Use the official `@bible-strong/avatar-react` runtime and a customized exported Avatar Lab definition for the chat launcher, chat header, and hero mascot. The hero wakes on page load; the chatbot avatar reacts with `listening` while a visitor types, `thinking` while the assistant responds, `celebrate` after a grounded answer, and `confused` for unsupported questions. Extend the same bounded mouse-to-eye-expression behavior to the floating chatbot avatar while it is idle; keep the widget itself anchored, throttle pointer updates to animation frames, reset gaze on viewport exit or window blur, and let active chat moods take priority. Honor `prefers-reduced-motion` and keep avatar state client-side; do not add a separate visitor contact form or transmit avatar data.
- License the combined portfolio under `AGPL-3.0-only`, preserve Avatar Lab attribution and its license text, and provide a prominent footer link to a downloadable corresponding-source archive plus a link to the upstream Avatar Lab source.
- Keep the chatbot avatar in place and add a second, always-visible hero avatar as an extra branded layer. Give the hero version LS-specific state messages (`LS signal online`, `Tracking your next idea`, `Compiling a sharper answer`, `Build signal: clear`) and a clear handoff button to the existing assistant.
- Reuse the hero's subtle pointer-gaze behavior for the chatbot's floating launcher and in-panel avatar while idle; move eyes rather than the fixed chat widget, reset gaze when the pointer leaves the viewport or the window blurs, and preserve reduced-motion support.
- Add a recruiter snapshot strip and correct the achievement label to `SYNTH VISION`, including the supplied Krithomedh organizer attribution.
- Enrich every major section with resume-grounded context: a three-part About focus map, a complete technical skill breakdown, deeper project explanations, expanded strengths, and an additional technical-evidence card.
- Add a dynamic project showcase with accessible filter tabs for All signals, Embedded & IoT, Wireless control, and Problem solving, plus an animated live result count.
- In the Selected projects section headed `When theory meets a working build.`, type each project's title and its own short project-detail line into all three terminal-style visual marks as the card enters view. Keep the complete project title and detail available in the static card content for screen readers, show both immediately for reduced-motion users, and preserve all three cards, their order, copy, and filtering behavior.
- Rewrite the portfolio README in the Manus source and selected GitHub repository to follow the supplied README's scannable portfolio structure—live site, biography, verified projects, website/chatbot/avatar details, accurate stack/setup/structure/checks, and source/license links—using only Lekhya's verified details and never importing the reference author's claims.
- Present the Technical toolkit and How I show up areas as descriptive responsive cards. In the selected first Technical toolkit panel, use a 17px panel heading and skill titles, 14px subtitle, 12px metadata, and 16px descriptions with readable line-height, preserving all six cards and their order. Keep How I show up at 15px panel headings/introduction and 14px card titles/descriptions with readable line-height across desktop and mobile; give the chatbot direct View resume and Download PDF actions.
- Show CGPA 9.48/10 once in the education card, not repeatedly across the hero, About summary, recognition, evidence, or contact content. Keep the grounded chatbot able to answer a direct academic-score question.
- Enlarge readable copy in the About section with scoped responsive styles: 18px section lead and profile summary, 16px career/focus/quote copy, 14px focus-card titles, and 12–13px labels, chips, and links. Preserve the existing content, card order, state, and wrapping behavior.
- Keep chatbot routing deterministic and shared between server and client for About/profile, skills, projects, education, achievements, availability, contact, and resume questions; use the managed AI only to classify otherwise ambiguous resume-grounded questions.
- Keep `client/public/manus-routes.json` synchronized with the public root route, metadata, and descriptive initial body content.

## Requested opening and connection refinements

- Keep the opening title card's full-screen, reference-inspired split hero, but match the active color theme of the main website by inheriting its existing design tokens rather than forcing a separate light palette. In dark mode use the portfolio's navy surface and lime/cyan accents; in light mode use its existing light palette. Keep the large left-aligned live greeting/name, opportunity-status pill, supporting copy and CTAs, rounded right-side code window with subtle shadow, and four factual cards for education, institution, location, and build focus; do not copy unsupported metrics. Use only Lekhya's verified details (Vinjamuri Lekhya Sahiti, second-year B.Tech in IoT at VNRVJIET, Hyderabad, and practical hardware/logic/code focus) and do not reuse the reference author's identity, wording, claims, metrics, or contact details. Type “Hello, I'm” live and show the opening before the existing portfolio. On Enter, Skip, or the timed auto-transition, scroll the opening screen upward off-screen to reveal the website; preserve keyboard focus cycling and reduced-motion behavior.
- In the existing Technical toolkit section, show verified, labeled technology logos/icons in exactly two continuous horizontal rows that move in opposite directions, following the supplied reference's circular-mark treatment. Keep the existing six skill cards unchanged, expose one semantic skills list while hiding duplicate loop content from assistive technology, pause both rows on hover, and present one static list when reduced motion is preferred.
- Place a compact Quick connect row immediately after the About section's Profile Summary card, using the verified public email, LinkedIn, and GitHub contact destinations.

## Project structure

- `client/src/App.tsx` — app shell, theme provider, error boundary, and route table.
- `client/src/pages/Home.tsx` — editable profile data, page sections, interactions, chatbot panel, and display-only contact details.
- `client/src/components/InteractiveAvatar.tsx` — Avatar Lab renderer, compact chatbot launcher/header variant, mood-to-animation mapping, bounded hero/chat pointer expressions, and reduced-motion handling.
- `client/src/components/ProjectTypingTitle.tsx` — post-intro, scroll-triggered per-character project title and detail reveal with reduced-motion and screen-reader fallbacks.
- `client/src/assets/portfolio-avatar.avatar.json` — the portfolio's lime-accented Avatar Lab definition with 23 expressions/animations.
- `client/src/index.css` — design tokens, responsive layout, dark mode, animations, accessibility states, and component styling.
- `server/routers.ts` — public `assistant.chat` mutation with AI intent classification and fixed safe responses.
- `client/index.html` — title, description, social metadata, and font loading.
- `client/public/manus-routes.json` — crawler-visible route manifest.
- `client/public/LICENSE` and `client/public/source-code.zip` — visible AGPL license and the corresponding-source offer.
- `client/public/resume.pdf` — supplied downloadable resume artifact.
- `plan.md` / `TODO.md` — source-of-truth implementation plan and acceptance outcomes.

## Build and serving workflow

Run the configured `pnpm dev` server on port 3000 for Preview. Use `pnpm check`, `pnpm test`, and `pnpm build` before checkpointing. The server-only deployment keeps `/api/*` available for the chatbot and serves the compiled frontend from the same Express process. Keep browser-facing links relative inside the app and do not invent a canonical URL until a production origin is explicitly configured.
