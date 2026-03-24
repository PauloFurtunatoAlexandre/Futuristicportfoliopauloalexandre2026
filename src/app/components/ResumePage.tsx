import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  ArrowUpRight,
  MapPin,
  Mail,
  Phone,
  Linkedin,
  Github,
  Globe,
  Briefcase,
  GraduationCap,
  Wrench,
  Download,
  Sparkles,
} from "lucide-react";
import { CustomCursor } from "./CustomCursor";

/* ─────────────────────────────────────────
   Data
   ───────────────────────────────────────── */

const EXPERIENCE = [
  {
    company: "Rentvine",
    role: "Senior Product Designer",
    location: "Remote",
    period: "Jul 2025 – Present",
    bullets: [
      "Led end-to-end product design strategy for a B2B property management SaaS platform — defining interaction models, discovery workflows, and cross-team design standards that drove a 22% lift in feature adoption and 18% improvement in task completion rates.",
      "Partnering with VP of Product and Engineering leadership to translate complex operational requirements into scalable solutions, reducing engineering rework by 25% and cutting release cycle time by 15%.",
      "Pioneered AI-assisted design workflows using Claude AI across prototyping, UX research synthesis, and UX writing — compressing early-stage exploration from days to hours.",
      "Mentored senior designers in AI-assisted ResearchOps practices — establishing structured frameworks for leveraging Claude AI in insight generation and content standards.",
      "Conducted a full-platform experience audit mapping all touchpoints to surface friction and systemic gaps.",
      "Built a DesignOps infrastructure of reusable journey maps, decision logs, and documentation standards — increasing validated solution rate by 30% and reducing design cycle time by 20%.",
    ],
  },
  {
    company: "Solstice Innovations",
    role: "Senior Product Designer",
    location: "Remote",
    period: "Feb 2024 – Jul 2025",
    bullets: [
      "Directed the creation of a company-wide design system that streamlined redesign cycles and maintained visual consistency across products.",
      "Mentored 3 designers, refining Figma workflows and improving team productivity through clear specifications and feedback sessions.",
      "Collaborated with cross-functional teams and engineers by developing functional prototypes that improved design-to-development handoff.",
    ],
  },
  {
    company: "Healthpilot",
    role: "Senior Product Designer",
    location: "Remote",
    period: "Jul 2022 – Dec 2023",
    bullets: [
      "Led the full UX/UI process for an AI-powered Medicare recommendation platform.",
      "Designed a mobile-first responsive web app that translated complex backend AI into intuitive user flows.",
      "Produced detailed design specs and prototypes that supported a $10M funding round and reinforced product-market fit.",
      "Increased usability by 51% and plan selection by 6% through continuous testing.",
      "Achieved a 97% satisfaction rate by aligning personas and journey maps with business goals.",
    ],
  },
  {
    company: "Great American Insurance Group",
    role: "Lead Product Designer",
    location: "Remote",
    period: "Jun 2021 – Jul 2022",
    bullets: [
      "Delivered new digital products (insured portal, risk management platform) and enhanced existing insurance systems.",
      "Led a team of 5 designers, maintaining a robust design system that reduced delivery times by 49%.",
      "Revamped corporate design system with accessibility focus, reducing UI inconsistencies by 70%.",
      "Facilitated design QA workshops, cutting support queries by 56%.",
    ],
  },
  {
    company: "Freelance",
    role: "Product Designer",
    location: "Remote",
    period: "Nov 2019 – Present",
    bullets: [
      "Developed data-driven design solutions and interactive prototypes using Figma, improving user retention by 25%.",
      "Created product roadmaps combining UX strategy and technical feasibility.",
      "Built strong client relationships through tailored UX/UI solutions and iterative feedback.",
    ],
  },
  {
    company: "MyAdvice",
    role: "Web Designer | Visual Designer",
    location: "Park City, UT",
    period: "Jun 2018 – Nov 2019",
    bullets: [
      "Led the design and development of comprehensive visual elements for web projects using CSS and JavaScript, improving client satisfaction and increasing user engagement by 20%.",
      "Simplified navigation flows and implemented WCAG 2.0 standards, resolving 25% of usability complaints.",
      "Facilitated discovery sessions with clients to convert complex business goals into actionable designs, enhancing project success and fostering stronger client partnerships.",
    ],
  },
  {
    company: "DevSquad",
    role: "Jr. UI Designer — Intern",
    location: "Salt Lake City, UT",
    period: "Jan 2017 – Jun 2018",
    bullets: [
      "Integrated with Agile teams, contributing to daily stand-ups, sprint planning, and retrospectives to enhance team synergy and communication.",
      "Extended expertise beyond UI design into frontend development, crafting responsive designs, interactive elements, and ensuring design-to-development fidelity.",
      "Adopted an iterative design strategy within Agile cycles, focusing on continuous feedback and design refinement to meet user and stakeholder expectations.",
    ],
  },
  {
    company: "Figger Creative Agency",
    role: "Entry Level Web Designer",
    location: "Orem, UT",
    period: "Jun 2016 – Jan 2017",
    bullets: [
      "Aided in the development and execution of minor projects, applying hands-on skills to move initiatives from concept to reality.",
      "Edited WordPress themes to tailor-fit customer requirements, leveraging HTML, CSS, Bootstrap, and JavaScript.",
      "Used Photoshop and Illustrator to create and modify visual elements, enhancing user interfaces and experiences.",
    ],
  },
];

