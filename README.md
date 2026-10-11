# Vinjamuri Lekhya Sahiti — IoT & Software Portfolio

> Building practical software and connected hardware through curiosity, steady practice, and problem-solving.

**Live portfolio:** [lekhya-dgkarbmr.manus.space](https://lekhya-dgkarbmr.manus.space/) · **Resume:** [View PDF](https://lekhya-dgkarbmr.manus.space/resume.pdf) · **Current live source:** [Download ZIP](https://lekhya-dgkarbmr.manus.space/source-code.zip)

This repository accompanies my portfolio website. The public site is the current deployed experience; its combined release source and license are also available from the live site because the deployed version includes the Avatar Lab runtime.

> Recruiters, collaborators, and fellow builders: I’m seeking software-development and technical internship opportunities, and I’m happy to talk about a project, a technical challenge, or an idea worth building.

## A little about me

I’m **Vinjamuri Lekhya Sahiti**, a second-year **B.Tech student in Internet of Things (IoT)** at **VNR Vignana Jyothi Institute of Engineering & Technology (VNRVJIET)** in Hyderabad, India. I’m interested in software development, AI, embedded systems, and problem solving. My learning combines programming and coursework with hands-on sensor projects, hackathons, and regular coding practice.

### Education and recognition

- **Degree:** B.Tech in Internet of Things (IoT), second year
- **Institution:** VNR Vignana Jyothi Institute of Engineering & Technology
- **Academic performance:** CGPA **9.48 / 10**
- **Hackathon:** SYNTH VISION finalist; the event was conducted by Krithomedh
- **Coding practice:** Data structures and algorithm problems in C++ and Java through LeetCode and CodeChef

## Projects

### Underground Soil Moisture Detection System

An IoT project for monitoring underground soil moisture using sensors and microcontrollers. The work explores sensor readings, embedded logic, and practical environmental monitoring.

### NodeMCU Wi-Fi Controlled Smart Car

A small robotics build that uses NodeMCU and Wi-Fi control for remote movement, combining wireless communication with embedded systems fundamentals.

### Data Structures & Problem Solving Practice

Ongoing C++ and Java practice through data structures, algorithms, and coding challenges on LeetCode and CodeChef. This is a practice track rather than a standalone application.

## What the portfolio includes

- **Opening title card:** Immediately on every page load and reload, a live-typed “Hello, I'm” greeting is the first screen. After a short hold, the card slides upward as the portfolio fades and rises in beneath it; Enter and Skip start the same smooth transition immediately.
- **Project showcase:** Three project cards with filters for All signals, Embedded & IoT, Wireless control, and Problem solving.
- **Animated project marks:** Each terminal-style card types its own project title and detail line character by character on entry, while the full copy remains available to assistive technology.
- **Skills logo marquee:** Two circular-mark rows scroll in opposite directions, pause on hover, and become a static accessible list for reduced-motion users.
- **Technical toolkit:** Programming, web, algorithm, microcontroller, sensor, and IoT skills presented with project-grounded context.
- **Quick connect:** Email, LinkedIn, and GitHub links follow the profile summary.
- **Resume actions:** Open the PDF in a new tab or download it directly.
- **Responsive presentation:** A light/dark theme and layouts designed for desktop and mobile.

## Portfolio chatbot and mascot

The floating text assistant launcher is labeled **Get to know Lekhya** and remains on the revealed portfolio on every page load. The hero entry button and chat-panel heading use the same name; the chatbot does not show an in-panel “Powered by Bible Strong Avatar Lab” line. It answers questions about my profile, skills, projects, education, achievements, internship availability, contact information, and resume. It uses shared, resume-grounded answers; the managed AI is used only to classify questions that the local topic rules cannot confidently route. Unsupported questions receive a safe prompt to use the contact links.

The animated mascot uses the official [Bible Strong Avatar Lab](https://github.com/smontlouis/bible-strong-avatar-lab) React runtime. It reacts to typing and answer states, and its gaze follows the pointer while idle. Both the chatbot and the main portfolio avatar honor reduced-motion preferences.

## Technology

- **Frontend:** React 19, TypeScript, Vite, and responsive CSS
- **Server:** Node.js, Express, and tRPC
- **Shared logic:** Resume/profile facts and chatbot topic routing
- **Testing:** TypeScript checks and Vitest
- **Package manager:** pnpm 10.18.0

## Run locally

Use Node.js 22 or newer and the repository-pinned pnpm version.

```bash
npm install --global pnpm@10.18.0
pnpm install --frozen-lockfile
pnpm dev
```

The development server uses port 3000 by default. To validate or build the application:

```bash
pnpm check
pnpm test
pnpm build
pnpm start
```

Run `pnpm start` after a successful production build. The portfolio facts and deterministic chat responses are part of the application; if the managed classifier is unavailable, unsupported questions fall back safely.

## Project structure

- `client/` — React/Vite portfolio interface and public assets
- `server/` — Express/tRPC routes and server-side helpers
- `shared/` — reusable portfolio facts and assistant routing
- `drizzle/` — database schema and migration assets for the starter application

## Live release source and license

The combined deployed portfolio is licensed under **AGPL-3.0-only**, including its Avatar Lab integration. The live site provides the release-specific license and corresponding source archive:

- [Live release license](https://lekhya-dgkarbmr.manus.space/LICENSE)
- [Download the current live source archive](https://lekhya-dgkarbmr.manus.space/source-code.zip)
- [Avatar Lab upstream source](https://github.com/smontlouis/bible-strong-avatar-lab)

## Useful links

- [Live portfolio](https://lekhya-dgkarbmr.manus.space/)
- [Resume PDF](https://lekhya-dgkarbmr.manus.space/resume.pdf)
- [GitHub profile](https://github.com/lekhya-coder)
- [LinkedIn](https://linkedin.com/in/lekhya-vinjamuri)
- [LeetCode](https://leetcode.com/u/VLekhya)
- [CodeChef](https://www.codechef.com/users/lekhya_sahi_27)
- [Email](mailto:25071A6962@vnrvjiet.in)
