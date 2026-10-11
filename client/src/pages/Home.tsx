import {
  ArrowDown,
  ArrowUpRight,
  Award,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Code2,
  Cpu,
  Download,
  ExternalLink,
  Github,
  GraduationCap,
  Layers3,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Moon,
  Phone,
  Quote,
  Send,
  Sparkles,
  Sun,
  Trash2,
  Trophy,
  X,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { Streamdown } from "streamdown";
import { answerForIntent, intentForQuestion, intentsForQuestion } from "@shared/profileFacts";
import { InteractiveAvatar, type AvatarMood } from "../components/InteractiveAvatar";
import { ProjectTypingTitle } from "../components/ProjectTypingTitle";
import { useTheme } from "../contexts/ThemeContext";
import { trpc } from "../lib/trpc";

type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  content: string;
  timestamp: string;
  showResumeActions?: boolean;
};

type IntroPhase = "visible" | "exiting" | "closed";
type ScrollingSkill = { label: string; Icon: LucideIcon; logoSrc?: string };
const INTRO_GREETING = "Hello, I'm";
const INTRO_AUTO_DISMISS_MS = 3600;
const INTRO_EXIT_MS = 780;
const INTRO_GREETING_INTERVAL_MS = 86;

const profile = {
  name: "Vinjamuri Lekhya Sahiti",
  title: "IoT & Software Developer · B.Tech Student",
  eyebrow: "B.Tech in Internet of Things (IoT) · SYNTH VISION Finalist",
  intro:
    "Second-year B.Tech student in Internet of Things at VNRVJIET with a strong academic foundation and a keen interest in software development, AI, and problem solving. Building foundations in Java, C++, and Data Structures through embedded-systems projects, hackathons, and regular coding practice.",
  location: "Hyderabad, India · VNRVJIET",
  email: "25071A6962@vnrvjiet.in",
  phone: "+91 80742 86134",
  availability: "Seeking software development & technical internships",
  linkedin: "https://linkedin.com/in/lekhya-vinjamuri",
  github: "https://github.com/lekhya-coder",
  leetcode: "https://leetcode.com/u/VLekhya",
  codechef: "https://www.codechef.com/users/lekhya_sahi_27",
  summary:
    "Second-year B.Tech student in Internet of Things at VNRVJIET with a strong academic foundation and a keen interest in software development, AI, and problem solving. Building foundations in Java, C++, and Data Structures through embedded-systems projects, hackathons, and regular coding practice. Seeking software development and technical internship opportunities.",
};

const technicalSkills = [
  { label: "C & C++", signal: "Coursework + practice", detail: "Programming foundations used for logic building, algorithmic practice, and technical problem solving." },
  { label: "Java", signal: "Coursework + practice", detail: "Object-oriented programming foundation strengthened through regular coding and coursework." },
  { label: "Data Structures & Problem Solving", signal: "Active practice", detail: "A steady practice loop across algorithms, coding challenges, and breaking complex problems into steps." },
  { label: "HTML, CSS & JavaScript", signal: "Web fundamentals", detail: "Frontend fundamentals for shaping clear interfaces and understanding how web experiences come together." },
  { label: "NodeMCU & Microcontrollers", signal: "Hands-on projects", detail: "Hardware-facing practice through connected builds, control logic, and microcontroller interfacing." },
  { label: "Sensors & IoT", signal: "Embedded applications", detail: "Applying sensor readings and IoT concepts to practical monitoring and connected systems." },
];

const scrollingSkills: ScrollingSkill[] = [
  { label: "C & C++", Icon: Code2, logoSrc: "/skill-logos/cplusplus.svg" },
  { label: "Java", Icon: Code2, logoSrc: "/skill-logos/java.svg" },
  { label: "Data Structures", Icon: Layers3 },
  { label: "HTML5", Icon: Code2, logoSrc: "/skill-logos/html5.svg" },
  { label: "CSS3", Icon: Code2, logoSrc: "/skill-logos/css3.svg" },
  { label: "JavaScript", Icon: Code2, logoSrc: "/skill-logos/javascript.svg" },
  { label: "NodeMCU", Icon: Cpu },
  { label: "Sensors & IoT", Icon: Cpu },
  { label: "Microcontrollers", Icon: Cpu },
  { label: "Problem Solving", Icon: Zap },
];

const scrollingSkillLanes = [
  { direction: "forward", skills: scrollingSkills },
  { direction: "reverse", skills: [...scrollingSkills].reverse() },
] as const;

const softSkills = [
  { title: "Rapid problem solving", detail: "Breaks complex tasks into smaller steps and works toward practical solutions." },
  { title: "Algorithmic thinking", detail: "Builds logic through regular C++ and Java data-structures practice." },
  { title: "Hackathon finalist", detail: "SYNTH VISION finalist experience shaped a faster build, test, and present rhythm." },
  { title: "Sensor & hardware prototyping", detail: "Learns by connecting concepts to microcontrollers, sensors, and working builds." },
  { title: "Academic consistency", detail: "Maintains steady academic progress alongside hands-on technical practice." },
  { title: "Curious & fast learner", detail: "Explores new ideas with a practical mindset and an eagerness to keep improving." },
  { title: "Technical presentation", detail: "Comfortable explaining the intent and working direction behind a technical solution." },
  { title: "Hands-on prototyping", detail: "Prefers turning a concept into something observable, testable, and useful." },
];