const EDUCATION = [
  { degree: "MBA, UX Research and Leadership", year: "2024", school: "UNIFATEC / Toronto Business School" },
  { degree: "Certification, UX Unicorn", year: "2022", school: "UX Unicorn" },
  { degree: "Certification, Interaction Design Foundation", year: "2022", school: "IDF" },
  { degree: "Full Stack Web Development & Computer Science", year: "2021", school: "Bloomtech Bootcamp" },
  { degree: "Associates, Business", year: "2018", school: "Columbia College" },
  { degree: "Associates, Marketing", year: "2012", school: "UNIP" },
  { degree: "Technical Degree, Graphic Design & Digital Illustration", year: "2005", school: "Impacta" },
];

const SKILLS = {
  "Design Tools": "Figma, Adobe XD, Miro, Balsamiq, Photoshop, Illustrator, Maze",
  "UX Research": "User Personas, Journey Mapping, Usability Testing, A/B Testing, Card Sorting, Tree Testing, User Interviews, JTBD, Design Studio, Workshops",
  "Design Systems": "Scalable UI Libraries, WCAG Compliance, Accessibility, Atomic Design, Prototyping, Wireframing, Userflow, Storytelling, Design QA",
  "Frontend Dev": "HTML, CSS, JavaScript, React, Redux, Node.js",
  "Collaboration": "Stakeholder Engagement, Agile/Scrum, Jira, Trello",
  "Leadership": "Team Mentorship, Design Workshops, Backlog Prioritization, System Design",
};

const LINKS = {
  linkedin: "https://www.linkedin.com/in/paulofurtunatoalexandre/",
  portfolio: "/",
};

/* ─────────────────────────────────────────
   Helpers
   ───────────────────────────────────────── */

function Grain() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[9998] opacity-[0.03]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
      }}
    />
  );
}

function SectionTitle({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div className="flex items-center gap-3 mb-8">
      <div className="w-8 h-8 border border-[#c4ff00]/20 flex items-center justify-center">
        <Icon size={14} className="text-[#c4ff00]" />
      </div>
      <h2
        className="text-[0.65rem] tracking-[0.4em] uppercase text-[#c4ff00]"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {label}
      </h2>
      <div className="flex-1 h-px bg-white/[0.06]" />
    </div>
  );
}

/* ─────────────────────────────────────────
   Page
   ───────────────────────────────────────── */

