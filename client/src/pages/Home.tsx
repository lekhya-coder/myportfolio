import {
  ArrowDown,
  ArrowUpRight,
  Award,
  Bot,
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
import { useEffect, useMemo, useState } from "react";
import { Streamdown } from "streamdown";
import { answerForIntent } from "@shared/profileFacts";
import { useTheme } from "../contexts/ThemeContext";
import { trpc } from "../lib/trpc";

type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  content: string;
  timestamp: string;
};

const profile = {
  name: "Vinjamuri Lekhya Sahiti",
  title: "IoT & Software Developer · B.Tech Student",
  eyebrow: "B.Tech in Internet of Things (IoT) · SGPA 9.48/10 · SYNTH VISION Finalist",
  intro:
    "Second-year B.Tech student in Internet of Things at VNRVJIET with a strong academic record (SGPA 9.48/10) and a keen interest in software development, AI, and problem solving. Building foundations in Java, C++, and Data Structures through embedded-systems projects, hackathons, and regular coding practice.",
  location: "Hyderabad, India · VNRVJIET",
  email: "25071A6962@vnrvjiet.in",
  phone: "+91 80742 86134",
  availability: "Seeking software development & technical internships",
  linkedin: "https://linkedin.com/in/lekhya-vinjamuri",
  github: "https://github.com/lekhya-coder",
  leetcode: "https://leetcode.com/u/VLekhya",
  codechef: "https://www.codechef.com/users/lekhya_sahi_27",
  summary:
    "Second-year B.Tech student in Internet of Things at VNRVJIET with a strong academic record (SGPA 9.48/10) and a keen interest in software development, AI, and problem solving. Building foundations in Java, C++, and Data Structures through embedded-systems projects, hackathons, and regular coding practice. Seeking software development and technical internship opportunities.",
};

const technicalSkills = [
  { label: "C & C++", signal: "Coursework + practice" },
  { label: "Java", signal: "Coursework + practice" },
  { label: "Data Structures & Problem Solving", signal: "Active practice" },
  { label: "HTML, CSS & JavaScript", signal: "Web fundamentals" },
  { label: "NodeMCU & Microcontrollers", signal: "Hands-on projects" },
  { label: "Sensors & IoT", signal: "Embedded applications" },
];

const softSkills = [
  "Rapid problem solving",
  "Algorithmic thinking",
  "SYNTH VISION Hackathon Finalist",
  "Sensor & hardware prototyping",
  "Academic consistency (SGPA 9.48)",
  "Curious & fast learner",
  "Technical presentation",
  "Hands-on prototyping",
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
    detail: "SGPA: 9.48 / 10 · Academic focus: programming fundamentals (C, C++, Java), data structures, IoT, and embedded-systems coursework.",
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
    tone: "project-ink",
  },
];

const recognitions = [
  { label: "SYNTH VISION Hackathon Finalist", detail: "Conducted by Krithomedh · Reached the final round and gained experience building and presenting a technical solution under time constraints" },
  { label: "Academic Excellence — SGPA 9.48 / 10", detail: "VNRVJIET · Strong academic record in technical coursework" },
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
    quote: "A 9.48 / 10 SGPA, SYNTH VISION Hackathon finalist experience, and regular coding practice describe a focused student profile.",
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
  "What are your core technical skills?",
  "Tell me about your projects",
  "What is your academic background and SGPA?",
  "Tell me about your coding achievements",
  "How can I get in touch with you?",
];

const initialMessage: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Hi — I’m the assistant for Vinjamuri Lekhya Sahiti. Ask me about her skills in C++, Java, and embedded systems, projects like the Soil Moisture Detector or Wi-Fi Smart Car, the SYNTH VISION Hackathon conducted by Krithomedh, or her academic record (SGPA 9.48)!",
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
  const query = userPrompt.toLowerCase().trim();
  let intent = "unknown";

  if (/intern|hire|job|availab|opportunit|open to work|recruit/.test(query)) intent = "availability";
  else if (/contact|email|phone|linkedin|github|leetcode|codechef|reach|call|message/.test(query)) intent = "contact";
  else if (/resume|cv|download|pdf/.test(query)) intent = "resume";
  else if (/project|built|build|worked|soil|moisture|car|nodemcu|wi-?fi|hardware|embedded/.test(query)) intent = "projects";
  else if (/skill|language|tech|stack|java|c\+\+|\bc\b|dsa|data structure|html|css|javascript|microcontroller|sensor/.test(query)) intent = "skills";
  else if (/education|college|university|sgpa|cgpa|gpa|vnrvjiet|study|degree|year|coursework/.test(query)) intent = "education";
  else if (/hackathon|achievement|award|competition|contest|synthe|vision|finalist|coding practice/.test(query)) intent = "achievements";
  else if (/summary|bio|profile|background|about|who is|hello|hi|hey|introduce/.test(query)) intent = "profile";

  return answerForIntent(intent);
}