const experience = [
  {
    period: "Project work",
    role: "Embedded Systems & Sensor Projects",
    company: "Hands-on IoT practice",
    description:
      "Built an underground soil moisture detection system and a NodeMCU Wi-Fi controlled smart car, applying sensor integration, microcontroller logic, and connected hardware fundamentals.",
    outcomes: ["IoT Sensors", "NodeMCU", "Embedded Systems"],
  },
  {
    period: "Ongoing practice",
    role: "Competitive Programming & Problem Solving",
    company: "LeetCode & CodeChef",
    description:
      "Regularly practices data structures and algorithmic problem solving in C++ and Java through coding platforms and technical problem-solving activities.",
    outcomes: ["LeetCode: VLekhya", "CodeChef: lekhya_sahi_27", "C++ & Java Practice"],
  },
  {
    period: "Final round",
    role: "SYNTH VISION Hackathon Finalist",
    company: "Hackathon participation",
    description:
      "Reached the final round of the SYNTH VISION Hackathon conducted by Krithomedh, gaining experience in building and presenting a technical solution under time constraints.",
    outcomes: ["Finalist", "Rapid Problem Solving", "Technical Presentation"],
  },
];

const education = [
  {
    year: "2nd Year",
    title: "B.Tech — Internet of Things (IoT)",
    school: "VNR Vignana Jyothi Institute of Engineering & Technology (VNRVJIET)",
    detail: "CGPA: 9.48 / 10 · Academic focus: programming fundamentals (C, C++, Java), data structures, IoT, and embedded-systems coursework.",
  },
  {
    year: "Continuous",
    title: "Core Specializations & Problem Solving",
    school: "Coding Platforms & Technical Laboratories",
    detail: "Applied practice in Data Structures and Problem Solving (LeetCode & CodeChef), Web Technologies (HTML/CSS/JS), and microcontroller interfacing (NodeMCU).",
  },
];

const projects = [
  {
    number: "01",
    title: "Underground Soil Moisture Detection System",
    type: "Environmental Sensing & Embedded Systems",
    description:
      "Developed an IoT-based system for monitoring underground soil moisture levels using sensors and microcontrollers.",
    tags: ["IoT Sensors", "Embedded Systems", "Microcontroller", "Soil Monitoring"],
    metric: "Underground soil monitoring",
    badge: "Resume project",
    detail: "A practical build centered on sensing soil conditions below the surface and connecting sensor readings to microcontroller-based monitoring.",
    category: "Embedded & IoT",
    tone: "project-slate",
  },
  {
    number: "02",
    title: "NodeMCU Wi-Fi Controlled Smart Car",
    type: "Wireless Embedded Systems & Robotics",
    description:
      "Built a smart car controlled wirelessly over Wi-Fi using NodeMCU.",
    tags: ["NodeMCU", "Wi-Fi", "Robotics"],
    metric: "Wireless movement control",
    badge: "Resume project",
    detail: "A connected hardware build that combines NodeMCU, Wi-Fi control, and robotics fundamentals into a remotely operated car.",
    category: "Wireless Control",
    tone: "project-lime",
  },
  {
    number: "03",
    title: "Data Structures & Problem Solving Practice",
    type: "Software Development & Algorithms",
    description:
      "Regularly practices data structures and algorithmic problem solving in C++ and Java through LeetCode and CodeChef.",
    tags: ["Data Structures", "Algorithms", "C++", "Java", "Problem Solving"],
    metric: "Active coding practice",
    badge: "Coding practice",
    detail: "Ongoing practice in C++ and Java through data structures, algorithms, and problem-solving challenges on coding platforms.",
    category: "Problem Solving",
    tone: "project-ink",
  },
];

const projectFilters = [
  { id: "all", label: "All signals" },
  { id: "Embedded & IoT", label: "Embedded & IoT" },
  { id: "Wireless Control", label: "Wireless control" },
  { id: "Problem Solving", label: "Problem solving" },
] as const;

const recognitions = [
  { label: "SYNTH VISION Hackathon Finalist", detail: "Conducted by Krithomedh · Reached the final round and gained experience building and presenting a technical solution under time constraints" },
  { label: "Academic Excellence", detail: "VNRVJIET · Strong academic record in technical coursework" },
  { label: "Active Competitive Programming Profiles", detail: "LeetCode (VLekhya) & CodeChef (lekhya_sahi_27) algorithmic practice" },
  { label: "Embedded Systems & Hardware Projects", detail: "Built projects for underground soil moisture monitoring and Wi-Fi controlled robotics" },
];

const evidenceNotes = [
  {
    quote: "Hands-on projects include an underground soil moisture detection system and a NodeMCU Wi-Fi controlled smart car.",
    name: "Resume evidence",
    role: "Embedded systems project work",
  },
  {
    quote: "Consistent academic effort, SYNTH VISION Hackathon finalist experience, and regular coding practice describe a focused student profile.",
    name: "Resume evidence",
    role: "VNRVJIET · B.Tech in IoT",
  },
  {
    quote: "Technical foundations span C, C++, Java, data structures, web technologies, NodeMCU, sensors, microcontrollers, and IoT.",
    name: "Resume evidence",
    role: "Technical skills & hands-on practice",
  },
];

const suggestedQuestions = [
  "Tell me about yourself",
  "What are your core technical skills?",
  "Tell me about your projects",
  "Tell me about your academic background",
  "Tell me about your coding achievements",
  "How can I get in touch with you?",
  "Can I view or download your resume?",
];

const initialMessage: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Hey — I’m Lekhya’s animated portfolio avatar. Ask me about her skills, IoT projects, academic record, achievements, internship availability, or how to get in touch. I’ll keep my answers grounded in the portfolio and resume.",
  timestamp: "Now",
};

function timestamp() {
  return new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(new Date());
}

function SectionHeading({ id, index, eyebrow, title, body }: { id?: string; index: string; eyebrow: string; title: string; body?: string }) {
  return (
    <div className="section-heading">
      <div className="section-index">{index}</div>
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 id={id}>{title}</h2>
        {body ? <p className="section-lede">{body}</p> : null}
      </div>
    </div>
  );
}