export function ResumePage() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: containerRef });
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  // Keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") navigate("/");
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [navigate]);

  // Scroll to top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <CustomCursor />
      <Grain />

      {/* Progress bar */}
      <motion.div
        className="fixed top-0 left-0 h-[2px] bg-[#c4ff00] z-[9999]"
        style={{ width: progressWidth }}
      />

      <div ref={containerRef} className="relative min-h-screen bg-[#0a0a0b] text-[#e8e6e3]" style={{ position: "relative" }}>
        {/* ─── HEADER BAR ─── */}
        <motion.header
          className="sticky top-0 z-50 backdrop-blur-xl bg-[#0a0a0b]/80 border-b border-white/[0.04]"
          initial={{ y: -60 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="max-w-6xl mx-auto px-6 md:px-10 flex items-center justify-between h-14">
            <button
              onClick={() => navigate("/")}
              className="group flex items-center gap-2 text-[#6b6b76] hover:text-[#c4ff00] transition-colors duration-300"
            >
              <ArrowLeft size={14} />
              <span
                className="text-[0.6rem] tracking-[0.3em] uppercase"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Back to Portfolio
              </span>
            </button>

            <div className="flex items-center gap-4">
              <a
                href="/paulo-alexandre-resume.pdf"
                download="Paulo_Alexandre_Resume.pdf"
                className="group flex items-center gap-2 px-4 py-2 border border-[#c4ff00]/20 hover:border-[#c4ff00]/60 hover:bg-[#c4ff00]/[0.04] transition-all duration-300"
              >
                <Download size={12} className="text-[#c4ff00]/60 group-hover:text-[#c4ff00] transition-colors" />
                <span
                  className="text-[0.6rem] tracking-[0.3em] uppercase text-[#c4ff00]/60 group-hover:text-[#c4ff00] transition-colors"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  Download PDF
                </span>
              </a>
            </div>
          </div>
        </motion.header>

        <main className="max-w-6xl mx-auto px-6 md:px-10 py-12 md:py-20">
          {/* ─── IDENTITY BLOCK ─── */}
          <motion.section
            className="mb-16 md:mb-24"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
              <div>
                <motion.p
                  className="text-[0.55rem] tracking-[0.5em] uppercase text-[#c4ff00]/40 mb-4"
                  style={{ fontFamily: "var(--font-mono)" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Curriculum Vitae
                </motion.p>
                <h1
                  className="text-[clamp(2rem,5vw,3.5rem)] tracking-tight text-[#e8e6e3]"
                  style={{ fontFamily: "var(--font-heading)", lineHeight: 1 }}
                >
                  Paulo Alexandre
                </h1>
                <p
                  className="mt-3 text-[clamp(0.85rem,1.5vw,1.1rem)] text-[#6b6b76]"
                  style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
                >
                  Senior Product Designer
                </p>
              </div>

              <div className="flex flex-col gap-2 md:items-end">
                {[
                  { icon: MapPin, text: "Saint Petersburg, FL · Remote · EST" },
                  { icon: Mail, text: "furtuna.alexandre@gmail.com" },
                  { icon: Phone, text: "+1-385-309-7153" },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-2">
                    <item.icon size={11} className="text-[#6b6b76]/40" />
                    <span
                      className="text-[0.65rem] tracking-[0.15em] text-[#6b6b76]/60"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {item.text}
                    </span>
                  </div>
                ))}
                <div className="flex items-center gap-3 mt-1">
                  <a
                    href={LINKS.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#6b6b76]/40 hover:text-[#c4ff00] transition-colors"
                  >
                    <Linkedin size={14} />
                  </a>
                  <a
                    href="https://github.com/pauloalexandre"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#6b6b76]/40 hover:text-[#c4ff00] transition-colors"
                  >
                    <Github size={14} />
                  </a>
                  <a
                    href="/"
                    className="text-[#6b6b76]/40 hover:text-[#c4ff00] transition-colors"
                  >
                    <Globe size={14} />
                  </a>
                </div>
              </div>
            </div>

            {/* Summary */}
            <motion.div
              className="mt-10 border-l-2 border-[#c4ff00]/20 pl-6 md:pl-8 max-w-4xl"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
            >
              <p
                className="text-[0.85rem] text-[#a0a0a8] leading-relaxed"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Senior Product Designer with over 9 years of experience in insurance and healthcare,
                plus 3 additional years designing user-centered solutions across various industries.
                Known for creating intuitive, scalable digital experiences that drive engagement and
                business impact. Successfully led the development of company-wide design systems,
                spearheaded end-to-end product design for platforms that secured significant investment,
                and brings deep domain expertise with a collaborative mindset to accelerate product growth.
              </p>
            </motion.div>
          </motion.section>

          {/* ─── TWO-COLUMN LAYOUT ─── */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-16 lg:gap-20">
            {/* LEFT — Experience */}
            <div>
              <SectionTitle icon={Briefcase} label="Experience" />

              <div className="space-y-12">
                {EXPERIENCE.map((job, i) => (
                  <motion.div
                    key={job.company + job.period}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.6, delay: i * 0.05 }}
                  >
                    {/* Company header */}
                    <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-4">
                      <div>
                        <h3
                          className="text-[0.95rem] text-[#e8e6e3]"
                          style={{ fontFamily: "var(--font-heading)" }}
                        >
                          {job.company}
                        </h3>
                        <p
                          className="text-[0.75rem] text-[#c4ff00]/60"
                          style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
                        >
                          {job.role}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-[0.55rem] tracking-[0.3em] text-[#6b6b76]/40"
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        <span>{job.location}</span>
                        <span className="text-[#c4ff00]/20">·</span>
                        <span>{job.period}</span>
                      </div>
                    </div>

                    {/* Bullets */}
                    <ul className="space-y-2">
                      {job.bullets.map((b, j) => (
                        <li key={j} className="flex gap-3">
                          <span className="mt-[7px] w-1 h-1 bg-[#c4ff00]/30 shrink-0" />
                          <span
                            className="text-[0.78rem] text-[#a0a0a8] leading-relaxed"
                            style={{ fontFamily: "var(--font-body)" }}
                          >
                            {b}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* RIGHT — Skills + Education */}
            <div className="space-y-14">
              {/* Skills */}
              <div>
                <SectionTitle icon={Wrench} label="Skills" />
                <div className="space-y-6">
                  {Object.entries(SKILLS).map(([category, skills]) => (
                    <motion.div
                      key={category}
                      initial={{ opacity: 0, x: 10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5 }}
                    >
                      <h4
                        className="text-[0.55rem] tracking-[0.35em] uppercase text-[#e8e6e3]/40 mb-2"
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        {category}
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {skills.split(", ").map((skill) => (
                          <span
                            key={skill}
                            className="px-2.5 py-1 text-[0.6rem] tracking-[0.1em] border border-white/[0.06] text-[#a0a0a8]/70 hover:border-[#c4ff00]/20 hover:text-[#c4ff00]/60 transition-all duration-300"
                            style={{ fontFamily: "var(--font-mono)" }}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div>
                <SectionTitle icon={GraduationCap} label="Education" />
                <div className="space-y-4">
                  {EDUCATION.map((edu, i) => (
                    <motion.div
                      key={edu.degree}
                      className="group"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.05 }}
                    >
                      <div className="flex items-baseline justify-between gap-2">
                        <span
                          className="text-[0.55rem] tracking-[0.3em] text-[#c4ff00]/30"
                          style={{ fontFamily: "var(--font-mono)" }}
                        >
                          {edu.year}
                        </span>
                      </div>
                      <p
                        className="text-[0.78rem] text-[#c4ff00] mt-0.5"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        {edu.degree}
                      </p>
                      <p
                        className="text-[0.65rem] text-[#6b6b76]/50"
                        style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
                      >
                        {edu.school}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <SectionTitle icon={Sparkles} label="Links" />
                <div className="space-y-2">
                  {[
                    { label: "Portfolio", href: "/", external: false },
                    { label: "LinkedIn", href: LINKS.linkedin, external: true },
                    { label: "Medium", href: "https://medium.com/@paulo-alexandreuxd", external: true },
                  ].map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      className="group flex items-center justify-between py-2 border-b border-white/[0.04] hover:border-[#c4ff00]/20 transition-all duration-300"
                    >
                      <span
                        className="text-[0.7rem] text-[#a0a0a8] group-hover:text-[#c4ff00] transition-colors duration-300"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        {link.label}
                      </span>
                      <ArrowUpRight
                        size={12}
                        className="text-[#6b6b76]/30 group-hover:text-[#c4ff00] transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ─── FOOTER ─── */}
          <motion.div
            className="mt-20 pt-8 border-t border-white/[0.04] flex flex-col md:flex-row items-center justify-between gap-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <span
              className="text-[0.5rem] tracking-[0.4em] uppercase text-[#6b6b76]/30"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Paulo Alexandre · Senior Product Designer · {new Date().getFullYear()}
            </span>
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="text-[0.5rem] tracking-[0.4em] uppercase text-[#6b6b76]/30 hover:text-[#c4ff00] transition-colors"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Back to Top ↑
            </button>
          </motion.div>
        </main>
      </div>
    </>
  );
}