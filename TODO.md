# Resume Portfolio Acceptance Outcomes

## Recruiter-facing portfolio experience
- [x] The website provides a polished, responsive single-page interface with a navy/white/charcoal palette, electric accent color, readable typography, smooth scrolling, subtle motion, visible focus states, and mobile navigation.
- [x] The sticky navigation exposes Overview, About, Experience, Projects, and Contact sections, with a light/dark mode toggle, social/profile links, back-to-top action, and accessible labels.
- [x] The hero introduces Vinjamuri Lekhya Sahiti as a second-year B.Tech student in Internet of Things at VNRVJIET, highlights CGPA 9.48/10 and internship availability, and provides resume view, resume download, and contact actions.
- [x] The recruiter snapshot strip summarizes current focus, core practice, hands-on IoT work, and academic standing without claiming unsupported proficiency scores.
- [x] On initial load, show the original site's full-screen opening title card, type “Hello, I'm” live, and present Vinjamuri Lekhya Sahiti's verified profile details. Match the original card's appearance and theme, preserve its Enter and Skip controls, focus behavior and reduced-motion support, and scroll the card upward to reveal the website on Enter, Skip, or the original timed transition.
- [x] In the Technical toolkit, preserve the original sequence of section title, explanatory copy, two continuous horizontal rows of verified skill logos/icons, then the existing skill cards. The first row scrolls left and the second right, using seamless duplicate loops; pause both on hover, expose one semantic skills list while hiding duplicates from assistive technology, and show a static list for reduced-motion users.

## Resume-grounded evidence
- [x] The About section presents the supplied profile summary, career goal, strengths, academic record, and interest in software development, AI, problem solving, and embedded systems.
- [x] The technical section lists C, C++, Java, Data Structures, Problem Solving, HTML, CSS, JavaScript, NodeMCU, sensors, microcontrollers, and IoT using qualitative practice signals rather than invented numeric ratings.
- [x] The Technical toolkit and How I show up areas use responsive descriptive boxes with short context paragraphs instead of table-like rows.
- [x] The selected-practice timeline distinguishes project work, coding-platform practice, and hackathon participation rather than presenting unsupported employment history.
- [x] The education section presents the B.Tech in IoT, VNRVJIET, 2nd Year status, CGPA 9.48/10, and supplied coursework areas.
- [x] The projects section presents the Underground Soil Moisture Detection System, NodeMCU Wi-Fi Controlled Smart Car, and algorithmic practice with descriptive visual placeholders and supplied technologies; it does not invent live-demo or repository URLs that were not supplied.
- [x] The project showcase provides accessible dynamic filters for All signals, Embedded & IoT, Wireless control, and Problem solving, and updates the visible build count as the selected filter changes.
- [x] The achievements section identifies the SYNTH VISION Hackathon finalist experience, explicitly noting it was conducted by Krithomedh, alongside coding-platform practice and the CGPA 9.48/10 academic record.
- [x] The evidence section is labeled as resume evidence and academic/technical highlights, not as third-party testimonials.

## Contact and assistant
- [x] The final Contact section is display-only and does not collect visitor-entered name, email, subject, or message data.
- [x] The Contact section displays direct email, phone, LinkedIn, GitHub, LeetCode, CodeChef, location, internship focus, core strengths, and academic details.
- [x] A floating resume assistant opens from the bottom-right, supports suggested questions, timestamps, typing state, clear history, Escape-to-close, and responsive layout.
- [x] The open resume assistant provides direct View resume and Download PDF actions linked to the supplied `/resume.pdf`.
- [x] The assistant classifies ambiguous questions with the managed AI service but returns only fixed responses from a shared resume-grounded fact source; it does not forward chat history into future classification turns or echo unsupported generated facts.
- [x] Server and client fallback routing share one intent map covering About/profile, technical skills, projects, education, achievements, availability, contact details, and resume access, with focused tests for each topic and safe unknown-question handling.
- [x] Place a compact Quick connect row immediately after the About section's Profile Summary card, with email, LinkedIn, and GitHub links using the verified profile contact destinations.

## Avatar Lab and licensing
- [x] The portfolio uses the exact `@bible-strong/avatar-react` runtime and an Avatar Lab definition: the hero plays `waking` on page load, the mascot plays `listening` while the visitor types, `thinking` while the assistant responds, and `celebrate` after a grounded answer; the hero tracks pointer direction and all avatar motion respects `prefers-reduced-motion`.
- [x] The Avatar Lab character is the visible text-chatbot identity in both the floating launcher and chat header. Typing, backend thinking, grounded replies, and unsupported questions map to `listening`, `thinking`, `celebrate`, and `confused` avatar states; while idle, the floating launcher and in-panel avatar gaze toward the mouse using bounded expressions, reset gaze to neutral on viewport exit or window blur, keep the chat widget anchored, and respect `prefers-reduced-motion`; clearing chat restores its welcome and neutral state.
- [x] The combined project declares AGPL-3.0-only, includes the license text and Avatar Lab attribution, and visibly offers a downloadable corresponding-source archive plus a link to the upstream Avatar Lab source.

## Readability and academic emphasis
- [x] Technical toolkit cards use 15px titles and 14px supporting text; How I show up uses 15px panel headings/introduction and 14px card titles/descriptions with readable 1.65+ description line-height on desktop and mobile. CGPA 9.48/10 appears once in the education card—not repeated in the hero, About, proof strip, recognition, evidence, or contact content—while the grounded chatbot retains its direct academic-answer behavior.
- [x] In the About section (`#about`), enlarge the section lead and profile-summary body to 18px, career/focus/quote copy to 16px, focus-card titles to 14px, and labels/chips/links to 12–13px; preserve the section's wording, card order, framework state, and responsive wrapping.
- [x] In the selected first Technical toolkit panel, enlarge the panel heading and all six skill titles to 17px, the subtitle to 14px, metadata to 12px, and card descriptions to 16px with readable line-height. Preserve all six repeated cards, their text and order, leave How I show up unchanged, and retain responsive stacking.
- [x] Under `When theory meets a working build.`, all three terminal-style project marks type each respective project title and project-detail line one character at a time when their cards enter view; screen readers receive static full title/detail text, reduced-motion users see both lines immediately, and the three projects, their order, content, and filters remain unchanged.
- [x] Rewrite the README in GitHub repository `lekhya-coder/myportfolio` to follow the supplied README's portfolio-focused structure while using only Lekhya's verified biography, education, projects, achievements, and links. Describe the live website, chatbot/avatar, three project visuals, accurate stack/setup/structure/checks, and the live release's license/source links; do not reuse reference-author facts or claim unavailable features.

## Delivery quality
- [x] The root route is declared in `client/public/manus-routes.json`, the HTML shell includes descriptive SEO/social metadata, and the project exposes `/api/health` plus the chatbot API.
- [x] The supplied resume PDF is available at `/resume.pdf` for view/download actions.
- [x] The managed project is configured for server deployment using `Dockerfile` and `/api/health` and passes type checking, tests, and production build checks before checkpointing.