function Home() {
  const { theme, toggleTheme } = useTheme();
  const [activeSection, setActiveSection] = useState("top");
  const [menuOpen, setMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([initialMessage]);
  const [draft, setDraft] = useState("");
  const [chatTyping, setChatTyping] = useState(false);
  const assistant = trpc.assistant.chat.useMutation();

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

  const clearChat = () => setMessages([initialMessage]);

  const askAssistant = async (question: string) => {
    const cleanQuestion = question.trim();
    if (!cleanQuestion || chatTyping) return;
    const userMessage: ChatMessage = { id: `${Date.now()}-user`, role: "user", content: cleanQuestion, timestamp: timestamp() };
    setMessages(current => [...current, userMessage]);
    setDraft("");
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
          { id: `${Date.now()}-assistant`, role: "assistant", content: response.answer, timestamp: timestamp() },
        ]);
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
      { id: `${Date.now()}-assistant`, role: "assistant", content: smartAnswer, timestamp: timestamp() },
    ]);
    setChatTyping(false);
  };

  return (
    <div className="site-shell" id="top">
      <div className="ambient-orb ambient-orb-one" aria-hidden="true" />
      <div className="ambient-orb ambient-orb-two" aria-hidden="true" />
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
            <h1 id="hero-title">Hello, I'm<br /><em>Vinjamuri Lekhya Sahiti</em></h1>
            <p className="hero-tagline">Building practical solutions with <strong>hardware, logic & code</strong>.</p>
            <p className="hero-intro">{profile.intro}</p>
            <div className="hero-actions">
              <a className="button button-primary" href="/resume.pdf" target="_blank" rel="noreferrer">View My Resume <ExternalLink size={16} /></a>
              <a className="button button-ghost" href="/resume.pdf" download="Vinjamuri_Lekhya_Sahiti_Resume.pdf">Download PDF <Download size={16} /></a>
              <a className="button button-ghost" href="#contact">Contact Me <ArrowUpRight size={16} /></a>
            </div>
            <div className="hero-meta">
              <span><MapPin size={14} /> {profile.location}</span>
              <span><GraduationCap size={14} /> SGPA: 9.48 / 10 · 2nd Year</span>
              <span><Mail size={14} /> {profile.email}</span>
            </div>
          </div>
          <div className="hero-visual" aria-label="Profile of Vinjamuri Lekhya Sahiti">
            <div className="orbit orbit-one" aria-hidden="true" />
            <div className="orbit orbit-two" aria-hidden="true" />
            <div className="profile-card">
              <div className="profile-photo"><span className="profile-monogram">LS</span><span className="profile-signal profile-signal-one"><Cpu size={13} /></span><span className="profile-signal profile-signal-two"><Sparkles size={13} /></span><span className="profile-signal profile-signal-three" /><span className="profile-scanline" /><div className="photo-caption">Vinjamuri<br />Lekhya Sahiti</div></div>
              <div className="profile-card-footer"><span>VNRVJIET / Engineering</span><span>Open to Internships <span className="mini-dot" /></span></div>
            </div>
            <div className="floating-note floating-note-top"><Sparkles size={15} /><span>Building with<br /><strong>Sensors & Code</strong></span></div>
            <div className="floating-note floating-note-bottom"><span>Currently exploring</span><strong>AI & Embedded Systems</strong></div>
          </div>
        </section>

        <section className="proof-strip section-wrap" aria-label="Recruiter snapshot">
          <div className="proof-card"><span>01 / Current focus</span><strong>Software development & technical internships</strong></div>
          <div className="proof-card"><span>02 / Core practice</span><strong>Java · C++ · Data Structures</strong></div>
          <div className="proof-card"><span>03 / Hands-on</span><strong>IoT · Sensors · Microcontrollers</strong></div>
          <div className="proof-card"><span>04 / Academic</span><strong>VNRVJIET · 2nd Year · SGPA 9.48</strong></div>
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
                  <span className="bio-sgpa-pill">SGPA 9.48 / 10</span>
                </div>
                <div className="bio-body-text">
                  <p>
                    Second-year <strong>B.Tech student</strong> at <strong>VNRVJIET</strong> with a strong academic record (<span className="highlight-text">SGPA 9.48/10</span>) and a keen interest in <strong>software development</strong>, <strong>AI</strong>, and <strong>problem solving</strong>.
                  </p>
                  <p>
                    Currently building solid foundations in <strong>Java</strong>, <strong>C++</strong>, and <strong>Data Structures</strong>, and applying them through hands-on <strong>embedded systems, microcontrollers, and sensor telemetry</strong> projects.
                  </p>
                  <p>
                    Regularly participates in hackathons and coding challenges, including reaching the final round of the <strong>SYNTH VISION Hackathon conducted by Krithomedh</strong>. Seeking <strong>software development and technical internship opportunities</strong> to build practical technology solutions and grow as a programmer.
                  </p>
                </div>
                <div className="bio-chips">
                  <span className="bio-chip"><Trophy size={13} /> SYNTH VISION Finalist</span>
                  <span className="bio-chip"><GraduationCap size={13} /> VNRVJIET · 2nd Year B.Tech</span>
                  <span className="bio-chip"><Award size={13} /> SGPA 9.48 / 10</span>
                  <span className="bio-chip"><Code2 size={13} /> Java · C++ · DSA</span>
                  <span className="bio-chip"><Zap size={13} /> Open for Internships</span>
                </div>
                <div className="bio-card-footer">
                  <span className="bio-footer-note"><Sparkles size={14} /> Explore by signal</span>
                  <div className="bio-footer-links"><a className="text-link" href="#projects">Trace the builds <ArrowUpRight size={16} /></a><a className="text-link" href="#contact">Find the right fit <ArrowUpRight size={16} /></a></div>
                </div>
              </article>
            </div>
            <div className="about-details">
                  <div><span className="detail-label">Career goal</span><p>Seeking software development and technical internship opportunities to build practical technology solutions, apply core data structures, embedded system principles, and algorithmic thinking to grow as an engineer.</p></div>
                  <div className="about-focus-grid"><div><span>01</span><strong>Software foundations</strong><p>Java, C++, data structures, algorithms, and web fundamentals.</p></div><div><span>02</span><strong>Embedded practice</strong><p>NodeMCU, sensors, microcontrollers, and IoT project work.</p></div><div><span>03</span><strong>Growth mindset</strong><p>Hackathons, coding platforms, and a steady focus on practical problem solving.</p></div></div>
                  <div><span className="detail-label">Strengths</span><div className="tag-list">{["Data Structures & Algorithms", "SYNTH VISION Finalist", "Embedded Systems & Prototyping", "Rapid Problem Solving", "Academic Rigor (SGPA 9.48)", "Microcontroller Firmware"].map(tag => <span className="tag" key={tag}>{tag}</span>)}</div></div>
              <div className="quote-callout"><Quote size={22} /><p>Practical engineering starts with solid fundamentals and the curiosity to build.</p></div>
            </div>
          </div>
        </section>

        <section className="section-wrap content-section skills-section" aria-labelledby="skills-title">
          <SectionHeading id="skills-title" index="02 /" eyebrow="Capability map" title="The tools I turn into momentum." body="A practical technical stack across programming, problem solving, web fundamentals, and embedded systems—plus the habits that shape how I show up while learning and building." />
          <div className="skills-grid">
            <div className="skill-panel"><div className="panel-label panel-label-stack"><Layers3 size={17} /><span>Technical toolkit<small>Languages · logic · hardware</small></span></div>{technicalSkills.map(skill => <div className="skill-row" key={skill.label}><div className="skill-row-top"><span>{skill.label}</span><span>{skill.signal}</span></div><div className="skill-rule" aria-hidden="true"><span /></div></div>)}</div>
            <div className="skill-panel soft-panel"><div className="panel-label"><Zap size={17} /> How I show up</div><p className="panel-intro">I bring a curious, hands-on approach: understand the problem, build a working path, test the idea, and keep learning from the result.</p><div className="soft-skill-list">{softSkills.map(skill => <span key={skill}><Check size={14} /> {skill}</span>)}</div><div className="skill-footnote">Curious by default. Analytical under constraints. Always driven to solve practical problems.</div></div>
          </div>
        </section>

        <section className="section-wrap content-section" id="work" aria-labelledby="work-title">
          <SectionHeading id="work-title" index="03 /" eyebrow="Selected practice" title="Proof of practice, not just potential." body="A closer look at how coursework becomes action: embedded-systems projects, coding-platform practice, and a technical hackathon finale." />
          <div className="timeline">{experience.map((item, index) => <article className="timeline-item" key={item.role}><div className="timeline-marker"><span>0{index + 1}</span></div><div className="timeline-content"><div className="timeline-top"><span className="period">{item.period}</span><span className="company">{item.company}</span></div><h3>{item.role}</h3><p>{item.description}</p><div className="outcome-list">{item.outcomes.map(outcome => <span key={outcome}><CheckCircle2 size={14} /> {outcome}</span>)}</div></div></article>)}</div>
        </section>

        <section className="section-wrap content-section education-section" aria-labelledby="education-title">
          <div className="split-heading"><SectionHeading id="education-title" index="04 /" eyebrow="Academic foundation" title="A record built on consistency." /><span className="section-side-note">Learning by building<br />B.Tech in IoT · SGPA 9.48/10.</span></div>
          <div className="education-grid">{education.map(item => <article className="education-card" key={item.title}><div className="education-year">{item.year}</div><GraduationCap size={23} /><h3>{item.title}</h3><p className="education-school">{item.school}</p><p>{item.detail}</p></article>)}</div>
        </section>

        <section className="section-wrap content-section project-section" id="projects" aria-labelledby="projects-title">
          <SectionHeading id="projects-title" index="05 /" eyebrow="Selected projects" title="When theory meets a working build." body="Selected projects showing how I move from a technical idea to a tangible system across sensors, wireless control, embedded hardware, and problem solving." />
          <div className="project-list">{projects.map(project => <article className={`project-card ${project.tone}`} key={project.title}><div className="project-visual"><div className="visual-window"><div className="visual-window-bar"><span /><span /><span /></div><div className="visual-lines"><b /><b /><b /><i /><i /></div></div><span className="project-number">{project.number}</span></div><div className="project-body"><div className="project-type">{project.type}</div><h3>{project.title}</h3><p>{project.description}</p><p className="project-detail">{project.detail}</p><div className="project-tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div><div className="project-footer"><strong>{project.metric}</strong><span className="project-badge">{project.badge}</span></div></div></article>)}</div>
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
            <p>Second-year B.Tech student at VNRVJIET (SGPA 9.48/10) and SYNTH VISION Hackathon Finalist, seeking software development and technical internship opportunities. With foundations in Java, C++, data structures, web fundamentals, and IoT hardware, I am looking for a place to keep learning by contributing to practical systems.</p>
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
              <span className="channel-meta">B.Tech Engineering · SGPA 9.48 / 10</span>
            </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer"><span>© 2026 Vinjamuri Lekhya Sahiti. Built with intention.</span><a href="#top">Back to top <ArrowDown size={14} className="rotate-up" /></a></footer>

      <button className={`chat-launcher ${chatOpen ? "is-open" : ""}`} type="button" onClick={() => setChatOpen(open => !open)} aria-label={chatOpen ? "Close resume assistant" : "Open resume assistant"} aria-expanded={chatOpen}><span className="chat-launcher-icon">{chatOpen ? <X size={20} /> : <MessageCircle size={21} />}</span><span className="chat-launcher-copy"><strong>Ask the assistant</strong><small>Quick route through the work</small></span></button>
      {chatOpen ? <aside className="chat-panel" aria-label="Resume assistant" aria-live="polite"><div className="chat-header"><div className="chat-title"><span className="chat-avatar"><Bot size={18} /></span><div><strong>Portfolio assistant</strong><span><span className="status-dot" /> Online · for {profile.name}</span></div></div><div className="chat-header-actions"><button type="button" className="chat-icon" onClick={clearChat} title="Clear chat history" aria-label="Clear chat history"><Trash2 size={15} /></button><button type="button" className="chat-icon" onClick={() => setChatOpen(false)} title="Close assistant" aria-label="Close assistant"><X size={17} /></button></div></div><div className="chat-messages">{messages.map(message => <div className={`chat-message ${message.role}`} key={message.id}><div className="chat-bubble"><Streamdown>{message.content}</Streamdown></div><span className="chat-time">{message.timestamp}</span></div>)}{chatTyping ? <div className="chat-message assistant"><div className="chat-bubble typing"><i /><i /><i /></div><span className="chat-time">Thinking...</span></div> : null}</div>{messages.length === 1 ? <div className="chat-suggestions"><span>Try asking</span>{suggestedQuestions.map(question => <button key={question} type="button" onClick={() => askAssistant(question)}>{question}<ChevronDown size={13} className="suggestion-arrow" /></button>)}</div> : null}<form className="chat-input" onSubmit={event => { event.preventDefault(); void askAssistant(draft); }}><input value={draft} onChange={event => setDraft(event.target.value)} placeholder="Ask about the work..." aria-label="Ask the portfolio assistant" /><button type="submit" disabled={!draft.trim() || chatTyping} aria-label="Send question"><Send size={17} /></button></form></aside> : null}
    </div>
  );
}

export default Home;