function generateAssistantAnswer(userPrompt: string): string {
  return intentsForQuestion(userPrompt).map(answerForIntent).join("\n\n");
}

function Home() {
  const { theme, toggleTheme } = useTheme();
  const [introPhase, setIntroPhase] = useState<IntroPhase>("visible");
  const introOpen = introPhase !== "closed";
  const [typedGreeting, setTypedGreeting] = useState("");
  const introEnterRef = useRef<HTMLButtonElement>(null);
  const introSkipRef = useRef<HTMLButtonElement>(null);
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const dismissIntro = useCallback(
    () => setIntroPhase(current => current === "visible" ? "exiting" : current),
    [],
  );
  const [activeSection, setActiveSection] = useState("top");
  const [menuOpen, setMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([initialMessage]);
  const [draft, setDraft] = useState("");
  const [chatTyping, setChatTyping] = useState(false);
  const [assistantConfused, setAssistantConfused] = useState(false);
  const [heroLook, setHeroLook] = useState({ x: 0, y: 0 });
  const [projectFilter, setProjectFilter] = useState<(typeof projectFilters)[number]["id"]>("all");
  const assistant = trpc.assistant.chat.useMutation();

  const visibleProjects = useMemo(
    () => projectFilter === "all" ? projects : projects.filter(project => project.category === projectFilter),
    [projectFilter],
  );
  const avatarMood: AvatarMood = chatTyping
    ? "thinking"
    : draft.trim()
      ? "listening"
      : assistantConfused
        ? "confused"
        : messages.length > 1
          ? "happy"
          : "idle";

  const navItems = useMemo(
    () => [
      ["top", "Overview"],
      ["about", "About"],
      ["work", "Experience"],
      ["projects", "Projects"],
      ["contact", "Contact"],
    ] as const,
    []
  );

  useEffect(() => {
    if (introPhase === "closed") {
      heroTitleRef.current?.focus({ preventScroll: true });
      return;
    }

    if (introPhase === "visible") introEnterRef.current?.focus();
    const timeout = introPhase === "visible"
      ? window.setTimeout(dismissIntro, INTRO_AUTO_DISMISS_MS)
      : undefined;
    const onIntroKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && introPhase === "visible") {
        dismissIntro();
      } else if (event.key === "Tab") {
        const firstControl = introEnterRef.current;
        const lastControl = introSkipRef.current;
        if (event.shiftKey && document.activeElement === firstControl) {
          event.preventDefault();
          lastControl?.focus();
        } else if (!event.shiftKey && document.activeElement === lastControl) {
          event.preventDefault();
          firstControl?.focus();
        }
      }
    };
    window.addEventListener("keydown", onIntroKeyDown);
    return () => {
      if (timeout !== undefined) window.clearTimeout(timeout);
      window.removeEventListener("keydown", onIntroKeyDown);
    };
  }, [introPhase, dismissIntro]);

  useEffect(() => {
    if (introPhase !== "visible") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTypedGreeting(INTRO_GREETING);
      return;
    }

    let characterIndex = 0;
    setTypedGreeting("");
    const intervalId = window.setInterval(() => {
      characterIndex += 1;
      setTypedGreeting(INTRO_GREETING.slice(0, characterIndex));
      if (characterIndex >= INTRO_GREETING.length) window.clearInterval(intervalId);
    }, INTRO_GREETING_INTERVAL_MS);
    return () => window.clearInterval(intervalId);
  }, [introPhase]);

  useEffect(() => {
    if (introPhase !== "exiting") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIntroPhase("closed");
      return;
    }

    const timeout = window.setTimeout(() => setIntroPhase("closed"), INTRO_EXIT_MS);
    return () => window.clearTimeout(timeout);
  }, [introPhase]);

  useEffect(() => {
    const sections = navItems.map(([id]) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      entries => {
        const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveSection(visible.target.id);
      },
      { rootMargin: "-20% 0px -60%", threshold: [0.1, 0.35, 0.7] }
    );
    sections.forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, [navItems]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setChatOpen(false);
      setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const jumpTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const clearChat = () => {
    setMessages([initialMessage]);
    setDraft("");
    setAssistantConfused(false);
  };

  const trackHeroCursor = (event: ReactPointerEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
    const y = ((event.clientY - bounds.top) / bounds.height) * 2 - 1;
    setHeroLook({ x: Math.max(-1, Math.min(1, x)) * 4, y: Math.max(-1, Math.min(1, y)) * 3 });
  };

  const askAssistant = async (question: string) => {
    const cleanQuestion = question.trim();
    if (!cleanQuestion || chatTyping) return;
    const unknownQuestion = intentForQuestion(cleanQuestion) === "unknown";
    const userMessage: ChatMessage = { id: `${Date.now()}-user`, role: "user", content: cleanQuestion, timestamp: timestamp() };
    setMessages(current => [...current, userMessage]);
    setDraft("");
    setAssistantConfused(false);
    setChatTyping(true);

    try {
      // First attempt backend tRPC assistant with a 2-second timeout
      const timeoutPromise = new Promise<{ answer: string }>((_, reject) =>
        setTimeout(() => reject(new Error("Timeout")), 2000)
      );
      const response = await Promise.race([
        assistant.mutateAsync({
          question: cleanQuestion,
        }),
        timeoutPromise,
      ]);

      if (response?.answer?.trim()) {
        setMessages(current => [
          ...current,
          { id: `${Date.now()}-assistant`, role: "assistant", content: response.answer, timestamp: timestamp(), showResumeActions: intentForQuestion(cleanQuestion) === "resume" },
        ]);
        setAssistantConfused(unknownQuestion);
        setChatTyping(false);
        return;
      }
    } catch {
      // Graceful fallback to client-side smart reasoning engine
    }

    // Natural typing indicator simulation and accurate answer
    await new Promise(resolve => setTimeout(resolve, 360));
    const smartAnswer = generateAssistantAnswer(cleanQuestion);
    setMessages(current => [
      ...current,
      { id: `${Date.now()}-assistant`, role: "assistant", content: smartAnswer, timestamp: timestamp(), showResumeActions: intentForQuestion(cleanQuestion) === "resume" },
    ]);
    setAssistantConfused(unknownQuestion);
    setChatTyping(false);
  };

  return (
    <div className="site-shell" id="top">
      <div className="ambient-orb ambient-orb-one" aria-hidden="true" />
      <div className="ambient-orb ambient-orb-two" aria-hidden="true" />
      {introOpen ? (
        <div className={`intro-overlay ${introPhase === "exiting" ? "is-exiting" : ""}`} role="dialog" aria-modal="true" aria-labelledby="intro-title" aria-describedby="intro-description">
          <div className="intro-card">
            <div className="intro-card-top">
              <span className="intro-mark" aria-hidden="true">LS<span>/</span></span>
              <span className="intro-index"><i /> SEEKING INTERNSHIPS</span>
            </div>
            <div className="intro-layout">
              <div className="intro-copy">
                <p className="intro-greeting"><span className="intro-greeting-live" aria-hidden="true">{typedGreeting}<span className="intro-typing-caret" /></span><span className="intro-sr-only">{INTRO_GREETING}</span></p>
                <h2 id="intro-title" className="intro-title">Vinjamuri<br /><span>Lekhya Sahiti</span></h2>
                <p className="intro-role">B.Tech student · Internet of Things (IoT)</p>
                <p id="intro-description" className="intro-description">A second-year student at VNRVJIET, building practical solutions with hardware, logic, and code.</p>
                <div className="intro-details">
                  <span><MapPin size={14} /> Hyderabad, India · VNRVJIET</span>
                  <span><Zap size={14} /> Software development & technical internships</span>
                </div>
                <div className="intro-actions">
                  <button ref={introEnterRef} className="button button-primary intro-enter" type="button" onClick={dismissIntro}>Explore my portfolio <ArrowDown size={15} /></button>
                  <button ref={introSkipRef} className="intro-skip" type="button" onClick={dismissIntro}>Skip intro</button>
                </div>
                <div className="intro-progress" aria-hidden="true"><span /></div>
                <p className="intro-auto-copy" aria-live="polite">Opening the portfolio…</p>
              </div>
              <aside className="intro-code-window" aria-hidden="true">
                <div className="intro-code-toolbar">
                  <span className="intro-code-dots"><i /><i /><i /></span>
                  <span className="intro-code-file">lekhya-profile.ts</span>
                  <span className="intro-code-live"><i /> LIVE</span>
                </div>
                <div className="intro-code-body">
                  <p className="intro-code-line"><span className="intro-code-keyword">const</span> <span className="intro-code-variable">lekhya</span> = {"{"}</p>
                  <p className="intro-code-line intro-code-indent"><span className="intro-code-property">name</span>: <span className="intro-code-string">"Vinjamuri Lekhya Sahiti"</span>,</p>
                  <p className="intro-code-line intro-code-indent"><span className="intro-code-property">degree</span>: <span className="intro-code-string">"B.Tech · IoT"</span>,</p>
                  <p className="intro-code-line intro-code-indent"><span className="intro-code-property">year</span>: <span className="intro-code-string">"Second year"</span>,</p>
                  <p className="intro-code-line intro-code-indent"><span className="intro-code-property">campus</span>: <span className="intro-code-string">"VNRVJIET"</span>,</p>
                  <p className="intro-code-line intro-code-indent"><span className="intro-code-property">focus</span>: [</p>
                  <p className="intro-code-line intro-code-indent"><span className="intro-code-string">"Hardware", "Logic", "Code"</span></p>
                  <p className="intro-code-line intro-code-indent">],</p>
                  <p className="intro-code-line intro-code-indent"><span className="intro-code-property">location</span>: <span className="intro-code-string">"Hyderabad, India"</span></p>
                  <p className="intro-code-line">{"}"};</p>
                </div>
                <div className="intro-code-status"><span className="intro-code-status-dot" /> PROFILE STATUS <strong>READY</strong></div>
              </aside>
            </div>
            <div className="intro-highlights" role="group" aria-label="Profile highlights">
              <div className="intro-highlight"><span className="intro-highlight-label">EDUCATION</span><strong>Second-year B.Tech</strong><small>Internet of Things (IoT)</small></div>
              <div className="intro-highlight"><span className="intro-highlight-label">INSTITUTE</span><strong>VNRVJIET</strong><small>Engineering</small></div>
              <div className="intro-highlight"><span className="intro-highlight-label">BASED IN</span><strong>Hyderabad, India</strong><small>Location</small></div>
              <div className="intro-highlight"><span className="intro-highlight-label">BUILD FOCUS</span><strong>Hardware · Logic · Code</strong><small>Practical solutions</small></div>
            </div>
          </div>
        </div>
      ) : null}
      <div className={`portfolio-content ${introOpen ? "is-blocked" : "is-ready"}`} aria-hidden={introOpen} inert={introOpen}>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Back to the top of the portfolio">
          <span className="wordmark-mark"><span className="wordmark-mark-core">LS</span><span className="wordmark-mark-slash">/</span><Cpu className="wordmark-mark-icon" size={11} aria-hidden="true" /></span>
          <span className="wordmark-text">Lekhya Sahiti<small>portfolio / 2026</small></span>
        </a>
        <nav className={`main-nav ${menuOpen ? "is-open" : ""}`} aria-label="Primary navigation">
          {navItems.map(([id, label]) => (
            <a key={id} href={`#${id}`} className={activeSection === id ? "is-active" : ""} onClick={() => setMenuOpen(false)}>
              {label}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <button className="icon-button" type="button" onClick={toggleTheme} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`} title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}>
            {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <a className="header-contact" href="#contact">Let’s talk <ArrowUpRight size={15} /></a>
          <button className="icon-button menu-toggle" type="button" onClick={() => setMenuOpen(open => !open)} aria-label={menuOpen ? "Close menu" : "Open menu"}>
            {menuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </header>

      <main>
        <section className="hero section-wrap" aria-labelledby="hero-title">
          <div className="hero-copy">
            <div className="availability"><span className="status-dot" /> {profile.availability}</div>
            <p className="hero-kicker">{profile.eyebrow}</p>
            <h1 id="hero-title" ref={heroTitleRef} tabIndex={-1}>Hello, I'm<br /><em>Vinjamuri Lekhya Sahiti</em></h1>
            <p className="hero-tagline">Building practical solutions with <strong>hardware, logic & code</strong>.</p>
            <p className="hero-intro">{profile.intro}</p>
            <div className="hero-actions">
              <a className="button button-primary" href="/resume.pdf" target="_blank" rel="noreferrer">View My Resume <ExternalLink size={16} /></a>
              <a className="button button-ghost" href="/resume.pdf" download="Vinjamuri_Lekhya_Sahiti_Resume.pdf">Download PDF <Download size={16} /></a>
              <a className="button button-ghost" href="#contact">Contact Me <ArrowUpRight size={16} /></a>
            </div>
            <div className="hero-meta">
              <span><MapPin size={14} /> {profile.location}</span>
              <span><GraduationCap size={14} /> 2nd Year · B.Tech in IoT</span>
              <span><Mail size={14} /> {profile.email}</span>
            </div>
          </div>
          <div className="hero-visual" aria-label="Profile of Vinjamuri Lekhya Sahiti" onPointerMove={trackHeroCursor} onPointerLeave={() => setHeroLook({ x: 0, y: 0 })}>
            <div className="orbit orbit-one" aria-hidden="true" />
            <div className="orbit orbit-two" aria-hidden="true" />
            <div className="profile-card">
              <div className="profile-photo"><span className="profile-monogram">LS</span><span className="profile-signal profile-signal-one"><Cpu size={13} /></span><span className="profile-signal profile-signal-two"><Sparkles size={13} /></span><span className="profile-signal profile-signal-three" /><span className="profile-scanline" /><div className="photo-caption">Vinjamuri<br />Lekhya Sahiti</div></div>
              <div className="profile-card-footer"><span>VNRVJIET / Engineering</span><span>Open to Internships <span className="mini-dot" /></span></div>
            </div>
            <div className="floating-note floating-note-top"><Sparkles size={15} /><span>Building with<br /><strong>Sensors & Code</strong></span></div>
            <div className="floating-note floating-note-bottom"><span>Currently exploring</span><strong>AI & Embedded Systems</strong></div>
            <div className="hero-avatar-widget">
              <InteractiveAvatar mood={avatarMood} variant="hero" look={heroLook} />
              <button className="hero-avatar-cta" type="button" onClick={() => setChatOpen(true)}><MessageCircle size={12} /> Chat with the avatar</button>
            </div>
          </div>
        </section>

        <section className="proof-strip section-wrap" aria-label="Recruiter snapshot">
          <div className="proof-card"><span>01 / Current focus</span><strong>Software development & technical internships</strong></div>
          <div className="proof-card"><span>02 / Core practice</span><strong>Java · C++ · Data Structures</strong></div>
          <div className="proof-card"><span>03 / Hands-on</span><strong>IoT · Sensors · Microcontrollers</strong></div>
          <div className="proof-card"><span>04 / Academic</span><strong>VNRVJIET · 2nd Year B.Tech</strong></div>
        </section>

        <section className="marquee-band" aria-label="Professional focus areas">
          <div className="marquee-track"><span>SYNTH VISION FINALIST</span><i>✳</i><span>KRITHOMEDH</span><i>✳</i><span>DATA STRUCTURES</span><i>✳</i><span>JAVA & C++</span><i>✳</i><span>EMBEDDED SYSTEMS</span><i>✳</i><span>PROBLEM SOLVING</span><i>✳</i><span>WEB TECHNOLOGIES</span><i>✳</i><span>HARDWARE INTEGRATION</span></div>
        </section>

        <section className="section-wrap content-section" id="about" aria-labelledby="about-title">
          <SectionHeading id="about-title" index="01 /" eyebrow="A little context" title="Where curiosity becomes working systems." body="Second-year B.Tech student at VNRVJIET with solid foundations in Java, C++, data structures, sensor interfacing, and embedded systems." />
          <div className="about-grid">
            <div className="about-lead">
              <article className="bio-card" aria-label="Professional summary">
                <div className="bio-card-header">
                  <span className="bio-badge-tag"><Sparkles size={13} /> Profile Summary</span>
                </div>
                <div className="bio-body-text">
                  <p>
                    Aspiring <strong>Software Engineer</strong> pursuing a <strong>B.Tech in Internet of Things (IoT)</strong> at <strong>VNR Vignana Jyothi Institute of Engineering &amp; Technology</strong>, with a strong academic record.
                  </p>
                  <p>
                    Skilled in <strong>C, C++, Java, Data Structures, Problem Solving, and web technologies</strong>. Experienced in developing IoT-based projects, demonstrating practical implementation and analytical skills.
                  </p>
                  <p>
                    Eager to contribute to software development teams, build efficient and scalable solutions, and apply technical knowledge to real-world challenges while continuously learning and growing as a software professional.
                  </p>
                </div>
                <div className="bio-chips">
                  <span className="bio-chip"><Trophy size={13} /> SYNTH VISION Finalist</span>
                  <span className="bio-chip"><GraduationCap size={13} /> VNRVJIET · 2nd Year B.Tech</span>
                  <span className="bio-chip"><Code2 size={13} /> Java · C++ · DSA</span>
                  <span className="bio-chip"><Zap size={13} /> Open for Internships</span>
                </div>
                <div className="bio-card-footer">
                  <span className="bio-footer-note"><Sparkles size={14} /> Explore by signal</span>
                  <div className="bio-footer-links"><a className="text-link" href="#projects">Trace the builds <ArrowUpRight size={16} /></a><a className="text-link" href="#contact">Find the right fit <ArrowUpRight size={16} /></a></div>
                </div>
              </article>
              <div className="quick-connect" aria-label="Quick connect">
                <div className="quick-connect-heading"><strong>Quick connect</strong><span>Reach me directly</span></div>
                <div className="quick-connect-links">
                  <a href={`mailto:${profile.email}`}><Mail size={16} /> Email <ArrowUpRight size={13} /></a>
                  <a href={profile.linkedin} target="_blank" rel="noreferrer"><Linkedin size={16} /> LinkedIn <ArrowUpRight size={13} /></a>
                  <a href={profile.github} target="_blank" rel="noreferrer"><Github size={16} /> GitHub <ArrowUpRight size={13} /></a>
                </div>
              </div>
            </div>
            <div className="about-details">
                  <div><span className="detail-label">Career goal</span><p>Seeking software development and technical internship opportunities to build practical technology solutions, apply core data structures, embedded system principles, and algorithmic thinking to grow as an engineer.</p></div>
                  <div className="about-focus-grid"><div><span>01</span><strong>Software foundations</strong><p>Java, C++, data structures, algorithms, and web fundamentals.</p></div><div><span>02</span><strong>Embedded practice</strong><p>NodeMCU, sensors, microcontrollers, and IoT project work.</p></div><div><span>03</span><strong>Growth mindset</strong><p>Hackathons, coding platforms, and a steady focus on practical problem solving.</p></div></div>
                  <div><span className="detail-label">Strengths</span><div className="tag-list">{["Data Structures & Algorithms", "SYNTH VISION Finalist", "Embedded Systems & Prototyping", "Rapid Problem Solving", "Academic Consistency", "Microcontroller Firmware"].map(tag => <span className="tag" key={tag}>{tag}</span>)}</div></div>
              <div className="quote-callout"><Quote size={22} /><p>Practical engineering starts with solid fundamentals and the curiosity to build.</p></div>
            </div>
          </div>
        </section>

        <section className="section-wrap content-section skills-section" aria-labelledby="skills-title">
          <SectionHeading id="skills-title" index="02 /" eyebrow="Capability map" title="The tools I turn into momentum." body="A practical technical stack across programming, problem solving, web fundamentals, and embedded systems—plus the habits that shape how I show up while learning and building." />
          <div className="skills-marquee" role="region" aria-label="Scrolling skills logos">
            {scrollingSkillLanes.map((lane, laneIndex) => (
              <div className={`skills-marquee-lane skills-marquee-lane-${lane.direction}`} key={lane.direction} aria-hidden={laneIndex === 1 ? true : undefined}>
                <div className={`skills-marquee-track skills-marquee-track-${lane.direction}`}>
                  {[0, 1].map(copy => (
                    <ul className="skills-marquee-group" key={copy} aria-hidden={copy === 1 ? true : undefined}>
                      {lane.skills.map(({ label, Icon, logoSrc }) => (
                        <li className="skills-marquee-item" key={label}>
                          <span className="skills-marquee-mark" aria-hidden="true">
                            {logoSrc ? <img src={logoSrc} alt="" /> : <Icon size={24} strokeWidth={1.8} />}
                          </span>
                          <span className="skills-marquee-label">{label}</span>
                        </li>
                      ))}
                    </ul>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="skills-grid">
            <div className="skill-panel"><div className="panel-label panel-label-stack"><Layers3 size={17} /><span>Technical toolkit<small>Languages · logic · hardware</small></span></div><div className="toolkit-grid">{technicalSkills.map(skill => <article className="toolkit-card" key={skill.label}><div className="toolkit-card-top"><strong>{skill.label}</strong><span>{skill.signal}</span></div><p>{skill.detail}</p></article>)}</div></div>
            <div className="skill-panel soft-panel"><div className="panel-label"><Zap size={17} /> How I show up</div><p className="panel-intro">I bring a curious, hands-on approach: understand the problem, build a working path, test the idea, and keep learning from the result.</p><div className="showup-grid">{softSkills.map(skill => <article className="showup-card" key={skill.title}><div><Check size={14} /><strong>{skill.title}</strong></div><p>{skill.detail}</p></article>)}</div><div className="skill-footnote">Curious by default. Analytical under constraints. Always driven to solve practical problems.</div></div>
          </div>
        </section>

        <section className="section-wrap content-section" id="work" aria-labelledby="work-title">
          <SectionHeading id="work-title" index="03 /" eyebrow="Selected practice" title="Proof of practice, not just potential." body="A closer look at how coursework becomes action: embedded-systems projects, coding-platform practice, and a technical hackathon finale." />
          <div className="timeline">{experience.map((item, index) => <article className="timeline-item" key={item.role}><div className="timeline-marker"><span>0{index + 1}</span></div><div className="timeline-content"><div className="timeline-top"><span className="period">{item.period}</span><span className="company">{item.company}</span></div><h3>{item.role}</h3><p>{item.description}</p><div className="outcome-list">{item.outcomes.map(outcome => <span key={outcome}><CheckCircle2 size={14} /> {outcome}</span>)}</div></div></article>)}</div>
        </section>

        <section className="section-wrap content-section education-section" aria-labelledby="education-title">
          <div className="split-heading"><SectionHeading id="education-title" index="04 /" eyebrow="Academic foundation" title="A record built on consistency." /><span className="section-side-note">Learning by building<br />B.Tech in IoT · VNRVJIET.</span></div>
          <div className="education-grid">{education.map(item => <article className="education-card" key={item.title}><div className="education-year">{item.year}</div><GraduationCap size={23} /><h3>{item.title}</h3><p className="education-school">{item.school}</p><p>{item.detail}</p></article>)}</div>
        </section>

        <section className="section-wrap content-section project-section" id="projects" aria-labelledby="projects-title">
          <SectionHeading id="projects-title" index="05 /" eyebrow="Selected projects" title="When theory meets a working build." body="Selected projects showing how I move from a technical idea to a tangible system across sensors, wireless control, embedded hardware, and problem solving." />
          <div className="project-showcase-toolbar"><div className="project-filter-list" role="tablist" aria-label="Filter projects by practice area">{projectFilters.map(filter => <button key={filter.id} type="button" role="tab" aria-selected={projectFilter === filter.id} className={projectFilter === filter.id ? "is-active" : ""} onClick={() => setProjectFilter(filter.id)}>{filter.label}</button>)}</div><span className="project-count" aria-live="polite">Showing {visibleProjects.length} of {projects.length} builds</span></div>
          <div className="project-list">
            {visibleProjects.map((project, projectIndex) => (
              <article className={`project-card ${project.tone}`} key={project.title}>
                <div className="project-visual" aria-hidden="true">
                  <div className="visual-window">
                    <div className="visual-window-bar"><span /><span /><span /></div>
                    <div className="visual-code-screen">
                      <span className="visual-code-prompt">&gt; live_build / {project.number}</span>
                      <ProjectTypingTitle active={!introOpen} title={project.title} detail={project.detail} delayMs={projectIndex * 160} />
                    </div>
                  </div>
                  <span className="project-number">{project.number}</span>
                </div>
                <div className="project-body">
                  <div className="project-type">{project.type}</div>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <p className="project-detail">{project.detail}</p>
                  <div className="project-tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
                  <div className="project-footer">
                    <strong>{project.metric}</strong>
                    <span className="project-badge">{project.badge}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section-wrap content-section recognitions-section" aria-labelledby="recognitions-title">
          <div className="recognitions-head"><SectionHeading id="recognitions-title" index="06 /" eyebrow="Key achievements" title="Signals worth noticing." /><p>Highlights from the SYNTH VISION Hackathon finale conducted by Krithomedh, regular LeetCode and CodeChef practice, and a strong academic record.</p></div>
          <div className="recognition-list">{recognitions.map((item, index) => <div className="recognition-row" key={item.label}><span className="recognition-index">0{index + 1}</span><Award size={20} /><strong>{item.label}</strong><span>{item.detail}</span><ArrowUpRight size={17} /></div>)}</div>
        </section>

        <section className="section-wrap content-section testimonial-section" aria-labelledby="testimonial-title">
          <SectionHeading id="testimonial-title" index="07 /" eyebrow="Resume evidence" title="The details behind the signal." body="A compact read on the academic, technical, and hands-on evidence that shapes this early-career profile." />
          <div className="testimonial-grid">{evidenceNotes.map(item => <blockquote key={`${item.name}-${item.role}`}><Quote size={26} /><p>“{item.quote}”</p><footer><strong>{item.name}</strong><span>{item.role}</span></footer></blockquote>)}</div>
        </section>

        <section className="section-wrap contact-section" id="contact" aria-labelledby="contact-title">
          <div className="contact-intro">
            <p className="eyebrow">08 / Direct Connect</p>
            <h2 id="contact-title">From curiosity<br /><em>to contribution.</em></h2>
            <p>Second-year B.Tech student at VNRVJIET and SYNTH VISION Hackathon Finalist, seeking software development and technical internship opportunities. With foundations in Java, C++, data structures, web fundamentals, and IoT hardware, I am looking for a place to keep learning by contributing to practical systems.</p>
            <div className="contact-quick-grid" aria-label="Quick profile fit">
              <div className="contact-quick-card"><span>Open to</span><strong>Software development & technical internships</strong></div>
              <div className="contact-quick-card"><span>Strong in</span><strong>Java · C++ · Data Structures</strong></div>
              <div className="contact-quick-card"><span>Builds with</span><strong>IoT · Sensors · NodeMCU</strong></div>
              <div className="contact-quick-card"><span>Based at</span><strong>VNRVJIET · Hyderabad</strong></div>
            </div>
          </div>

          <div className="contact-side">
            <div className="contact-channels-grid">
            <a className="channel-card" href={`mailto:${profile.email}`}>
              <div className="channel-icon"><Mail size={20} /></div>
              <div className="channel-info">
                <span className="channel-label">Official Email</span>
                <strong className="channel-value">{profile.email}</strong>
              </div>
              <span className="channel-action">Send Email <ArrowUpRight size={15} /></span>
            </a>

            <a className="channel-card" href={`tel:${profile.phone.replace(/\s+/g, '')}`}>
              <div className="channel-icon"><Phone size={20} /></div>
              <div className="channel-info">
                <span className="channel-label">Direct Phone</span>
                <strong className="channel-value">{profile.phone}</strong>
              </div>
              <span className="channel-action">Call / Dial <ArrowUpRight size={15} /></span>
            </a>

            <a className="channel-card" href={profile.linkedin} target="_blank" rel="noreferrer">
              <div className="channel-icon"><Linkedin size={20} /></div>
              <div className="channel-info">
                <span className="channel-label">LinkedIn</span>
                <strong className="channel-value">linkedin.com/in/lekhya-vinjamuri</strong>
              </div>
              <span className="channel-action">Connect <ExternalLink size={13} /></span>
            </a>

            <a className="channel-card" href={profile.github} target="_blank" rel="noreferrer">
              <div className="channel-icon"><Github size={20} /></div>
              <div className="channel-info">
                <span className="channel-label">GitHub</span>
                <strong className="channel-value">github.com/lekhya-coder</strong>
              </div>
              <span className="channel-action">View Profile <ExternalLink size={13} /></span>
            </a>

            <a className="channel-card" href={profile.leetcode} target="_blank" rel="noreferrer">
              <div className="channel-icon"><Code2 size={20} /></div>
              <div className="channel-info">
                <span className="channel-label">LeetCode</span>
                <strong className="channel-value">leetcode.com/u/VLekhya</strong>
              </div>
              <span className="channel-action">Practice Profile <ExternalLink size={13} /></span>
            </a>

            <a className="channel-card" href={profile.codechef} target="_blank" rel="noreferrer">
              <div className="channel-icon"><Code2 size={20} /></div>
              <div className="channel-info">
                <span className="channel-label">CodeChef</span>
                <strong className="channel-value">codechef.com/users/lekhya_sahi_27</strong>
              </div>
              <span className="channel-action">View Profile <ExternalLink size={13} /></span>
            </a>

            <div className="channel-card channel-card-static">
              <div className="channel-icon"><MapPin size={20} /></div>
              <div className="channel-info">
                <span className="channel-label">Campus & Location</span>
                <strong className="channel-value">{profile.location}</strong>
              </div>
              <span className="channel-meta">B.Tech · Internet of Things</span>
            </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <span className="site-footer-copy">© 2026 Vinjamuri Lekhya Sahiti. This combined portfolio is licensed under AGPL-3.0-only.</span>
        <nav className="site-footer-links" aria-label="Open-source notices">
          <a href="/source-code.zip" download="lekhya-portfolio-source-agpl-3.0.zip">Source code <ExternalLink size={12} aria-hidden="true" /></a>
          <a href="/LICENSE" rel="license">AGPL-3.0-only</a>
          <a href="https://github.com/smontlouis/bible-strong-avatar-lab/tree/79fe9ba06e4874b11394b8e8a3f2c493c9d197ba" target="_blank" rel="noreferrer">Avatar Lab source <ExternalLink size={12} aria-hidden="true" /></a>
        </nav>
        <a href="#top">Back to top <ArrowDown size={14} className="rotate-up" /></a>
      </footer>

      <button
        className={`chat-launcher ${chatOpen ? "is-open" : ""}`}
        type="button"
        onClick={() => setChatOpen(open => !open)}
        aria-label={chatOpen ? "Close portfolio chatbot" : "Chat with Lekhya’s avatar"}
        aria-expanded={chatOpen}
      >
        <span className="chat-launcher-icon">
          {chatOpen ? <X size={20} /> : <InteractiveAvatar mood={avatarMood} variant="launcher" followPointer />}
        </span>
        <span className="chat-launcher-copy">
          <strong>Chat with the avatar</strong>
          <small>Ask about Lekhya’s portfolio</small>
        </span>
      </button>
      {chatOpen ? (
        <aside className="chat-panel" aria-label="Chat with Lekhya’s portfolio avatar">
          <div className="chat-header">
            <div className="chat-title">
              <span className="chat-avatar"><InteractiveAvatar mood={avatarMood} variant="launcher" /></span>
              <div>
                <strong>Lekhya’s avatar</strong>
                <span><span className="status-dot" /> Portfolio guide · grounded answers</span>
              </div>
            </div>
            <div className="chat-header-actions">
              <button type="button" className="chat-icon" onClick={clearChat} disabled={chatTyping} title="Clear conversation" aria-label="Clear conversation"><Trash2 size={15} /></button>
              <button type="button" className="chat-icon" onClick={() => setChatOpen(false)} title="Close chatbot" aria-label="Close chatbot"><X size={17} /></button>
            </div>
          </div>
          <InteractiveAvatar mood={avatarMood} followPointer />
          <div className="chat-messages" role="log" aria-label="Conversation with the portfolio avatar" aria-live="polite" aria-relevant="additions text">
            {messages.map(message => (
              <div className={`chat-message ${message.role}`} key={message.id}>
                <div className="chat-bubble">
                  <Streamdown>{message.content}</Streamdown>
                  {message.showResumeActions ? (
                    <div className="chat-inline-resume-actions" aria-label="Resume actions">
                      <a href="/resume.pdf" target="_blank" rel="noreferrer"><ExternalLink size={13} /> View resume</a>
                      <a href="/resume.pdf" download="Vinjamuri_Lekhya_Sahiti_Resume.pdf"><Download size={13} /> Download PDF</a>
                    </div>
                  ) : null}
                </div>
                <span className="chat-time">{message.timestamp}</span>
              </div>
            ))}
            {chatTyping ? (
              <div className="chat-message assistant">
                <div className="chat-bubble typing"><i /><i /><i /></div>
                <span className="chat-time">Thinking…</span>
              </div>
            ) : null}
          </div>
          {messages.length === 1 ? (
            <div className="chat-suggestions">
              <span>Try asking</span>
              {suggestedQuestions.map(question => (
                <button key={question} type="button" onClick={() => askAssistant(question)}>
                  {question}<ChevronDown size={13} className="suggestion-arrow" />
                </button>
              ))}
            </div>
          ) : null}
          <form className="chat-input" onSubmit={event => { event.preventDefault(); void askAssistant(draft); }}>
            <input value={draft} onChange={event => setDraft(event.target.value)} placeholder="Ask about the portfolio…" aria-label="Ask Lekhya’s portfolio avatar" />
            <button type="submit" disabled={!draft.trim() || chatTyping} aria-label="Send message"><Send size={17} /></button>
          </form>
        </aside>
      ) : null}
      </div>
    </div>
  );
}

export default Home;
