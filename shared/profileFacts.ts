export type AssistantIntent =
  | "profile"
  | "skills"
  | "projects"
  | "education"
  | "achievements"
  | "contact"
  | "availability"
  | "resume"
  | "unknown";

export const assistantResponses: Record<AssistantIntent, string> = {
  profile:
    "### Profile summary\n\nVinjamuri Lekhya Sahiti is an aspiring **Software Engineer** pursuing a **B.Tech in Internet of Things (IoT)** at **VNR Vignana Jyothi Institute of Engineering & Technology**, with a strong academic record (**CGPA: 9.48/10**). She is skilled in **C, C++, Java, Data Structures, Problem Solving, and web technologies**, with experience developing IoT-based projects that demonstrate practical implementation and analytical skills.\n\nShe is eager to contribute to software development teams, build efficient and scalable solutions, apply technical knowledge to real-world challenges, and continue growing as a software professional.",
  skills:
    "### Technical skills\n\n- **Programming:** C, C++, and Java\n- **Core practice:** Data Structures and Problem Solving\n- **Web fundamentals:** HTML, CSS, and JavaScript\n- **IoT and embedded systems:** NodeMCU, sensors, and microcontrollers\n- **Interests:** Software development, AI, and problem solving",
  projects:
    "### Selected projects\n\n- **Underground Soil Moisture Detection System:** An IoT-based system for monitoring underground soil moisture levels using sensors, microcontrollers, and embedded-systems fundamentals.\n- **NodeMCU Wi-Fi Controlled Smart Car:** A smart car controlled wirelessly over Wi-Fi using NodeMCU.\n\nShe also practices Data Structures and algorithmic problem solving in C++ and Java through LeetCode and CodeChef.",
  education:
    "### Academic background\n\n- **Degree:** B.Tech in Internet of Things (IoT)\n- **Year:** 2nd Year\n- **Institution:** VNR Vignana Jyothi Institute of Engineering & Technology (VNRVJIET)\n- **Academic performance:** CGPA **9.48 / 10**\n- **Relevant study:** Programming fundamentals in C, C++, and Java; Data Structures; and IoT / embedded-systems coursework",
  achievements:
    "### Achievements and practice\n\n- **SYNTH VISION Hackathon Finalist:** The hackathon was conducted by Krithomedh; Lekhya reached the final round and gained experience building and presenting a technical solution under time constraints.\n- **Coding practice:** Active problem-solving practice through LeetCode (`VLekhya`) and CodeChef (`lekhya_sahi_27`).\n- **Academic record:** CGPA **9.48 / 10** at VNRVJIET.",
  contact:
    "### Contact\n\n- **Email:** 25071A6962@vnrvjiet.in\n- **Phone:** +91 80742 86134\n- **LinkedIn:** linkedin.com/in/lekhya-vinjamuri\n- **GitHub:** github.com/lekhya-coder\n- **LeetCode:** leetcode.com/u/VLekhya\n- **CodeChef:** codechef.com/users/lekhya_sahi_27\n- **Location:** Hyderabad, India · VNRVJIET",
  availability:
    "### Internship availability\n\nVinjamuri Lekhya Sahiti is seeking **software development and technical internship opportunities**. She is building experience across Java, C++, Data Structures, embedded systems, IoT, and problem solving.",
  resume:
    "### Resume\n\nUse the **View resume** button above to open the supplied PDF in a new tab, or use **Download PDF** to save it directly.",
  unknown:
    "I can answer questions about Lekhya's resume-grounded profile, skills, projects, education, achievements, availability, contact details, and resume. I don't have a reliable answer for that question in the supplied resume; please use the Contact section for anything more specific.",
};

export function answerForIntent(intent: string): string {
  return assistantResponses[intent as AssistantIntent] ?? assistantResponses.unknown;
}

export function intentsForQuestion(question: string): AssistantIntent[] {
  const q = question.toLowerCase().trim();
  const matched: AssistantIntent[] = [];
  const add = (intent: AssistantIntent, pattern: RegExp) => { if (pattern.test(q)) matched.push(intent); };
  add("resume", /resume|cv|download|view.*(resume|cv)|pdf/);
  add("availability", /intern|hire|job|availab|opportunit|open to work|recruit/);
  add("contact", /contact|email|phone|linkedin|github|leetcode|codechef|reach|reach out|get in touch|call|message/);
  add("projects", /project|built|build|worked|work experience|experience|soil|moisture|car|nodemcu|wi-?fi|hardware|embedded/);
  add("skills", /skill|language|tech|stack|java|c\+\+|\bc\b|dsa|data structure|html|css|javascript|microcontroller|sensor|iot/);
  add("education", /education|college|university|cgpa|cgpa|gpa|vnrvjiet|study|degree|year|coursework|academic/);
  add("achievements", /hackathon|achievement|award|competition|contest|synthe|vision|finalist|coding practice|leetcode|codechef/);
  add("profile", /summary|bio|profile|background|about( me)?|who (is|are)|introduce|\b(hello|hi|hey)\b/);
  return matched.length ? [...new Set(matched)] : ["unknown"];
}

export function intentForQuestion(question: string): AssistantIntent {
  return intentsForQuestion(question)[0];
}
