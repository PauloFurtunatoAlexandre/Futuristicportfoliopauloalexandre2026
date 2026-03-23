import { useRef, useState, useEffect, useCallback } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
} from "motion/react";
import { useParams, useNavigate } from "react-router";
import { ArrowUpRight, ArrowLeft, ChevronDown, List, X } from "lucide-react";
import hpHeroImg from "../../assets/7bbfacf2ed4c6625d9871c3ff14d7a198146a50e.png";
import hpSprintsImg from "../../assets/e2c9b5e4456bde9556a8dbcb865ef68da69e82d6.png";
import hpPersonasImg from "../../assets/14640d519882e99e696e2223fbbf15663f2564eb.png";
import hpJourneyImg from "../../assets/c352a90999e00126857a04eb13e42e7f5f69f24f.png";
import hpDesignSystemImg from "../../assets/4557a4d2218b0b670e8fd145275b787327362ddd.png";
import hpPrototypeImg from "../../assets/034ad9d3633de3ed493e98ea68bb2c011588308f.png";
import gaigHeroImg from "../../assets/cover GAIG.jpg";
import gaigGovernanceImg from "../../assets/c35660da526b770b87bc8706aead9e0e29c30947.png";
import gaigOktaFlowImg from "../../assets/63e5e2c472eddce43fa09e3f9e9d33d39bfaec9b.png";
import gaigDesignSystemImg from "../../assets/ef8d5502022f65513bc7abb342bbd1ebeec7aad5.png";
import gaigWireframesImg from "../../assets/457fbf26f1b28dde307d0333bdc3e4a93e5f38d2.png";
import gaigPrototypeImg from "../../assets/0142f6db386879a40ccbbf223cde1c8e797dae2b.png";
import riseHeroImg from "../../assets/rise.jpeg";
import riseRiskMatrixImg from "../../assets/impactxeffort matrix.jpg";
import risePersonasImg from "../../assets/rise personas.jpg";
import riseJourneyImg from "../../assets/rise journey map.jpg";
import riseWireframesImg from "../../assets/crazy 8s.jpg";
import riseDesignSystemImg from "../../assets/cover rise.jpg";
import risePrototypeImg from "../../assets/mobile version.jpg";
import solsticeHeroImg from "../../assets/example of screen.png";
import solsticePersonasImg from "../../assets/solstice personas.jpg";
import solsticeJourneyImg from "../../assets/🗺️ Consumer Portal - User Journey Map.jpg";
import solsticeFindingsImg from "../../assets/slide findings solstice.png";
import solsticeHmwImg from "../../assets/hmw solstice.png";
import solsticeFlowImg from "../../assets/component creation flow.png";
const rvHeroImg = "https://images.unsplash.com/photo-1758304481488-c323378f89ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9wZXJ0eSUyMG1hbmFnZW1lbnQlMjBhcGFydG1lbnQlMjBidWlsZGluZyUyMG1vZGVybnxlbnwxfHx8fDE3NzM4NTExODB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const rvResearchImg = "https://images.unsplash.com/photo-1735639013995-086e648eaa38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1c2VyJTIwcmVzZWFyY2glMjB3aGl0ZWJvYXJkJTIwc3RpY2t5JTIwbm90ZXMlMjBicmFpbnN0b3JtfGVufDF8fHx8MTc3Mzc2MzQxMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const rvWireframesImg = "https://images.unsplash.com/photo-1680016661694-1cd3faf31c3a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlZnJhbWUlMjBza2V0Y2hlcyUyMG5vdGVib29rJTIwVVglMjBkZXNpZ258ZW58MXx8fHwxNzczODUxMTc5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const rvDesignSystemImg = "https://images.unsplash.com/photo-1769149068959-b11392164add?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ24lMjBzeXN0ZW0lMjBjb21wb25lbnRzJTIwVUklMjBsaWJyYXJ5JTIwc2NyZWVufGVufDF8fHx8MTc3Mzg1MTE3OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const rvPrototypeImg = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxTYWFTJTIwZGFzaGJvYXJkJTIwYW5hbHl0aWNzJTIwcGxhdGZvcm0lMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzczODUxMTgwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const rvProcessImg = "https://images.unsplash.com/photo-1681505504714-4ded1bc247e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWFzZSUyMGFncmVlbWVudCUyMGRvY3VtZW50JTIwc2lnbmluZyUyMGRpZ2l0YWx8ZW58MXx8fHwxNzczODUxMTc4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
import { CustomCursor } from "./CustomCursor";
import { FloatingNav } from "./FloatingNav";
import { useIsMobile, useReducedMotion } from "./ui/useMediaQuery";
import { BeforeAfterSlider } from "./BeforeAfterSlider";

/* ─────────────────────────────────
   Easing tokens
   ───────────────────────────────── */
const EASE_OUT = [0.25, 0.46, 0.45, 0.94] as const;
const EASE_SMOOTH = [0.43, 0.13, 0.23, 0.96] as const;

/* ───────────────────────────��─────
   Case Study Data
   ───────────────────────────────── */
interface CaseStudyData {
  slug: string;
  title: string;
  subtitle: string;
  client: string;
  year: string;
  role: string;
  timeline: string;
  team: string;
  platform: string;
  tools: string[];
  color: string;
  heroImage: string;
  problem: string;
  context: string;
  constraints: string[];
  researchInsights: { title: string; detail: string }[];
  researchImage?: string;
  strategy: string;
  strategyPillars: { title: string; description: string }[];
  processSteps: { title: string; description: string }[];
  processImage?: string;
  journeyImage?: string;
  wireframeImage: string;
  designSystem: { label: string; description: string }[];
  designSystemImage: string;
  prototypeHighlights: string[];
  prototypeImage: string;
  outcomes: { label: string; value: string; change: string }[];
  learnings: string[];
  reflection: string;
  improvements: string[];
  nextProject: { slug: string; title: string; image: string };
}

const CASE_STUDIES: CaseStudyData[] = [
  {
    slug: "rentvine",
    title: "RENTVINE",
    subtitle: "Turning property managers' messiest workflow into a four-stage pipeline",
    client: "Rentvine",
    year: "2025",
    role: "Senior Product Designer & Product Engineer",
    timeline: "Jul 2025 – Present",
    team: "Rentvine Product & Engineering Leadership",
    platform: "Web (B2B SaaS — Property Management)",
    tools: ["Figma", "Jira", "Claude AI", "Figma-to-Claude MCP"],
    color: "#c4ff00",
    heroImage: rvHeroImg,
    problem:
      "Rentvine covers the full property management lifecycle — portfolios, screening, leasing, accounting, maintenance, reporting. But lease renewals, one of the highest-impact recurring workflows in the entire industry, had no home in the software. Every active lease in a portfolio eventually needs renewal. Every lease that lapses into month-to-month status represents lost revenue for owners, eroded confidence in the management company, and a growing administrative burden that compounds month after month. Property managers were handling this entirely outside the platform: Airtable boards, Google Sheets with 90-day formulas, Asana for task distribution, ad-hoc emails drafted from scratch for every owner. The result was a workflow that was fragile, opaque, and deeply personal. Every property manager had reinvented the wheel, and every reinvention had its own failure modes. Renewals slipped. Owners received inconsistent messaging. Team leads had no visibility into who was handling what. And when a lease lapsed because nobody caught the expiration — that was revenue walking out the door.",
    context:
      "The business case wasn't abstract: every lapsed lease costs real money, renewal management was where competitors could steal clients, and the inefficiency scaled dangerously with portfolio size. A solo manager with 30 units could muscle through manually. A firm managing 500+ units with a team of coordinators? Without assignment tracking, bulk operations, and templated communications, it was operationally unsustainable. Those exact customers — the ones Rentvine needed to retain and grow — were feeling the most pain. I designed the system that would replace all of those workarounds using Rentvine's proprietary design system, Trellis, and pioneered an AI-assisted design workflow using Claude AI with a direct Figma-to-Claude MCP integration.",
    constraints: [
      "No existing renewal feature to build on — designing a net-new workflow from zero inside an established production platform",
      "Four distinct user personas with fundamentally different operational scales (30 units to 1,000+) that must be served by the same system",
      "State-specific lease regulations requiring template flexibility without sacrificing workflow standardization",
      "Design system constraints of Trellis — Rentvine's proprietary system — which had to be extended without breaking existing patterns",
      "Phased delivery mandate — Phase 1 beta had to ship intentionally incomplete to validate the core loop before investing in collaboration and efficiency layers",
    ],
    researchImage: rvResearchImg,
    researchInsights: [
      {
        title: "Four personas, four completely different renewal realities",
        detail:
          "The solo operator (30–80 units) needs speed — every minute saved is a minute for her hundred other responsibilities. The portfolio coordinator (150–400 units) sits at the breakdown point where manual tracking fails; he needs a single view that feels like a spreadsheet. The team lead (400–800+ units) isn't processing renewals herself — she's distributing them and needs accountability and workload visibility. The enterprise director (1,000+ units) thinks in systems: reporting, automation rules, and confidence that the process scales without proportional headcount growth. These personas became the lens through which every design decision was evaluated.",
      },
      {
        title: "Five universal problems beneath the persona differences",
        detail:
          "No centralized status view — managers couldn't answer 'how many leases expire in 90 days?' without leaving Rentvine. No structured workflow — every renewal was an ad-hoc project with inconsistent steps. No owner communication tools — identical emails drafted from scratch dozens of times per quarter. No bulk operations — every action required per-row interaction at any scale. No internal accountability — teams managed ownership through Slack and standup because the software offered nothing. These five problems became the design brief.",
      },
      {
        title: "Grid-first is a trust signal for power users",
        detail:
          "Research consistently showed that property managers think in rows and columns. They expect to scan 50+ records without clicking into detail views, sort by any column, and move fast with keyboard shortcuts. When a property manager sees a data grid, they immediately know they're in a tool built for people who work at volume. Choosing a grid-first experience wasn't just a UX decision — it was a positioning choice that communicated 'we understand your scale' before a single interaction occurred.",
      },
      {
        title: "The beta should ship incomplete — by design",
        detail:
          "Phased delivery isn't cutting corners; it's a research strategy. Launching the beta without team assignment, bulk actions, or owner messaging templates created a controlled environment to validate the core loop — can users move a renewal through four stages and complete it? The post-beta research was more actionable than initial discovery because users were reacting to a real product, not a theoretical one. The gaps they surfaced first (accountability, bulk operations, owner messaging) matched the research hypotheses exactly, giving the roadmap an evidence base instead of an assumption base.",
      },
    ],
    strategy:
      "Design in phases because shipping the wrong thing fast is worse than shipping the right thing iteratively. Phase 1 (Beta) establishes the core pipeline: Review → Price & Send → Sign → Finalize. These four stages mirror how property managers already think about renewals — extracted from research, not imposed. Phase 2 validates the gaps through post-beta observation. Phase 3 addresses each gap with targeted additions: the assignee system for accountability, bulk actions for scale, and owner messaging templates to compress a 5-minute task into 30 seconds. Not a redesign between phases — targeted extensions that preserve the core pipeline.",
    strategyPillars: [
      {
        title: "Four-Stage Pipeline with Grid-First Interface",
        description:
          "Review → Price & Send → Sign → Finalize mirrors how property managers already think. The primary interface is a data grid — not a kanban, not a card view. Spreadsheet-speed interactions: inline editing, keyboard navigation, scan-and-act patterns — inside a product interface that tracks state, enforces workflow, and maintains audit trails in ways a spreadsheet never could. The grid communicates 'we understand your volume' before the first interaction.",
      },
      {
        title: "Accountability Without Process Overhead",
        description:
          "The assignee system had to work for team leads managing workload distribution and stay invisible to solo operators who don't need it. Assignee as a first-class grid column — not a detail panel field. Assignment via inline popover, not a modal, so managers stay in grid context. Unassigned state as a dashed circle — not an empty cell — combined with a red count badge and workload summary bar that replaces the Asana boards teams were building manually.",
      },
      {
        title: "AI-Augmented Design Infrastructure",
        description:
          "Documented and operationalized the full Trellis token system. Codified the Rentvine application shell for reuse across every future prototype. Built an engineering principles skill encoding Rentvine's domain model and a seven-step workflow — the team's shared operating model for AI-augmented design. Established a direct Figma-to-Claude MCP connection enabling real-time design context to flow into the prototyping workflow. Infrastructure that pays dividends across every project, not just renewals.",
      },
    ],
    processImage: rvProcessImg,
    processSteps: [
      {
        title: "Persona Development & Problem Mapping",
        description:
          "Mapped four distinct operational realities — solo operator, portfolio coordinator, team lead, enterprise director — with fundamentally different renewal needs. Identified five universal problems that cut across all four: no status view, no structured workflow, no owner communication tools, no bulk operations, and no internal accountability. These five became the design brief, with every subsequent decision evaluated against all four personas.",
      },
      {
        title: "Phase 1 Beta — Core Pipeline Design",
        description:
          "Designed the four-stage pipeline (Review → Price & Send → Sign → Finalize) with a grid-first interface. Made the critical decision to ship intentionally incomplete — excluding team assignment, bulk actions, and owner messaging templates. The goal was to validate the core loop: can users complete a renewal through four stages? Inline editing, keyboard navigation, and column sorting gave property managers the spreadsheet-speed interactions they demanded.",
      },
      {
        title: "Post-Beta Research & Gap Validation",
        description:
          "Observed which gaps users surfaced first after beta launch. Team organizations immediately asked 'Who is handling this?' — validating the accountability gap. Solo operators described copy-paste email workflows in nearly identical terms — validating the owner communication gap. Every user managing 30+ renewals expressed frustration with one-at-a-time interactions — validating the bulk operations gap. Behavioral evidence confirmed research hypotheses before Phase 3 investment.",
      },
      {
        title: "Assignee System — Accountability Made Visible",
        description:
          "Assignee as first-class grid column positioned after Tenant and before Status — answering 'Who owns this?' and 'Where is it?' simultaneously. Assignment via inline popover (not modal) to preserve grid flow and spreadsheet speed. Unassigned state as a dashed circle with red count badge and workload summary bar showing each team member's renewal count. The interface makes accountability gaps visible passively — team leads don't need to chase people.",
      },
      {
        title: "Bulk Actions — Batch Processing Workspace",
        description:
          "Multi-select with three input modes: checkbox clicks, Shift-click range selection, and Ctrl/Cmd-click for non-contiguous picks — the selection behavior managers already have from spreadsheets, no learning curve. Dark toolbar anchored to viewport bottom with Assign, Change Status, and Vacate actions. Toast confirmations ('12 renewals assigned to Sarah Chen'), not modal dialogs — bulk operations should feel fast and reversible, not ceremonial. Every bulk action generates a per-renewal audit log entry.",
      },
      {
        title: "Owner Messaging Templates & Design Infrastructure",
        description:
          "Templates triggered contextually at the Price & Send stage — where the work happens, not in a generic settings library. Pre-populated with system data: property address, unit number, lease dates, current rent, proposed rent, calculated percentage increase. Reduces a 5-minute email to a 30-second review-and-send. Alongside this: documented the full Trellis token system, codified the application shell for reuse, pioneered the Figma-to-Claude MCP connection, and created a comprehensive Claude engineering principles skill adopted as the team's shared AI-augmented design operating model.",
      },
    ],
    wireframeImage: rvWireframesImg,
    designSystem: [
      { label: "Trellis Tokens", description: "Full documentation of Rentvine's proprietary Trellis system — semantic color tokens with Light/Dark mode, Inter Variable + Space Mono typography scales, spacing 0–3200, border radius/width tokens, and four-breakpoint responsive grid" },
      { label: "Grid-First Patterns", description: "Data grid interaction model with inline editing, keyboard navigation, multi-select (checkbox, Shift-click, Ctrl/Cmd-click), and scan-and-act patterns — spreadsheet speed inside a stateful product interface" },
      { label: "Pipeline Stage Components", description: "Four-stage renewal pipeline UI — Review, Price & Send, Sign, Finalize — with stage transition logic, inline status updates, and audit trail generation per action" },
      { label: "Bulk Action Toolbar", description: "Viewport-anchored dark toolbar activating on multi-select with contextual actions, toast confirmation system, and per-renewal audit log entries for every batch operation" },
      { label: "Figma-to-Claude MCP", description: "Direct Figma Desktop to Claude AI bridge via Model Context Protocol over WebSocket — real-time design context flowing into prototyping workflows, enabling high-fidelity prototypes referencing actual Figma components" },
    ],
    designSystemImage: rvDesignSystemImg,
    prototypeHighlights: [
      "Four-stage renewal pipeline (Review → Price & Send → Sign → Finalize) with grid-first interface — spreadsheet-speed interactions inside a stateful, audit-tracked product workflow",
      "Assignee system as first-class grid column with inline popover assignment, dashed-circle unassigned state, workload summary bar replacing manual Asana boards",
      "Bulk action toolbar with three-mode multi-select, viewport-anchored contextual actions, and toast confirmations — batch processing workspace for portfolio-scale renewals",
      "Owner messaging templates triggered at Price & Send stage, pre-populated with system data — compressing a 5-minute email composition to a 30-second review-and-send",
      "Figma-to-Claude MCP integration enabling real-time design context in prototyping workflows, adopted as the team's shared AI-augmented design operating model",
    ],
    prototypeImage: rvPrototypeImg,
    outcomes: [
      { label: "Feature Adoption", value: "+22%", change: "Property managers migrated from external tracking tools into the in-product renewal pipeline" },
      { label: "Task Completion", value: "+18%", change: "Four-stage pipeline and grid-first interface completing renewals without context switching" },
      { label: "Engineering Rework", value: "-25%", change: "Trellis documentation and design-to-dev precision eliminated spec ambiguity" },
      { label: "Design Cycle Time", value: "-20%", change: "Figma-to-Claude MCP and AI-assisted workflows compressed concept-to-prototype time" },
      { label: "Validated Solution Rate", value: "+30%", change: "Phased discovery framework grounding shipped features in behavioral evidence" },
      { label: "Pipeline Stages", value: "4", change: "Review → Price & Send → Sign → Finalize, matching how managers already think" },
    ],
    learnings: [
      "The best product design systematizes behavior users already have. Property managers already thought about renewals in four stages. They already wanted spreadsheet-speed interactions. They already tracked workload distribution visually. I didn't invent a new workflow — I gave their existing workflow a home inside the product, with the structure and automation that external tools couldn't provide.",
      "Phased delivery is a research strategy, not a compromise. Launching the beta incomplete created a controlled environment to observe which gaps users surfaced first, validating hypotheses with behavioral evidence rather than interview recall. The post-beta research was more actionable than initial discovery because users were reacting to a real product.",
      "Grid-first design is a trust signal. When a property manager sees a data grid, they immediately know they're in a tool built for people who work at scale. The decision to lead with the grid was a positioning choice as much as a UX choice — it communicates 'we understand your volume' before a single interaction occurs.",
      "AI-assisted design isn't about replacing thinking — it's about compressing setup. The Claude AI workflows and MCP integration didn't design the features. They eliminated hours of boilerplate work: prototype scaffolding, realistic data population, component spec encoding. That compression created more time for the thinking that actually matters — understanding users, making trade-offs, and validating decisions.",
    ],
    reflection:
      "This project represents how I work at my best: deep in the domain, iterating with real users, building infrastructure that outlasts any single feature, and designing systems that respect how people already think. Lease renewals aren't glamorous. But for every property manager who stopped dreading the 90-day window because the software finally handled it — that's the impact I design for. What I'm most proud of isn't a single deliverable. It's that the methodology I built here — the phased validation approach, the Figma-to-Claude MCP infrastructure, the AI-augmented design operating model — is now how the team works. The feature shipped. The infrastructure stays.",
    improvements: [
      "Should have established a time-on-task baseline before the beta — measuring exactly how much time managers spent in external tools. Qualitative evidence was compelling, but a quantitative before/after on external-tool usage would have made the adoption story more precise for stakeholders.",
      "The owner messaging template system needs smarter state-specific rule handling. The current approach covers common cases well but requires manual overrides for state-specific legal clauses. A template engine that auto-applies state rules would eliminate the last manual bottleneck in the workflow.",
      "The Figma-to-Claude MCP documentation needs to mature into a structured onboarding curriculum. What feels intuitive after months of practice needs codification — clear setup steps, example prompts, and pattern libraries — so designers joining the team can adopt it without bottlenecking through me.",
    ],
    nextProject: { slug: "solstice", title: "SOLSTICE", image: "https://images.unsplash.com/photo-1702726001096-096efcf640b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNobm9sb2d5JTIwY29uc3VsdGluZyUyMG9mZmljZSUyMG1vZGVybiUyMGRhcmslMjBtb29keXxlbnwxfHx8fDE3NzM4MDMwMTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
  },
  {
    slug: "healthpilot",
    title: "HEALTHPILOT",
    subtitle: "Turning Medicare chaos into confident decisions",
    client: "HealthPilot",
    year: "2023",
    role: "Senior Product Designer",
    timeline: "19 months",
    team: "Cross-functional — PMs, engineers, stakeholders",
    platform: "Web (Desktop & Mobile)",
    tools: ["Figma", "FigJam", "Miro", "Jira", "Midjourney", "Slack"],
    color: "#c4ff00",
    heroImage: hpHeroImg,
    problem:
      "When I joined HealthPilot, there was no design team — just me. I was the sole designer responsible for every pixel, every flow, every user experience on the platform. Seniors were abandoning Medicare enrollment mid-flow, frustrated and distrustful. The product read like an insurance manual, not a tool built for the people who needed it most. I didn't inherit a design system or a research practice — I built both from scratch. I conducted the interviews. I ran the usability tests. I redesigned the enrollment flow. I created the component library. Later, as the product matured and the company grew, I mentored a junior designer into the role, established UX research processes that outlasted my tenure, and built design practices that became the foundation for everything that followed. Every innovation on that platform — from the plan comparison engine to the simplified language framework — started with me, alone, asking the question nobody else had asked: why are people leaving?",
    context:
      "HealthPilot simplifies Medicare plan selection for seniors — a demographic drowning in jargon, fine print, and paralyzing choice overload. The product team flagged high abandonment, but nobody had asked users why. I took the initiative to dig beneath the analytics, conducting interviews and usability tests to find the human story behind the numbers. What I found: people weren't confused by Medicare — they were confused by us.",
    constraints: [
      "Medicare compliance requirements — every data point and disclaimer legally mandated",
      "Users skew 65+ with varying digital literacy — no room for assumed tech fluency",
      "Complex insurance terminology that must remain accurate while becoming accessible",
      "Four-month deadline for V1 — speed without sacrificing quality",
      "Must support the full enrollment funnel from discovery to plan selection to sign-up",
    ],
    researchImage: hpPersonasImg,
    researchInsights: [
      {
        title: "Jargon is the enemy",
        detail:
          "70% of 349 surveyed users reported significant difficulty searching for plans. Terms like 'deductible' and 'coinsurance' created decision paralysis — users didn't just misunderstand, they stopped trusting the platform entirely.",
      },
      {
        title: "Confusion compounds into abandonment",
        detail:
          "15 user interviews revealed a pattern: users who hit friction at navigation didn't try to recover — they left. One confused moment cascaded into total dropout. The flow had no safety nets.",
      },
      {
        title: "Guidance is trust",
        detail:
          "Users who received contextual tips and progress cues reported feeling 'supported' — and completed enrollment at dramatically higher rates. A lack of visual guidance made the platform feel indifferent to their struggle.",
      },
      {
        title: "Comparison is the moment of truth",
        detail:
          "Usability testing showed the plan comparison step was the highest-friction point. Users couldn't hold plan differences in their heads. Side-by-side with clear pros/cons was the single most requested feature.",
      },
    ],
    strategy:
      "Strip the experience down to its emotional core: someone trying to make the best healthcare decision of their year. Every screen should earn trust, reduce cognitive load, and make the next step obvious. Replace insurance jargon with human language. Add progress indicators so nobody feels lost. Introduce plan comparison so nobody second-guesses.",
    strategyPillars: [
      {
        title: "Simplified Language",
        description:
          "Collaborated with subject matter experts to rewrite every term. 'Coinsurance' became 'your share of costs.' Accuracy preserved, anxiety eliminated. Users said it felt like talking to a knowledgeable friend.",
      },
      {
        title: "Step-by-Step Guidance",
        description:
          "Progress indicators and contextual tips at every decision point. Users always know where they are, what's next, and why it matters. No screen leaves them guessing.",
      },
      {
        title: "Plan Comparison Engine",
        description:
          "Side-by-side plan views with clear pros, cons, and cost breakdowns. Transformed the most anxiety-inducing step into the most confidence-building one.",
      },
    ],
    processImage: hpSprintsImg,
    processSteps: [
      {
        title: "Discovery & Deep Dive",
        description:
          "Conducted 15 user interviews, a 349-person survey, and live usability tests. Ran competitive analysis and desk research to benchmark against similar platforms and identify differentiation opportunities.",
      },
      {
        title: "Problem Mapping",
        description:
          "Built user journey maps and personas from research. Used dot-voting with PMs and business stakeholders to prioritize the three core friction points: navigation confusion, jargon overload, and missing guidance.",
      },
      {
        title: "Design Sprints",
        description:
          "Facilitated collaborative Design Studio workshops generating 15+ ideas. Evaluated each on an Impact/Effort matrix — prioritized high-impact, low-effort wins like simplified navigation and step-by-step indicators.",
      },
      {
        title: "Wireframes & Iteration",
        description:
          "Created low-fidelity wireframes for a streamlined enrollment flow. Tested early concepts with the team, killed what didn't work, doubled down on what did.",
      },
      {
        title: "High-Fidelity & Testing",
        description:
          "Built detailed prototypes with simplified language, progress indicators, and plan comparison. Remote moderated testing with 10 participants showed 90% success rate — users praised clarity and usability.",
      },
      {
        title: "Design System & Launch",
        description:
          "Developed comprehensive token and component library for consistency and scale. Launched iteratively, continuously validating with user feedback and refining post-launch.",
      },
    ],
    wireframeImage: hpJourneyImg,
    designSystem: [
      { label: "Typography", description: "Clear, high-contrast type scale optimized for 65+ readability — generous sizing, tight hierarchy" },
      { label: "Color", description: "Accessible palette meeting WCAG AAA. Trust-first blues and greens, warm neutrals for comfort" },
      { label: "Components", description: "Plan cards, comparison tables, progress indicators, contextual tip modules — all senior-friendly tap targets" },
      { label: "Language", description: "Full terminology glossary co-authored with SMEs — every insurance term has a plain-English equivalent" },
      { label: "Patterns", description: "Reusable enrollment step templates, error recovery flows, and decision-support layouts" },
    ],
    designSystemImage: hpDesignSystemImg,
    prototypeHighlights: [
      "Step-by-step enrollment flow with progress indicators and contextual micro-copy explaining every data request",
      "Side-by-side plan comparison with plain-language pros, cons, and cost breakdowns",
      "Contextual tooltips translating insurance jargon into human language on hover/tap",
      "Decision-confidence scoring that helps users feel certain about their final plan choice",
    ],
    prototypeImage: hpPrototypeImg,
    outcomes: [
      { label: "Plan Selection Rate", value: "+6%", change: "Users choosing plans with confidence" },
      { label: "Drop-Off Rate", value: "-25%", change: "Simplified navigation kept users engaged" },
      { label: "User Satisfaction", value: "97%", change: "Post-launch survey approval" },
      { label: "Usability Score", value: "+51%", change: "Iterative testing improvements" },
      { label: "Investment Secured", value: "$10M", change: "New funding round post-redesign" },
      { label: "Test Success Rate", value: "90%", change: "Remote moderated usability testing" },
    ],
    learnings: [
      "Decoding jargon isn't about dumbing down — it's about translating expertise into empathy. Collaborating with SMEs ensured accuracy while making every term feel approachable and trustworthy.",
      "Stakeholder alignment requires storytelling, not just data. Connecting research findings directly to business goals created a shared vision across competing priorities.",
      "Time constraints aren't enemies — they're forcing functions. Focusing on highest-impact features first and validating iteratively delivered more value than a perfect, late product ever would.",
    ],
    reflection:
      "This project changed how I think about complexity. Medicare isn't inherently confusing — the interfaces we build around it are. The breakthrough wasn't a clever interaction pattern or a beautiful component. It was the decision to stop designing for insurance and start designing for people making one of the most consequential decisions of their year. The $10M investment wasn't won by pixels — it was won by proving that when you respect your users' intelligence while eliminating unnecessary friction, business results follow.",
    improvements: [
      "Should have pushed for personalized plan recommendations earlier — a dynamic system using behavior data to surface relevant plans would have further simplified decision-making.",
      "Live chat support during enrollment was a missed opportunity. Real-time human assistance at the highest-friction moments would have caught the users we couldn't save with design alone.",
      "Post-launch metrics monitoring needed a more robust framework from day one. Continuous tracking of plan selection, drop-offs, and satisfaction should have been baked into the product roadmap, not bolted on.",
    ],
    nextProject: { slug: "gaig", title: "GAIG", image: gaigHeroImg },
  },
  {
    slug: "gaig",
    title: "GAIG",
    subtitle: "Building a design system across 33 business lines — cutting delivery time 49% and eliminating 70% of UI inconsistencies",
    client: "Great American Insurance Group",
    year: "2021 – 2022",
    role: "Lead Product Designer",
    timeline: "12 months · Jun 2021 – Jul 2022",
    team: "Alexander Hounsou (Junior Designer), Austin O'Brien (Midlevel Designer), Chris Roblee (VP of Product), Melanie Book (Senior Developer) + 3 additional designers I mentored",
    platform: "Web (B2B Enterprise — Agent & Insured Portals)",
    tools: ["Figma", "Miro", "Microsoft Teams", "Jira"],
    color: "#c4ff00",
    heroImage: gaigHeroImg,
    problem:
      "Great American Insurance Group is a Fortune 500 company with over 33 distinct business lines. Each one had its own screens, its own workflows, its own visual language. Not by strategy — by neglect. Over years of siloed development, the platform had become a patchwork of interfaces that didn't talk to each other. An agent navigating from property insurance to risk management felt like switching between entirely different products. Form patterns changed. Button styles changed. Even the way the system communicated errors changed. The only consistent thing about the experience was inconsistency. For the agents, underwriters, and insured individuals using this platform daily, the cost was real. Every time they moved between modules, they had to relearn the interface. Tasks that should have taken minutes took longer because users couldn't transfer their knowledge from one section to another. The cognitive load wasn't just annoying — it was slowing down the business operations of a company that manages billions in coverage.",
    context:
      "When I joined as Lead Product Designer, the challenge was clear but the scope was enormous: unify a sprawling enterprise platform under a single, scalable design system — without breaking the 33 business lines that depended on it every day. There was no UX governance. No one owned the question of how things should look and behave across the company. Every team made local decisions that made sense in isolation but created chaos at scale. Agents reported feeling uncertain during critical tasks like policy enrollment and risk evaluation. In insurance, where a single form error can have legal and financial consequences, that uncertainty isn't just a UX problem — it's a business liability. Accessibility was an afterthought, creating compliance exposure in a heavily regulated industry. And without reusable components, every new feature was built from scratch, compounding time and quality costs across every team.",
    constraints: [
      "33 business lines with entrenched stakeholders — each believing their product's UI was 'different enough' to warrant custom treatment",
      "Legacy backend architecture that couldn't absorb sweeping visual changes overnight — required incremental adoption strategy",
      "Insurance compliance requirements mandating specific data fields, disclosures, and legal language across every product",
      "No existing accessibility standards — the platform had grown entirely without WCAG considerations",
      "Must support both agent-facing (power user, speed-optimized) and insured-facing (first-time, guidance-heavy) experiences from one shared system",
    ],
    researchImage: gaigGovernanceImg,
    researchInsights: [
      {
        title: "Silence breeds distrust",
        detail:
          "Interviews with 12 insured users alongside a UX researcher revealed the same pattern: when the system gave no feedback after an action, users assumed it had failed. They'd retry, create duplicates, or abandon entirely. One participant said, 'I clicked submit and nothing happened. I thought the whole thing was broken.' The platform's silence was its loudest design failure — and in insurance, where a submitted form can have legal consequences, that silence was creating genuine anxiety and workflow paralysis.",
      },
      {
        title: "Inconsistency is a productivity tax",
        detail:
          "Desk research and internal analytics confirmed what agents already knew: navigating between business lines forced constant cognitive reorientation. The same action — submitting a policy endorsement — looked and behaved differently in each product. Agents reported spending up to 15 extra minutes per task reorienting themselves. Across a full workday spanning multiple products, that tax compounded into hours of lost productivity per week, per agent.",
      },
      {
        title: "The enrollment funnel had no safety net",
        detail:
          "Service blueprints built across critical workflows revealed that users who hit friction at navigation never recovered. They didn't try alternative paths — they left. The enrollment funnel had no breadcrumbs, no progress indication, and no way back without starting over. The Okta verification flow blueprint alone uncovered three separate points where users received zero feedback, leading them to assume the system had broken.",
      },
      {
        title: "Accessibility was invisible — and legally exposed",
        detail:
          "An internal audit revealed zero inclusive design practices. Color contrast failures, missing alt text, keyboard navigation gaps — the platform was functionally unusable for anyone relying on assistive technology. For a company operating in a heavily regulated industry managing billions in coverage, this wasn't just a moral failure. It was a compliance liability waiting to surface.",
      },
    ],
    strategy:
      "Build the system in two parallel tracks: the artifacts and the process. On the artifact side, a token-first design system encoding every visual and interaction decision into reusable, governed primitives. On the process side, a UX governance model that makes drift structurally impossible. The system wouldn't just fix what was broken — it would make consistency the path of least resistance for every team, every time. I facilitated a Design Studio workshop with cross-functional members that generated 30+ ideas, then evaluated each through an impact/effort matrix, surfacing three foundational workstreams: standardized UI components, design tokens, and accessibility improvements.",
    strategyPillars: [
      {
        title: "Standardized Component Library",
        description:
          "Reusable UI components with built-in accessibility, consistent behavior, and clear documentation — covering the most common interaction patterns across all 33 business lines: forms, tables, navigation, modals, feedback states. Every button, form, and data table behaves identically whether you're in specialty risk or property casualty. Designers stop reinventing; developers stop rebuilding. Each component shipped with usage guidelines, do/don't examples, and implementation specs so the library could be used without interpretation.",
      },
      {
        title: "Design Tokens & Visual Identity",
        description:
          "Predefined variables for colors, typography, spacing, and elevation — a single source of truth that propagates across all 33 business lines. Before tokens, teams would approximate colors and spacing close to brand guidelines, but never exact. Over 33 lines, those approximations compounded into visual chaos. Tokens solved the 'close enough' problem: update one token, the change cascades everywhere. No more rogue palettes, inconsistent grays, or pixel-off spacing that accumulated into friction.",
      },
      {
        title: "UX Governance Framework",
        description:
          "A corporate-level change management process I built to control how the design system evolves. Any proposed change goes through impact assessment, stakeholder review, and accessibility validation before entering the library. I positioned myself as the gatekeeper — not to control the system, but to protect it. This role required equal parts design judgment and diplomatic skill. The governance model gave every team a voice while maintaining centralized quality control. Without it, the system would have fragmented within months.",
      },
    ],
    processImage: gaigOktaFlowImg,
    processSteps: [
      {
        title: "Discovery & Research",
        description:
          "Partnered with a UX researcher to conduct interviews with 12 insured users, watching people struggle through real tasks — policy enrollment, claims submission, risk assessment. Ran desk research across internal analytics, support ticket patterns, and specialist consultations to build a broader picture. Reviewed which UI problems generated the most confusion. Talked to internal specialists who fielded agent questions daily to surface what analytics couldn't reveal. The research gave me more than a UI problem list — it gave me a map of organizational behavior.",
      },
      {
        title: "Service Blueprinting",
        description:
          "Built comprehensive service blueprints mapping the full experience across critical workflows — not just user journeys, but backend systems, team handoff points, and places where technology and experience diverged. The Okta verification flow blueprint alone revealed three separate points where users received no feedback about what was happening, leading them to assume the system had broken. These blueprints made invisible failure points impossible to ignore.",
      },
      {
        title: "Design Studio Workshop",
        description:
          "Facilitated a cross-functional workshop with team members from design, product, and engineering that generated 30+ ideas for addressing the platform's consistency and usability gaps. Evaluated each through an impact/effort matrix. Three workstreams rose to the top: standardized UI components, design tokens, and accessibility improvements. Quick wins pursued in parallel with systemic fixes — building organizational momentum alongside the infrastructure.",
      },
      {
        title: "Wireframing & Iteration",
        description:
          "Created low-fidelity wireframes for key workflows — enrollment, claims, risk assessment — introducing logical navigation patterns, progress indicators, and real-time feedback mechanisms. Made a deliberate decision to implement incrementally rather than attempt a company-wide launch. The legacy architecture couldn't absorb a big-bang redesign. Focused the first rollout on the two highest-impact surfaces: the insured platform and risk management. Used them as proof of concept to build organizational confidence.",
      },
      {
        title: "High-Fidelity Design System",
        description:
          "Evolved wireframes into a polished component library with standardized UI elements, design tokens, and accessibility baked into every component from day one. Enhanced form design was where the biggest usability wins lived — insurance is a form-heavy domain, and I redesigned forms with logical grouping, inline validation, progressive disclosure, and clear feedback at every step. Built comprehensive documentation with usage examples and do/don't patterns. The system wasn't a library — it was a language.",
      },
      {
        title: "Testing, Governance Launch & Mentorship",
        description:
          "Conducted usability tests with 12 participants, achieving 40% improvement in task completion rates. Simultaneously launched the UX governance process ensuring changes pass impact assessment and accessibility validation before release. Led design QA workshops with engineering and QA teams establishing a repeatable quality assurance process. Mentored 4 designers through UX methodologies, design processes, and Figma best practices — establishing structured critique sessions, design review rituals, and feedback loops that scaled quality beyond what I could personally review.",
      },
    ],
    wireframeImage: gaigWireframesImg,
    designSystem: [
      { label: "Tokens", description: "Color, typography, spacing, and elevation tokens encoding every visual decision into a single governed source of truth — update once, propagate across all 33 business lines" },
      { label: "Components", description: "Standardized UI library — forms, tables, modals, navigation, feedback patterns — all with built-in accessibility, consistent behavior, and implementation specs" },
      { label: "Accessibility", description: "WCAG-compliant inclusive design: contrast ratios, keyboard navigation, screen reader support, focus management, and inline validation built into every component from day one" },
      { label: "Governance", description: "Corporate-level UX governance flow for proposing, reviewing, and approving design system changes — with impact assessment and accessibility validation as non-negotiable gates" },
      { label: "Documentation", description: "Comprehensive guidelines with usage examples, do/don't patterns, and Figma best practices — designed to outlast any individual contributor and enable the team to maintain and extend the system independently" },
    ],
    designSystemImage: gaigDesignSystemImg,
    prototypeHighlights: [
      "Redesigned insured portal with consistent navigation, progress indicators, and real-time feedback replacing years of platform silence",
      "Risk management interface with standardized data tables, inline validation, and contextual help — eliminating agent reorientation time between business lines",
      "Unified component library deployed across all 33 business lines, from specialty risk to property casualty, with zero visual fragmentation",
      "UX governance workflow ensuring every system change passes impact assessment and accessibility validation before release — making drift structurally impossible",
      "Mentored 4 designers through structured critique sessions and design reviews, scaling system quality across the entire team",
    ],
    prototypeImage: gaigPrototypeImg,
    outcomes: [
      { label: "Feature Delivery Speed", value: "+49%", change: "Standardized components eliminated rebuild waste across every sprint and every team" },
      { label: "UI Inconsistencies", value: "-70%", change: "Visual chaos replaced by a coherent, recognizable experience across all 33 business lines" },
      { label: "Task Completion Rate", value: "+40%", change: "Simplified navigation, clear form design, and consistent feedback states in usability testing" },
      { label: "Support Queries", value: "-56%", change: "Design QA workshops caught issues before they reached users" },
      { label: "Design-to-Dev Handoff", value: "+30%", change: "Standardized specs and shared component documentation removed implementation guesswork" },
      { label: "Designers Mentored", value: "4", change: "Team members who can independently maintain and extend the system" },
    ],
    learnings: [
      "Governance is the design system. The components are the visible layer of something deeper. The governance model — how changes get proposed, reviewed, and implemented — is what determines whether a system stays alive or slowly dies through a thousand local exceptions. I spent as much time on the process as I did on the Figma library, and that investment paid off.",
      "You can't mandate adoption — you have to earn it. Telling 33 teams to use the design system doesn't work. Showing them it saves time, reduces rework, and makes their output better does. The phased rollout strategy was critical because it let results do the persuading. Stakeholders who were skeptical saw the proof and became advocates.",
      "Mentoring multiplies impact. Every designer I trained became an ambassador for the system in their own team. By the time I moved on, the system had five people who understood it deeply enough to maintain and extend it — not just one. That's the difference between a design system and a personal project.",
      "Enterprise design is a patience game. You can't move fast and break things when 33 business lines depend on the platform daily. Incremental rollout, careful stakeholder management, and relentless documentation aren't glamorous — but they're how systems-level change actually happens in large organizations.",
    ],
    reflection:
      "This project taught me that the most impactful design work often isn't visible to users at all. Nobody celebrates a governance model or a design token. But when an agent in Ohio can navigate from property insurance to risk management without relearning the interface — when a developer can ship a feature in half the time because the components already exist — when a team of junior designers can produce senior-quality work because the system guides them — that's the compounding effect of design infrastructure done right. Great American had 33 business lines that had been designing in isolation for years — not because they wanted to, but because nobody had given them a shared language or a reason to converge. The real deliverable wasn't a Figma library. It was a governance model that made consistency feel like freedom instead of constraint.",
    improvements: [
      "Should have pushed harder for a dedicated accessibility audit at the start, not midway through. Retrofitting inclusive design is always more expensive than building it in from day one — and the compliance exposure made this a risk that should have been front-loaded.",
      "The incremental rollout — while necessary given legacy constraints — meant some business lines lived with inconsistency longer than ideal. A parallel 'fast track' for willing early adopters would have built internal momentum faster and given skeptical stakeholders proof points sooner.",
      "Needed more formalized design-to-engineering handoff documentation. The governance flow controlled design changes well, but translation to code still relied too heavily on tribal knowledge and individual relationships between designers and specific developers.",
    ],
    nextProject: { slug: "rise", title: "RISE", image: riseHeroImg },
  },
  {
    slug: "rise",
    title: "RISE",
    subtitle: "Designing emotion-driven shopping that turned confused browsers into loyal customers",
    client: "Rise Cannabis / Green Thumb Industries",
    year: "2021",
    role: "Senior Product Designer",
    timeline: "6 months",
    team: "Elizabeth Bacon (UX Strategist), Jamison Caloras (Product Designer), Lara Ledoroff (UX Researcher)",
    platform: "Web (E-Commerce), Mobile Web",
    tools: ["Figma", "Mural", "Slack", "Photoshop"],
    color: "#c4ff00",
    heroImage: riseDesignSystemImg,
    problem:
      "Cannabis isn't like buying a phone case. Nobody walks into a dispensary thinking 'I want 3.5 grams of Blue Dream.' They walk in thinking 'I want to feel relaxed after the worst week of my life' or 'I need something that helps me focus without the jitters.' The purchase decision is fundamentally emotional — but Rise Cannabis's platform was treating it like a catalog. The existing experience was built on a third-party system embedded through iFrames inside a WordPress site. That architecture created three compounding problems: we couldn't see what users were doing, we couldn't control how the experience felt, and the brand was invisible behind a generic shopping shell. Users were stuck translating their feelings into product specifications they didn't understand — and most of them just left. With competition accelerating, this wasn't just a UX problem. It was a business survival question: how do you turn an emotionally-driven purchase into an intuitive digital experience when you can't even track what users are clicking?",
    context:
      "Rise Cannabis, part of Green Thumb Industries — one of the largest multi-state operators in the U.S. — had a digital storefront that treated cannabis like commodity retail. The iFrame architecture meant zero behavioral data: no heatmaps, no funnel analysis, no understanding of where users dropped off or why. The brand had a distinct identity — premium, approachable, education-forward — but the third-party platform stripped all of that away. In a commoditized market, that invisibility was a death sentence for loyalty. I was brought in as Senior Product Designer alongside a UX strategist and researcher to redesign the shopping experience from the ground up — not by adding more filters to a broken catalog, but by reimagining how emotion could become the primary navigation paradigm.",
    constraints: [
      "iFrame architecture had blocked behavioral tracking for years — no analytics baseline to start from",
      "Heavily regulated industry — product claims, health language, and marketing copy all legally constrained",
      "Enormous product catalog across multiple dispensary locations with inconsistent inventory",
      "Users range from first-time cannabis buyers to experienced connoisseurs — one experience must serve both",
      "Competitive market where product selection is nearly identical across brands — experience is the only moat",
    ],
    researchImage: riseRiskMatrixImg,
    researchInsights: [
      {
        title: "Designing without a safety net",
        detail:
          "The iFrame setup had been blocking behavioral tracking for years. No conversion funnels, no click patterns, no session recordings. Instead of relying on historical data, I went straight to the source — surveying users and analyzing every piece of customer feedback available: support tickets, social comments, dispensary staff anecdotes. The pattern was immediate: users felt 'overwhelmed' and 'confused.' They knew how they wanted to feel, but the platform gave them strain names, THC percentages, and terpene profiles. The translation gap was enormous.",
      },
      {
        title: "The purchase decision is emotional first, informational second",
        detail:
          "Heuristic analysis and competitive benchmarking revealed the core insight: users needed to feel understood before they could feel confident. The existing information architecture assumed users would learn cannabis taxonomy — but they never would, and never should have needed to. Every drop-off point mapped back to the same moment: when the platform forced users to translate feelings into specs.",
      },
      {
        title: "Personas built on emotional needs, not demographics",
        detail:
          "The typical persona might say 'Sarah, 34, marketing manager.' Ours said 'Sarah wants to unwind after a 12-hour day and doesn't know the difference between indica and sativa — and shouldn't have to.' That reframing changed every design decision that followed. We built personas grounded in desired emotional states, not demographic buckets.",
      },
      {
        title: "Social proof as emotional validation",
        detail:
          "Customer interviews showed that users trusted other customers' emotional experiences over brand descriptions or budtender recommendations. 'This made me feel calm and focused' was more persuasive than any marketing copy we could write. That insight directly shaped the Feelings in Reviews concept — turning user-generated content into a navigation tool.",
      },
    ],
    strategy:
      "Flip the entire shopping paradigm. Instead of 'browse products → guess which one matches your mood,' make it 'tell us how you want to feel → here's exactly what to buy.' Two core tools surfaced from an 8-concept collaborative workshop: a Fit Guide that maps desired emotional states to product recommendations, and a Feelings in Reviews filter that lets customers sort by what other users actually felt. Commerce driven by empathy, not taxonomy.",
    strategyPillars: [
      {
        title: "The Fit Guide",
        description:
          "An interactive tool that starts with the only question that matters: 'How do you want to feel?' Users select emotional states — relaxed, energized, creative, focused, pain-free — through visual, approachable UI. The language is human ('I want to unwind,' not 'Select desired effect: Relaxation'). The system recommends products based on real effect profiles and user-reported outcomes. The moment the interface felt clinical, users disengaged — so every interaction was designed to feel like a conversation, not a form.",
      },
      {
        title: "Feelings in Reviews",
        description:
          "A filter system layered on top of user-generated reviews, letting customers sort products by emotional experiences shared by real people. Not star ratings — feeling tags. 'Made me creative,' 'helped me sleep,' 'perfect for anxiety.' The system used a layered information architecture: surface-level emotional tags visible at a glance, with deeper review content available on demand. Users could scan quickly or dig deep — their choice, their pace.",
      },
      {
        title: "Emotional Continuity Through Commerce",
        description:
          "The mood-based language and visual cues were carried through the entire purchase funnel — cart, checkout, order history — so the experience never abruptly shifted from 'warm and personal' to 'cold and transactional.' Confirmation language, order history organization, and re-order suggestions tied to previous mood selections reinforced that Rise remembered who you were and what you cared about.",
      },
    ],
    processImage: risePersonasImg,
    processSteps: [
      {
        title: "Discovery Without a Data Safety Net",
        description:
          "With no behavioral analytics available, I reframed the constraint as an opportunity. Instead of validating assumptions with historical data, I went straight to source: surveys, customer feedback analysis, support tickets, social comments, and dispensary staff anecdotes. Built a risk and assumptions matrix to identify what we knew, what we assumed, and where we needed validation.",
      },
      {
        title: "Heuristic Audit & Competitive Benchmarking",
        description:
          "Evaluated existing user flows to identify drop-off patterns through heuristic analysis — not analytics. Where did similar platforms lose people? Where were cognitive loads highest? The checkout flow alone had unnecessary steps that created friction at the exact moment users had committed to a purchase.",
      },
      {
        title: "Emotional Persona & Journey Development",
        description:
          "Created personas grounded in emotional needs, not demographics. Built customer journey maps revealing that the 'consideration' phase — the moment of translating feelings into product specs — was where the entire experience collapsed. This reframing changed every design decision that followed.",
      },
      {
        title: "Collaborative Workshop & Concept Prioritization",
        description:
          "Facilitated a structured workshop with stakeholders generating 8 distinct concepts, evaluated through an Impact/Effort matrix. The Fit Guide and Feelings in Reviews rose immediately — high impact, technically feasible, directly attacking the emotional gap from both directions. The Fit Guide solved 'I don't know where to start' paralysis; Feelings in Reviews solved 'I don't trust the description' hesitation. Some advanced filtering features were deliberately deprioritized to protect the simplicity of the core experience.",
      },
      {
        title: "Wireframing & Concept Validation",
        description:
          "Created low-fidelity wireframes for the Fit Guide flow, dispensary pages, and emotion-centric product filtering. Every round of refinement was guided by a single question: does this reduce the emotional distance between the user and the product? Tested early concepts with internal teams before investing in high-fidelity work.",
      },
      {
        title: "High-Fidelity Prototyping & Usability Testing",
        description:
          "Evolved wireframes into polished prototypes featuring the Fit Guide, Feelings in Reviews filter, redesigned dispensary pages, and a marketing page educating users on the new tools. Usability testing revealed a 60% success rate in users finding products aligned with their desired effects on the first attempt — and surfaced the tension around advanced filtering that led to the deliberate scope decision.",
      },
    ],
    journeyImage: riseJourneyImg,
    wireframeImage: riseWireframesImg,
    designSystem: [
      { label: "Emotional UI", description: "Color, imagery, and micro-copy calibrated to reflect emotional states — warm tones for relaxation, vibrant for energy, soft for calm. Cannabis is personal; the interface honors that." },
      { label: "Fit Guide", description: "Conversational mood-to-product matching engine — visual emotional state selectors, human language throughout, progressive disclosure from simple entry to detailed results" },
      { label: "Feelings in Reviews", description: "Layered feeling-tag system: surface-level emotional tags at a glance, deeper review content on demand. Social proof transformed into a navigable discovery tool." },
      { label: "Educational Commerce", description: "Contextual micro-education woven at decision points — not a separate knowledge base, but in-flow guidance at the exact moment of relevance" },
      { label: "Commerce Flow", description: "Cart, checkout, and order history redesigned with emotional continuity — mood-based language and re-order suggestions tied to previous feeling selections carry through the full funnel" },
    ],
    designSystemImage: riseDesignSystemImg,
    prototypeHighlights: [
      "Fit Guide: 'How do you want to feel?' as the primary entry point — conversational UI mapping emotional states to curated product recommendations",
      "Feelings in Reviews filter letting users sort products by real emotional experiences, with surface-level tags and deep-dive review content on demand",
      "Marketing page as strategic onboarding — educating users on the Fit Guide and Feelings filter before they encounter them organically",
      "Cart-to-checkout flow with emotional continuity: mood-based language, confidence-building cues, and order history tied to previous mood selections",
    ],
    prototypeImage: risePrototypeImg,
    outcomes: [
      { label: "Product Match Accuracy", value: "+61%", change: "Users finding effect-aligned products more efficiently" },
      { label: "User Engagement", value: "+44%", change: "More time exploring — rewarded exploration, not confusion" },
      { label: "Repeat Customers", value: "+52%", change: "Emotional continuity turned transactions into relationships" },
      { label: "Q3 Revenue", value: "$275M", change: "GTI quarterly — 9% sequential increase" },
      { label: "Usability Success", value: "60%", change: "First-attempt effect-matching task completion rate" },
      { label: "User Sentiment", value: "Positive", change: "Users said the platform 'got them' — intuitive, easy to navigate" },
    ],
    learnings: [
      "Designing for emotion is a strategic advantage, not a soft skill. The most impactful design decision on this project wasn't a UI pattern or an interaction model — it was the choice to organize the entire experience around how people feel rather than what products exist. That reframing unlocked everything that followed.",
      "Working without data forces sharper instincts. The lack of behavioral analytics was a constraint, but it pushed me to go deeper into qualitative research and develop stronger hypotheses. When you can't A/B test your way to an answer, you have to actually understand your users.",
      "Knowing what to cut is as important as knowing what to build. Postponing advanced filtering was the right call. It protected the simplicity of the core experience and gave us a clear roadmap for v2. Scope discipline isn't about doing less — it's about doing the right things first.",
    ],
    reflection:
      "This project changed how I think about commerce design. We spend so much energy optimizing funnels, reducing friction, A/B testing button colors — and none of it matters if the fundamental information architecture doesn't match how people actually make decisions. Rise customers weren't making rational choices based on THC percentages. They were making emotional choices based on how they wanted their evening to feel. The moment we rebuilt the entire shopping experience around that truth — feelings first, products second — everything moved. The 52% surge in repeat customers was the metric I cared about most. A one-time purchase is a transaction. A return visit is a relationship. And in a commodity market, repeat customers are the only metric that actually compounds.",
    improvements: [
      "The Feelings in Reviews filter needed more data density at launch — with limited reviews tagged by emotion, some product categories felt sparse. Should have seeded the system with structured data from budtender expertise before relying on user-generated content alone.",
      "Advanced filtering features were cut for scope, and I still think that was the right call. But 'future iteration' isn't a plan — the roadmap for re-introducing them needed to be concrete, with defined triggers for when to build them.",
      "Should have pushed harder for A/B testing the cart and checkout flows. We redesigned them based on best practices and usability testing, but quantitative validation in production would have given us the confidence to iterate faster post-launch.",
    ],
    nextProject: { slug: "rentvine", title: "RENTVINE", image: rvHeroImg },
  },
  {
    slug: "solstice",
    title: "SOLSTICE",
    subtitle: "Architecting a design system from scratch for a cloud-native insurance platform",
    client: "Solstice Innovations",
    year: "2024 – 2025",
    role: "Senior Product Designer",
    timeline: "~17 months · Feb 2024 – Jul 2025",
    team: "Michael Monk (CTO), TJ Johnston (Co-Founder & Underwriting Specialist), Joe Cooper (Product Owner), Aaron Truitt (Product Manager & Claims Specialist), Jay Mooney (Software Architect), Sindhura Bogadi (UX Researcher)",
    platform: "Web (B2B SaaS — Insurtech / Flood & P&C Insurance)",
    tools: ["Figma", "Miro", "Jira"],
    color: "#c4ff00",
    heroImage: solsticeHeroImg,
    problem:
      "Insurance carriers managing flood and property & casualty policies were stuck on legacy systems that made simple tasks painfully slow. Processing a claim required navigating fragmented interfaces, entering the same data multiple times, and working around tools that fought against them rather than supported them. Solstice Innovations was building Equinox™ to change that — a cloud-native platform unifying policy management, claims processing, CRM, quoting, and agency administration into a single system. The problem: when I joined, the product existed as engineering logic, not as a usable experience. There was no design system, no component library, no shared visual language. The development team was building features in silos, each engineer making independent UI decisions that were technically functional but experientially incoherent. Every usability failure was a sales failure — a confusing onboarding flow didn't just frustrate a user, it killed a deal. And in the background loomed catastrophe scalability: when a hurricane hits, carriers face thousands of claims in days, and if the interface slowed adjusters down at that exact moment, Equinox™ would fail at the moment it was supposed to prove its value.",
    context:
      "Equinox™ was competing against entrenched players like Guidewire and Duck Creek — platforms with established market share, extensive documentation, and decades of carrier trust. Equinox™ needed to differentiate not just on features but on experience. In a market where every competitor could process a claim, the platform that made processing a claim feel effortless would win. I was brought in to give this powerful backend a face that insurance professionals would actually want to use — and to build the design infrastructure that would let the product scale without collapsing under its own complexity. The key technical constraint that defined the entire design system strategy: the engineering team was already building with Material UI. I couldn't ignore that. I couldn't fight it. I had to design with it.",
    constraints: [
      "Engineering team already committed to Material UI — design system had to mirror MUI semantics from day one, not fight them",
      "No existing design system, component library, or visual language — building from zero while the product was actively in development",
      "Catastrophe scalability requirement — the UX had to perform under thousands of claims per day, not just calm conditions",
      "Startup environment with no established product culture, no discovery process, and no structured design-engineering collaboration",
      "Heavily regulated domain — insurance workflows involve compliance-specific fields, legal disclosures, and state-by-state rule variations",
    ],
    researchInsights: [
      {
        title: "Mapping what insurance professionals actually do all day",
        detail:
          "I partnered with the UX Researcher to define study scope and identify core jobs-to-be-done for each user type. A claims adjuster during a catastrophe event has fundamentally different needs than an agency administrator onboarding a new MGA. An underwriting specialist reviewing a quote operates under different cognitive pressures than a policyholder checking their coverage. We needed to design for all of them without designing for none of them. This framing prevented me from applying generic UX patterns to a domain that penalizes generic thinking.",
      },
      {
        title: "Domain experts as design partners, not just stakeholders",
        detail:
          "Aaron Truitt brought deep claims expertise. TJ Johnston understood underwriting from the inside. These weren't people to present to — they were design partners who could tell me immediately when a proposed workflow violated how insurance actually works. That collaboration was invaluable because it prevented me from designing elegant interfaces that would have been operationally useless. In specialized domains, proximity to expert practitioners is the fastest research method available.",
      },
      {
        title: "The existing flows were broken at the structure level",
        detail:
          "Analyzing the existing flows against users' actual routines revealed a familiar but sharp pattern: tasks that should take seconds required unnecessary clicks. Information users needed simultaneously was spread across multiple screens. Repetitive actions that screamed for automation were still fully manual. The order entry process alone took approximately 30 minutes — a number I was determined to cut dramatically. The interface wasn't just inconsistent; it was organized around system logic rather than user logic.",
      },
      {
        title: "Teams operating in silos were the root cause of the experience gap",
        detail:
          "Engineering, product, and what little design existed were making decisions independently. There was no shared understanding of who the users were, what their daily workflows looked like, or how design decisions affected development velocity. The gap between what Equinox™ could do and what users could actually accomplish with it was the company's biggest growth blocker — and it was organizational before it was technical.",
      },
    ],
    strategy:
      "Build the design system to mirror MUI's semantics from the start — not against them. Every component maps directly to an MUI equivalent, naming conventions match, prop structures align, interaction states correspond. Pair this with a shared operating model between design and engineering: joint design-dev reviews before implementation, shared Figma files with direct developer inspection, component handoffs with MUI-specific implementation notes, regular syncs with the Software Architect to validate feasibility before anything reaches the backlog. The system would be designed to ship cleanly, not polished in Figma and broken in production.",
    strategyPillars: [
      {
        title: "MUI-Aligned Design System",
        description:
          "Every component designed to map directly to an MUI equivalent. Naming conventions match. Prop structures align. Interaction states correspond. This meant developers looking at a Figma spec weren't translating between two languages — they were reading the same one. The trade-off: some visual preferences deferred to preserve development alignment. Worth it. A system that ships consistently beats one that looks perfect in Figma and breaks in implementation.",
      },
      {
        title: "Workflow Redesign Before Surface Polish",
        description:
          "Claims processing, quoting, policy management, and agency administration were restructured around the tasks users actually perform — not how the database stores data. Information architecture aligned to mental models. Redundant steps eliminated. Repetitive data entry automated. The order entry process target: cut from 30 minutes to a fraction. Every unnecessary click in a claims flow translates directly into delayed payouts for people whose homes are underwater.",
      },
      {
        title: "Design–Engineering Operating Model",
        description:
          "Introduced product discovery practices into a team building on assumptions. User interviews, workflow analysis, and competitive benchmarking gave every feature decision an evidence base. Joint design-dev reviews before implementation began. Mentored 3 product designers on Figma workflows, structured critique, and systematic design thinking. Closed the gap between parallel tracks by establishing working rituals, not process documents.",
      },
    ],
    processSteps: [
      {
        title: "Discovery & Domain Immersion",
        description:
          "Partnered with the UX Researcher to map jobs-to-be-done across all user types — claims adjusters, underwriters, agency administrators, policyholders. Worked directly with Aaron Truitt (claims) and TJ Johnston (underwriting) as domain experts to understand the regulatory constraints and operational realities that made insurance workflows genuinely different. Analyzed all existing flows against real user routines, documenting where system logic and user logic diverged.",
      },
      {
        title: "Design System Architecture — MUI-First",
        description:
          "Audited MUI's component semantics, prop structures, and interaction patterns before designing a single component. Built the Figma library to mirror what developers were already working with — matched naming, aligned states, corresponded interaction behaviors. Made deliberate trade-offs where MUI's opinions conflicted with design preferences, always in favor of production alignment. The system was designed to ship, not to sit in a Figma file.",
      },
      {
        title: "Core Workflow Redesigns",
        description:
          "Prioritized by stakes: claims processing first (catastrophe scalability), then quotes and policy management, then agency administration. Each workflow restructured around user logic rather than system architecture. Redundant steps eliminated. Repetitive manual data entry identified for automation. Information users needed simultaneously consolidated onto single views. Catastrophe mode — high-volume surge processing — given dedicated design consideration from day one.",
      },
      {
        title: "Design–Engineering Operating Model",
        description:
          "Established working rituals with Jay Mooney (Software Architect): joint design-dev reviews before implementation, shared Figma inspection access, component handoffs with MUI-specific implementation notes. Introduced lightweight discovery process with Aaron and TJ — user interviews, workflow analysis, competitive benchmarking — so feature decisions had evidence bases, not just assumptions. Regular syncs to validate design feasibility before work entered the backlog.",
      },
      {
        title: "Product Website Redesign",
        description:
          "Revamped the Equinox™ marketing site to clearly communicate the platform's value proposition — not as abstract feature lists, but in terms of the specific problems it solved for carriers. The website needed to do the same job as the product: make something complex feel clear and consequential. Restructured messaging around carrier pain points, with direct lines of sight to how Equinox™ resolved them. Result: 11% increase in lead conversion.",
      },
      {
        title: "Mentorship & Team Capability",
        description:
          "Mentored 3 product designers on Figma workflows, structured critique, and systematic design thinking. In a startup where everyone is stretched thin, building team capability wasn't a luxury — it was a survival strategy. Every designer upskilled was one more person who could maintain the system, extend it, and apply it correctly without bottlenecking through me. Established design review rituals that created accountability alongside the shared ownership that makes systems self-sustaining.",
      },
    ],
    researchImage: solsticePersonasImg,
    journeyImage: solsticeJourneyImg,
    processImage: solsticeFindingsImg,
    wireframeImage: solsticeHmwImg,
    designSystem: [
      { label: "MUI Alignment", description: "Every component mirrors MUI semantics — matched naming conventions, aligned prop structures, corresponding interaction states — so developers implement directly without translation" },
      { label: "Tokens", description: "Color, typography, spacing, elevation, and shadow tokens as a single governed source of truth — scalable across new insurance product lines, user roles, and regulatory requirements" },
      { label: "Workflow Patterns", description: "Claims processing, quoting, policy management, and agency administration redesigned around user logic — redundant steps eliminated, information hierarchy matched to daily task sequences" },
      { label: "Feedback & Validation", description: "Inline validation, loading states, success confirmations, and error handling built into every component — eliminating the silent failures that destroyed trust in legacy insurance platforms" },
      { label: "Extensibility", description: "Every component designed with configurability for future insurance product lines and user roles — constrained enough to prevent fragmentation, flexible enough to avoid rebuilds" },
    ],
    designSystemImage: solsticeFlowImg,
    prototypeHighlights: [
      "Claims processing flow redesigned for catastrophe scalability — redundant steps eliminated, repetitive data entry automated, information surfaced in the order adjusters need it",
      "Quotes and policy management restructured around user mental models rather than database architecture — reducing learning curve for experienced adjusters",
      "Agency administration dashboard with role-based access controls, real-time reporting, and structured MGA onboarding flow",
      "MUI-aligned component library enabling developers to implement directly from Figma specs without translation — 34% reduction in development time",
      "Equinox™ marketing site revamp communicating carrier value in terms of solved problems, not feature lists — 11% increase in lead conversion",
    ],
    prototypeImage: solsticeHeroImg,
    outcomes: [
      { label: "Product Launch Speed", value: "+52%", change: "Modular design system and streamlined configuration cut carrier deployment time dramatically" },
      { label: "User Errors", value: "-37%", change: "Inline validation, logical workflow sequencing, and consistent feedback states across all modules" },
      { label: "Task Completion Rate", value: "+28%", change: "Redesigned flows matched how insurance professionals actually work, eliminating abandonment" },
      { label: "Development Time", value: "-34%", change: "MUI-aligned system meant developers implemented directly — no translation between design and code" },
      { label: "Claims Processing Time", value: "-25%", change: "Workflow optimizations and automation of repetitive tasks accelerated the core value proposition" },
      { label: "Website Lead Conversion", value: "+11%", change: "Revamped site communicated carrier value through solved problems, not feature lists" },
    ],
    learnings: [
      "Designing with engineering constraints makes the system stronger, not weaker. Mirroring MUI's semantics felt limiting at first. But that constraint forced discipline — every component had to justify its existence, every deviation had to earn its complexity. The result was a system that shipped cleanly because it was designed to ship cleanly, not retrofitted after the fact.",
      "Startups don't need less design rigor — they need the right kind. At GAIG, I had a large organization with established processes. At Solstice, every design decision had to prove its value immediately. That pressure clarified my thinking. I stopped designing for theoretical best practices and started designing for the fastest path to user value.",
      "Domain expertise isn't optional in specialized industries. I could have designed a generically 'good' insurance platform using standard UX patterns. But insurance professionals can tell immediately when a designer doesn't understand their world. Working shoulder-to-shoulder with claims specialists and underwriting experts wasn't just helpful — it was the difference between a product that looked right and one that worked right.",
      "Closing the gap between teams is design work. The most impactful thing I did at Solstice wasn't a screen or a component — it was establishing the rituals and shared language that let design and engineering work as one team instead of two. That infrastructure multiplied every other design decision I made.",
    ],
    reflection:
      "This project crystallized something I'd been learning across every role: the highest-leverage design work happens before a single pixel is placed. Aligning teams, establishing shared language, building systems that respect engineering reality — that's the invisible scaffolding that determines whether a product scales or stalls. At Solstice, I got to build that scaffolding from the ground up. The -37% user error reduction and +52% launch speed are the metrics I report. But the result I'm most proud of is that when I left, Equinox™ had a design system that developers actually used, a team of designers who understood why, and a product that carriers could evaluate without needing a week of training. That's what it means to build something that outlasts you.",
    improvements: [
      "Should have established a Figma-to-MUI component sync protocol from day one. Building the Figma library and the code components in sequence created a drift window that cost rework. Parallel development with a clear source-of-truth handoff would have saved weeks.",
      "The catastrophe-mode UX needed dedicated usability testing with claims adjusters simulating surge conditions — not just standard workflow testing. High-volume edge cases have different failure modes than everyday tasks, and testing in calm conditions can miss them entirely.",
      "I should have documented the mentorship framework more formally. What I did with those three designers worked, but it was intuitive and ad-hoc. A structured curriculum with clear milestones and growth tracks would have made the model repeatable for future design leads joining the team.",
    ],
    nextProject: { slug: "healthpilot", title: "HEALTHPILOT", image: hpHeroImg },
  },
];

/* Fallback for any slug */
function getCaseStudy(slug?: string): CaseStudyData {
  return (
    CASE_STUDIES.find((cs) => cs.slug === slug) ?? CASE_STUDIES[0]
  );
}

/* ─────────────────────────────────
   Chapter Navigation
   ───────────────────────────────── */
const CHAPTERS = [
  { id: "overview", label: "Overview" },
  { id: "problem", label: "Problem" },
  { id: "context", label: "Context" },
  { id: "research", label: "Research" },
  { id: "strategy", label: "Strategy" },
  { id: "process", label: "Process" },
  { id: "wireframes", label: "Explorations" },
  { id: "design-system", label: "Design System" },
  { id: "prototype", label: "Prototype" },
  { id: "outcomes", label: "Outcomes" },
  { id: "reflection", label: "Reflection" },
];

function ChapterNav({ activeChapter, accentColor }: { activeChapter: string; accentColor: string }) {
  return (
    <nav className="fixed left-6 top-1/2 -translate-y-1/2 z-50 hidden xl:flex flex-col gap-2">
      {CHAPTERS.map((ch) => {
        const isActive = activeChapter === ch.id;
        return (
          <a
            key={ch.id}
            href={`#${ch.id}`}
            className="group flex items-center gap-3"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(ch.id)?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <motion.div
              className="w-1.5 h-1.5 rounded-full"
              animate={{
                backgroundColor: isActive ? accentColor : "rgba(107,107,118,0.3)",
                scale: isActive ? 1.3 : 1,
              }}
              transition={{ duration: 0.3 }}
            />
            <motion.span
              className="text-[8px] tracking-[0.3em] uppercase whitespace-nowrap"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
              animate={{
                color: isActive ? accentColor : "rgba(107,107,118,0.4)",
                opacity: isActive ? 1 : 0,
                x: isActive ? 0 : -8,
              }}
              transition={{ duration: 0.3 }}
            >
              {ch.label}
            </motion.span>
          </a>
        );
      })}
    </nav>
  );
}

/* ─────────────────────────────────
   Mobile Chapter Drawer
   ───────────────────────────────── */
function MobileChapterDrawer({
  activeChapter,
  accentColor,
}: {
  activeChapter: string;
  accentColor: string;
}) {
  const [open, setOpen] = useState(false);
  const activeIdx = CHAPTERS.findIndex((ch) => ch.id === activeChapter);
  const activeLbl = CHAPTERS[activeIdx]?.label ?? "";

  return (
    <>
      {/* Floating trigger — bottom-right */}
      <motion.button
        className="fixed bottom-6 right-6 z-[78] xl:hidden flex items-center gap-2.5 h-10 px-4 rounded-full border backdrop-blur-xl"
        style={{
          background: "rgba(10,10,11,0.8)",
          borderColor: `${accentColor}20`,
        }}
        onClick={() => setOpen(true)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        aria-label="Open chapter navigation"
      >
        <List size={14} style={{ color: accentColor }} />
        <span
          className="text-[9px] tracking-[0.3em] uppercase text-[#e8e6e3]/70 hidden sm:inline"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          {activeLbl}
        </span>
        <span
          className="text-[9px] tracking-[0.3em] uppercase sm:hidden"
          style={{ fontFamily: "'JetBrains Mono', monospace", color: accentColor }}
        >
          {String(activeIdx + 1).padStart(2, "0")}/{CHAPTERS.length}
        </span>
      </motion.button>

      {/* Drawer overlay */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-[88] bg-[#0a0a0b]/80 backdrop-blur-sm xl:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setOpen(false)}
            />
            <motion.nav
              className="fixed bottom-0 left-0 right-0 z-[89] xl:hidden rounded-t-2xl border-t overflow-hidden"
              style={{
                background: "rgba(10,10,11,0.97)",
                borderColor: `${accentColor}12`,
                backdropFilter: "blur(24px)",
              }}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.4, ease: EASE_SMOOTH }}
              role="dialog"
              aria-label="Chapter navigation"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.04]">
                <span
                  className="text-[10px] tracking-[0.4em] uppercase text-[#6b6b76]"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  Chapters
                </span>
                <button
                  onClick={() => setOpen(false)}
                  className="w-8 h-8 rounded-full border border-white/[0.06] flex items-center justify-center hover:border-white/[0.12] transition-colors"
                  aria-label="Close chapter navigation"
                >
                  <X size={12} className="text-[#6b6b76]" />
                </button>
              </div>

              {/* Chapter list */}
              <div className="max-h-[60vh] overflow-y-auto py-2 overscroll-contain">
                {CHAPTERS.map((ch, i) => {
                  const isActive = activeChapter === ch.id;
                  return (
                    <button
                      key={ch.id}
                      className="w-full flex items-center gap-4 px-6 py-3.5 text-left transition-colors duration-300"
                      style={{
                        background: isActive ? `${accentColor}08` : "transparent",
                      }}
                      onClick={() => {
                        document.getElementById(ch.id)?.scrollIntoView({ behavior: "smooth" });
                        setOpen(false);
                      }}
                    >
                      <span
                        className="text-[10px] tracking-[0.3em] w-5 shrink-0"
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          color: isActive ? accentColor : "#6b6b76",
                        }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className="text-[12px] tracking-[0.1em]"
                        style={{
                          fontFamily: "'Space Grotesk', sans-serif",
                          color: isActive ? "#e8e6e3" : "#6b6b76",
                        }}
                      >
                        {ch.label}
                      </span>
                      {isActive && (
                        <motion.div
                          className="ml-auto w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: accentColor }}
                          layoutId="mobile-chapter-dot"
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Safe area padding */}
              <div className="h-[env(safe-area-inset-bottom,0px)]" />
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/* ─────────────────────────────────
   Reusable Section Wrapper
   ───────────────────────────────── */
function Section({
  id,
  children,
  className = "",
  onInView,
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
  onInView?: (id: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { margin: "-40% 0px -40% 0px" });

  useEffect(() => {
    if (isInView && onInView) onInView(id);
  }, [isInView, id, onInView]);

  return (
    <section id={id} ref={ref} className={`relative ${className}`}>
      {children}
    </section>
  );
}

/* ─────────────────────────────────
   Reveal Animation Wrapper
   ───────────────────────────────── */
function Reveal({
  children,
  delay = 0,
  className = "",
  direction = "up",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  direction?: "up" | "left" | "right" | "fade";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  const variants = {
    up: { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } },
    left: { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0 } },
    right: { hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0 } },
    fade: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants[direction]}
      transition={{ duration: 0.8, delay, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────
   Immersive Image
   ───────────────────────────────── */
function ImmersiveImage({ src, alt, caption, reducedMotion = false }: { src: string; alt: string; caption?: string; reducedMotion?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reducedMotion ? [0, 0] : [40, -40]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], reducedMotion ? [1, 1, 1] : [1.08, 1, 1.04]);

  return (
    <Reveal className="my-16 md:my-24">
      <div ref={ref} className="relative overflow-hidden rounded-sm" style={{ position: "relative" }}>
        <motion.img
          src={src}
          alt={alt}
          className="w-full h-auto object-cover brightness-[0.65]"
          style={{ y, scale }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b]/60 via-transparent to-[#0a0a0b]/20" />
        <div className="absolute inset-0 border border-white/[0.04]" />
      </div>
      {caption && (
        <p
          className="mt-4 text-[10px] tracking-[0.3em] uppercase text-[#6b6b76]/60"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          {caption}
        </p>
      )}
    </Reveal>
  );
}

/* ─────────────────────────────────
   Back Button (hover-aware)
   ───────────────────────────────── */
function BackButton({ color, onClick }: { color: string; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="absolute top-6 left-6 md:top-10 md:left-12 z-30 flex items-center gap-3"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5, duration: 0.6 }}
    >
      <div
        className="w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-500"
        style={{
          borderColor: hovered ? `${color}66` : "rgba(255,255,255,0.1)",
          backgroundColor: hovered ? `${color}0d` : "transparent",
        }}
      >
        <ArrowLeft size={16} style={{ color: hovered ? color : "#6b6b76" }} className="transition-colors duration-300" />
      </div>
      <span
        className="text-[10px] tracking-[0.3em] uppercase transition-colors duration-500 hidden md:block"
        style={{ fontFamily: "'JetBrains Mono', monospace", color: hovered ? color : "#6b6b76" }}
      >
        All Projects
      </span>
    </motion.button>
  );
}

/* ─────────────────────────────────
   Chapter Label
   ───────────────────────────────── */
function ChapterLabel({ number, title, accentColor = "#c4ff00" }: { number: string; title: string; accentColor?: string }) {
  return (
    <Reveal className="flex items-center gap-4 mb-8 md:mb-12">
      <span
        className="text-[10px] tracking-[0.5em] uppercase"
        style={{ fontFamily: "'JetBrains Mono', monospace", color: `${accentColor}80` }}
      >
        {number}
      </span>
      <div className="w-8 h-px" style={{ backgroundColor: `${accentColor}30` }} />
      <span
        className="text-[10px] tracking-[0.5em] uppercase text-[#6b6b76]"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      >
        {title}
      </span>
    </Reveal>
  );
}

/* ─────────────────────────────────
   Reading Time Estimate
   ───────────────────────────────── */
function estimateReadingTime(cs: CaseStudyData): number {
  const text = [
    cs.problem, cs.context, cs.strategy, cs.reflection,
    ...cs.constraints, ...cs.learnings, ...cs.improvements,
    ...cs.researchInsights.map(r => r.title + r.detail),
    ...cs.strategyPillars.map(p => p.title + p.description),
    ...cs.processSteps.map(s => s.title + s.description),
    ...cs.designSystem.map(d => d.label + d.description),
    ...cs.prototypeHighlights,
  ].join(" ");
  const wordCount = text.split(/\s+/).length;
  return Math.max(4, Math.ceil(wordCount / 200));
}

/* ─────────────────────────────────
   Main Case Study Page
   ───────────────────────────────── */
export function CaseStudyPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const cs = getCaseStudy(slug);
  const pageRef = useRef<HTMLDivElement>(null);
  const [activeChapter, setActiveChapter] = useState("overview");
  const activeChapterRef = useRef(activeChapter);
  activeChapterRef.current = activeChapter;

  const handleChapterChange = useCallback((id: string) => {
    setActiveChapter(id);
  }, []);

  const isMobile = useIsMobile();
  const reducedMotion = useReducedMotion();

  /* Scroll to top on mount */
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  /* ── Keyboard shortcuts ── */
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Don't intercept if user is typing
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;

      const current = activeChapterRef.current;
      const idx = CHAPTERS.findIndex((ch) => ch.id === current);

      if (e.key === "j" || e.key === "ArrowDown") {
        // Next chapter
        if (idx < CHAPTERS.length - 1) {
          e.preventDefault();
          const nextId = CHAPTERS[idx + 1].id;
          setActiveChapter(nextId);
          document.getElementById(nextId)?.scrollIntoView({ behavior: "smooth" });
        }
      } else if (e.key === "k" || e.key === "ArrowUp") {
        // Previous chapter
        if (idx > 0) {
          e.preventDefault();
          const prevId = CHAPTERS[idx - 1].id;
          setActiveChapter(prevId);
          document.getElementById(prevId)?.scrollIntoView({ behavior: "smooth" });
        }
      } else if (e.key === "Escape") {
        // Back to top
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (e.key >= "1" && e.key <= "9") {
        // Jump to chapter by number
        const num = parseInt(e.key, 10) - 1;
        if (num < CHAPTERS.length) {
          e.preventDefault();
          setActiveChapter(CHAPTERS[num].id);
          document.getElementById(CHAPTERS[num].id)?.scrollIntoView({ behavior: "smooth" });
        }
      } else if (e.key === "0") {
        // 0 => chapter 10
        if (CHAPTERS.length >= 10) {
          e.preventDefault();
          setActiveChapter(CHAPTERS[9].id);
          document.getElementById(CHAPTERS[9].id)?.scrollIntoView({ behavior: "smooth" });
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  /* Hero parallax — reduced on mobile */
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroImgY = useTransform(heroProgress, [0, 1], [0, isMobile ? -80 : -200]);
  const heroImgScale = useTransform(heroProgress, [0, 1], [1.1, isMobile ? 1.15 : 1.25]);
  const heroOpacity = useTransform(heroProgress, [0, 0.6], [1, 0]);
  const heroTextY = useTransform(heroProgress, [0, 1], [0, isMobile ? -40 : -100]);

  return (
    <div
      ref={pageRef}
      className="w-full min-h-screen bg-[#0a0a0b] text-[#e8e6e3] overflow-x-hidden relative"
      style={{ fontFamily: "'Space Grotesk', sans-serif", position: "relative" }}
    >
      {/* Grain */}
      <div className="grain-overlay" />

      {/* FloatingNav handles global scroll progress bar */}
      <ChapterNav activeChapter={activeChapter} accentColor={cs.color} />
      <MobileChapterDrawer activeChapter={activeChapter} accentColor={cs.color} />

      {/* ═══════════════════════════════════════
         1. HERO BANNER
         ═══════════════════════════════════════ */}
      <section ref={heroRef} className="relative h-[85vh] md:h-screen overflow-hidden" style={{ position: "relative" }}>
        <motion.div className="absolute inset-0" style={{ y: heroImgY, scale: heroImgScale }}>
          <img src={cs.heroImage} alt={cs.title} className="w-full h-full object-cover brightness-[0.3]" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0b]/40 via-transparent to-[#0a0a0b]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0b]/60 via-transparent to-[#0a0a0b]/40" />

        {/* Back button */}
        <BackButton color={cs.color} onClick={() => navigate("/")} />

        {/* Hero content */}
        <motion.div
          style={{ y: heroTextY, opacity: heroOpacity }}
          className="relative z-20 h-full flex flex-col justify-end px-6 md:px-12 lg:px-24 pb-16 md:pb-24"
        >
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-[10px] tracking-[0.5em] uppercase mb-6"
            style={{ fontFamily: "'JetBrains Mono', monospace", color: cs.color }}
          >
            {cs.client} — {cs.year}
          </motion.span>

          <div className="overflow-hidden">
            <motion.h1
              initial={{ y: 150 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.15, duration: 1.1, ease: EASE_OUT }}
              className="text-[clamp(2.5rem,9vw,7rem)] leading-[0.85] tracking-[-0.04em]"
              style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800 }}
            >
              {cs.title}
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mt-4 text-[clamp(1rem,2vw,1.4rem)] text-[#e8e6e3]/50 max-w-xl"
            style={{ fontFamily: "'Syne', sans-serif", fontWeight: 400 }}
          >
            {cs.subtitle}
          </motion.p>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-8 right-6 md:right-12 flex flex-col items-center gap-2"
          >
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChevronDown size={16} className="text-[#6b6b76]/50" />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══���═══════════════════════════════════
         2. OVERVIEW
         ═════════════════���═════════════════════ */}
      <Section id="overview" className="px-6 md:px-12 lg:px-24 py-20 md:py-32" onInView={handleChapterChange}>
        <ChapterLabel number="01" title="Overview" accentColor={cs.color} />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 md:gap-12">
          {[
            { label: "Role", value: cs.role },
            { label: "Timeline", value: cs.timeline },
            { label: "Team", value: cs.team },
            { label: "Platform", value: cs.platform },
            { label: "Tools", value: cs.tools.join(", ") },
            { label: "Read Time", value: `${estimateReadingTime(cs)} min` },
          ].map((item, i) => (
            <Reveal key={item.label} delay={i * 0.08}>
              <div className="border-t border-white/[0.06] pt-5">
                <span
                  className="block text-[9px] tracking-[0.4em] uppercase text-[#6b6b76]/60 mb-2"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {item.label}
                </span>
                <span
                  className="text-[13px] tracking-[0.05em] text-[#e8e6e3]/80"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {item.value}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ═══════════════════════════════════════
         3. PROBLEM
         ═══════════════════════════════════════ */}
      <Section id="problem" className="px-6 md:px-12 lg:px-24 py-20 md:py-32" onInView={handleChapterChange}>
        <ChapterLabel number="02" title="Problem Statement" accentColor={cs.color} />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <Reveal className="lg:col-span-2">
            <h2
              className="text-[clamp(2rem,5vw,4rem)] leading-[0.9] tracking-[-0.03em]"
              style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 800,
                WebkitTextStroke: `1px ${cs.color}30`,
                color: "transparent",
              }}
            >
              THE
              <br />
              GAP
            </h2>
          </Reveal>
          <Reveal className="lg:col-span-7 lg:col-start-4" delay={0.15}>
            <p
              className="text-[clamp(1rem,1.8vw,1.3rem)] leading-[1.8] text-[#8a8a96]"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {cs.problem}
            </p>
          </Reveal>
        </div>
      </Section>

      {/* ═══════════════════════════════════════
         4. CONTEXT & CONSTRAINTS
         ═══════════════════════════════════════ */}
      <Section id="context" className="px-6 md:px-12 lg:px-24 py-20 md:py-32" onInView={handleChapterChange}>
        <ChapterLabel number="03" title="Context & Constraints" accentColor={cs.color} />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <Reveal className="lg:col-span-6">
            <p
              className="text-[15px] leading-[1.8] text-[#8a8a96] mb-10"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {cs.context}
            </p>
          </Reveal>
          <div className="lg:col-span-5 lg:col-start-8">
            <Reveal delay={0.1}>
              <div className="border border-white/[0.05] p-6 md:p-8">
                <span
                  className="block text-[10px] tracking-[0.4em] uppercase mb-6"
                  style={{ fontFamily: "'JetBrains Mono', monospace", color: cs.color }}
                >
                  Constraints
                </span>
                <div className="space-y-4">
                  {cs.constraints.map((c, i) => (
                    <Reveal key={i} delay={0.15 + i * 0.06}>
                      <div className="flex gap-3 items-start">
                        <div className="w-1 h-1 rounded-full mt-2 shrink-0" style={{ backgroundColor: `${cs.color}50` }} />
                        <p
                          className="text-[13px] leading-[1.6] text-[#6b6b76]"
                          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                        >
                          {c}
                        </p>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════
         5. RESEARCH INSIGHTS
         ═══════════════════════════════════════ */}
      <Section id="research" className="px-6 md:px-12 lg:px-24 py-20 md:py-32" onInView={handleChapterChange}>
        <ChapterLabel number="04" title="Research Insights" accentColor={cs.color} />
        <ImmersiveImage
          src={cs.researchImage || "https://images.unsplash.com/photo-1693044216415-e2c1d759ed62?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1c2VyJTIwcmVzZWFyY2glMjBpbnRlcnZpZXclMjBzZXNzaW9uJTIwb2ZmaWNlfGVufDF8fHx8MTc3MzQxMDYwNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"}
          alt="Research sessions"
          caption="12 user interviews conducted over 3 weeks"
          reducedMotion={isMobile || reducedMotion}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {cs.researchInsights.map((insight, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <motion.div
                className="group border border-white/[0.04] p-6 md:p-8 hover:border-white/[0.08] transition-colors duration-500 relative overflow-hidden"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="absolute top-0 left-0 w-full h-px"
                  style={{ backgroundColor: `${cs.color}30` }}
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.5 }}
                />
                <span
                  className="block text-[9px] tracking-[0.4em] uppercase mb-3"
                  style={{ fontFamily: "'JetBrains Mono', monospace", color: `${cs.color}70` }}
                >
                  Insight {String(i + 1).padStart(2, "0")}
                </span>
                <h4
                  className="text-[clamp(1rem,1.6vw,1.2rem)] leading-[1.3] tracking-[-0.01em] text-[#e8e6e3] mb-3"
                  style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600 }}
                >
                  {insight.title}
                </h4>
                <p
                  className="text-[13px] leading-[1.7] text-[#6b6b76]"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {insight.detail}
                </p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ═══════════════════════════════════════
         6. STRATEGY
         ═══════════════════════════════════════ */}
      <Section id="strategy" className="px-6 md:px-12 lg:px-24 py-20 md:py-32" onInView={handleChapterChange}>
        <ChapterLabel number="05" title="Product Strategy" accentColor={cs.color} />
        <Reveal>
          <p
            className="text-[clamp(1.1rem,2.2vw,1.6rem)] leading-[1.6] text-[#e8e6e3]/80 max-w-4xl mb-16"
            style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 300 }}
          >
            {cs.strategy}
          </p>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {cs.strategyPillars.map((pillar, i) => (
            <Reveal key={i} delay={i * 0.12}>
              <div className="relative border-t pt-6" style={{ borderColor: `${cs.color}15` }}>
                <span
                  className="absolute -top-3 left-0 bg-[#0a0a0b] px-2 text-[9px] tracking-[0.4em] uppercase"
                  style={{ fontFamily: "'JetBrains Mono', monospace", color: cs.color }}
                >
                  Pillar {String(i + 1).padStart(2, "0")}
                </span>
                <h4
                  className="text-[clamp(1rem,1.5vw,1.15rem)] leading-[1.2] tracking-[-0.01em] text-[#e8e6e3] mb-3 mt-2"
                  style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }}
                >
                  {pillar.title}
                </h4>
                <p
                  className="text-[13px] leading-[1.7] text-[#6b6b76]"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {pillar.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ═══════════════════════════════════════
         7. PROCESS
         ═══════════════════════════════════════ */}
      <Section id="process" className="px-6 md:px-12 lg:px-24 py-20 md:py-32" onInView={handleChapterChange}>
        <ChapterLabel number="06" title="UX Process" accentColor={cs.color} />
        {cs.processImage && (
          <ImmersiveImage
            src={cs.processImage}
            alt="Design process overview"
            caption="Design sprint timeline and methodology"
            reducedMotion={isMobile || reducedMotion}
          />
        )}
        <div className="relative mt-12">
          {/* Timeline line */}
          <div className="absolute left-0 md:left-3 top-0 bottom-0 w-px bg-white/[0.04] hidden md:block">
            <ProcessLine color={cs.color} />
          </div>
          <div className="space-y-0">
            {cs.processSteps.map((step, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 py-8 md:py-12 border-b border-white/[0.03] group"
                  style={{ borderLeft: isMobile ? `1px solid ${cs.color}15` : undefined, paddingLeft: isMobile ? "1rem" : undefined }}
                >
                  <div className="md:col-span-1 flex items-start">
                    <div className="relative">
                      <div className="w-2 h-2 rounded-full border hidden md:block" style={{ borderColor: `${cs.color}40` }}>
                        <div className="absolute inset-0.5 rounded-full group-hover:scale-100 scale-0 transition-transform duration-500" style={{ backgroundColor: cs.color }} />
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-3">
                    <span
                      className="text-[10px] tracking-[0.3em] uppercase block mb-1"
                      style={{ fontFamily: "'JetBrains Mono', monospace", color: `${cs.color}60` }}
                    >
                      Phase {String(i + 1).padStart(2, "0")}
                    </span>
                    <h4
                      className="text-[clamp(0.95rem,1.3vw,1.1rem)] tracking-[-0.01em] text-[#e8e6e3]"
                      style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600 }}
                    >
                      {step.title}
                    </h4>
                  </div>
                  <div className="md:col-span-7 md:col-start-6">
                    <p
                      className="text-[13px] leading-[1.7] text-[#6b6b76]"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      {step.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
        {cs.journeyImage && (
          <ImmersiveImage
            src={cs.journeyImage}
            alt="Customer journey map"
            caption="Customer journey map — emotional states across the full experience"
            reducedMotion={isMobile || reducedMotion}
          />
        )}
      </Section>

      {/* ═══════════════════════════════════════
         8. WIREFRAMES
         ═══════════════════════════════════════ */}
      <Section id="wireframes" className="px-6 md:px-12 lg:px-24 py-20 md:py-32" onInView={handleChapterChange}>
        <ChapterLabel number="07" title="Wireframes & Explorations" accentColor={cs.color} />
        <ImmersiveImage src={cs.wireframeImage} alt="Wireframes and early explorations" caption="Early sketches and wireframe explorations" reducedMotion={isMobile || reducedMotion} />
      </Section>

      {/* ═══════════════════════════════════════
         9. DESIGN SYSTEM
         ═══════════════════════════════════════ */}
      <Section id="design-system" className="px-6 md:px-12 lg:px-24 py-20 md:py-32" onInView={handleChapterChange}>
        <ChapterLabel number="08" title="Design System" accentColor={cs.color} />
        <ImmersiveImage src={cs.designSystemImage} alt="Design system" caption="Component library — 120+ components with dark/light modes" reducedMotion={isMobile || reducedMotion} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 mt-12">
          {cs.designSystem.map((token, i) => (
            <Reveal key={i} delay={i * 0.06}>
              <div className="border border-white/[0.04] p-5 hover:border-white/[0.08] transition-colors duration-500">
                <span
                  className="block text-[9px] tracking-[0.4em] uppercase mb-2"
                  style={{ fontFamily: "'JetBrains Mono', monospace", color: cs.color }}
                >
                  {token.label}
                </span>
                <p
                  className="text-[12px] leading-[1.6] text-[#6b6b76]"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {token.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ══════════════��════════════════════════
         10. PROTOTYPE
         ═══════════════════════════════════════ */}
      <Section id="prototype" className="px-6 md:px-12 lg:px-24 py-20 md:py-32" onInView={handleChapterChange}>
        <ChapterLabel number="09" title="Prototype & Interaction Highlights" accentColor={cs.color} />
        <ImmersiveImage src={cs.prototypeImage} alt="Prototype" caption="High-fidelity prototype — Framer + Principle" reducedMotion={isMobile || reducedMotion} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12">
          {cs.prototypeHighlights.map((highlight, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div className="flex items-start gap-4 p-5 border border-white/[0.04] hover:border-white/[0.08] transition-colors duration-500">
                <motion.div
                  className="w-6 h-6 rounded-full border flex items-center justify-center shrink-0 mt-0.5"
                  style={{ borderColor: `${cs.color}30` }}
                >
                  <span className="text-[9px]" style={{ fontFamily: "'JetBrains Mono', monospace", color: cs.color }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </motion.div>
                <p
                  className="text-[13px] leading-[1.6] text-[#8a8a96]"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {highlight}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ═══════════════════════════════════════
         11. OUTCOMES
         ═══════════════════════════════════════ */}
      <Section id="outcomes" className="px-6 md:px-12 lg:px-24 py-20 md:py-32" onInView={handleChapterChange}>
        <ChapterLabel number="10" title="Outcomes & Impact" accentColor={cs.color} />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-16">
          {cs.outcomes.map((o, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <motion.div
                className="border border-white/[0.04] p-6 md:p-8 relative overflow-hidden group"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-px"
                  style={{ backgroundColor: cs.color }}
                  initial={{ scaleX: 0, originX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.8, ease: EASE_SMOOTH }}
                />
                <span
                  className="block text-[clamp(1.8rem,4vw,3rem)] tracking-[-0.03em] mb-2"
                  style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, color: cs.color }}
                >
                  {o.value}
                </span>
                <span
                  className="block text-[11px] tracking-[0.1em] text-[#e8e6e3]/70 mb-1"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {o.label}
                </span>
                <span
                  className="block text-[10px] tracking-[0.15em] text-[#6b6b76]/60"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {o.change}
                </span>
              </motion.div>
            </Reveal>
          ))}
        </div>

        {/* Learnings */}
        <Reveal delay={0.2}>
          <div className="border-t border-white/[0.05] pt-12">
            <span
              className="block text-[10px] tracking-[0.4em] uppercase mb-8"
              style={{ fontFamily: "'JetBrains Mono', monospace", color: `${cs.color}80` }}
            >
              Key Learnings
            </span>
            <div className="space-y-6 max-w-3xl">
              {cs.learnings.map((learning, i) => (
                <Reveal key={i} delay={0.1 + i * 0.1}>
                  <div className="flex gap-4 items-start">
                    <div className="w-px h-full min-h-[20px] shrink-0" style={{ backgroundColor: `${cs.color}30` }} />
                    <p
                      className="text-[14px] leading-[1.7] text-[#8a8a96]"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      {learning}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Reveal>
      </Section>

      {/* ═══════════════════════════════════════
         12. REFLECTION
         ═══════════════════════════════════════ */}
      <Section id="reflection" className="px-6 md:px-12 lg:px-24 py-20 md:py-32" onInView={handleChapterChange}>
        <ChapterLabel number="11" title="Reflection" accentColor={cs.color} />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <Reveal className="lg:col-span-7">
            <p
              className="text-[clamp(1rem,1.6vw,1.2rem)] leading-[1.8] text-[#8a8a96] mb-12"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {cs.reflection}
            </p>
          </Reveal>
          <Reveal className="lg:col-span-4 lg:col-start-9" delay={0.15}>
            <div className="border border-white/[0.05] p-6 md:p-8">
              <span
                className="block text-[10px] tracking-[0.4em] uppercase mb-6"
                style={{ fontFamily: "'JetBrains Mono', monospace", color: cs.color }}
              >
                What I'd Improve
              </span>
              <div className="space-y-5">
                {cs.improvements.map((imp, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="w-1 h-1 rounded-full mt-2 shrink-0" style={{ backgroundColor: `${cs.color}50` }} />
                    <p
                      className="text-[12px] leading-[1.6] text-[#6b6b76]"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      {imp}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ═══════════════════════════════════════
         NEXT PROJECT CTA
         ═══════════════════════════════════════ */}
      <section className="relative border-t border-white/[0.04]">
        <motion.a
          href={`/case-study/${cs.nextProject.slug}`}
          onClick={(e) => {
            e.preventDefault();
            navigate(`/case-study/${cs.nextProject.slug}`);
          }}
          className="group block px-6 md:px-12 lg:px-24 py-24 md:py-40 relative overflow-hidden"
          whileHover="hover"
        >
          {/* Background image preview — reveals on hover */}
          <motion.div
            className="absolute inset-0 z-0 pointer-events-none"
            initial={{ opacity: 0, scale: 1.15 }}
            variants={{ hover: { opacity: 1, scale: 1.05 } }}
            transition={{ duration: 0.8, ease: EASE_SMOOTH }}
          >
            <img
              src={cs.nextProject.image}
              alt=""
              className="w-full h-full object-cover brightness-[0.15]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0b]/90 via-[#0a0a0b]/60 to-[#0a0a0b]/80" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b] via-transparent to-[#0a0a0b]/40" />
          </motion.div>

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
            <div className="flex-1">
              <span
                className="text-[10px] tracking-[0.5em] uppercase text-[#6b6b76] block mb-4"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                Next Project
              </span>
              <div className="overflow-hidden">
                <motion.h2
                  className="text-[clamp(2.5rem,8vw,6rem)] leading-[0.85] tracking-[-0.04em] text-[#e8e6e3]"
                  style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800 }}
                  variants={{ hover: { x: 20 } }}
                  transition={{ duration: 0.5, ease: EASE_OUT }}
                >
                  {cs.nextProject.title}
                </motion.h2>
              </div>
            </div>

            {/* Floating image preview — visible on larger screens */}
            <motion.div
              className="hidden lg:block w-[280px] h-[180px] rounded-sm overflow-hidden border border-white/[0.06] relative shrink-0"
              variants={{ hover: { y: -8, scale: 1.02 } }}
              transition={{ duration: 0.5, ease: EASE_OUT }}
            >
              <img
                src={cs.nextProject.image}
                alt={cs.nextProject.title}
                className="w-full h-full object-cover brightness-[0.5] group-hover:brightness-[0.7] transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b]/60 to-transparent" />
              <div className="absolute inset-0 border border-white/[0.04]" />
            </motion.div>

            <motion.div
              className="w-16 h-16 md:w-20 md:h-20 rounded-full border flex items-center justify-center transition-all duration-500 shrink-0 lg:hidden"
              style={{ borderColor: "rgba(255,255,255,0.1)" }}
              variants={{ hover: { scale: 1.1, borderColor: `${cs.color}66`, backgroundColor: `${cs.color}0d` } }}
              transition={{ duration: 0.3 }}
            >
              <motion.div variants={{ hover: { color: cs.color } }} initial={{ color: "#6b6b76" }} transition={{ duration: 0.3 }}>
                <ArrowUpRight size={24} />
              </motion.div>
            </motion.div>
          </div>
          <motion.div
            className="relative z-10 mt-8 h-px"
            style={{ background: `linear-gradient(to right, ${cs.color}4d, transparent)` }}
            initial={{ scaleX: 0, originX: 0 }}
            variants={{ hover: { scaleX: 1 } }}
            transition={{ duration: 0.6, ease: EASE_SMOOTH }}
          />
        </motion.a>
      </section>

      {/* Footer */}
      <div className="px-6 md:px-12 lg:px-24 py-8 border-t border-white/[0.03]">
        <div className="flex items-center justify-between">
          <FooterLink onClick={() => navigate("/")} label="\u2190 Back to Portfolio" color={cs.color} />
          <FooterLink onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} label="Back to Top \u2191" color={cs.color} />
        </div>
        {/* Keyboard shortcuts hint — desktop only */}
        <div className="hidden md:flex items-center justify-center gap-6 mt-6 pt-4 border-t border-white/[0.02]">
          {[
            { keys: "J / K", desc: "Next / Prev chapter" },
            { keys: "1-9", desc: "Jump to chapter" },
            { keys: "Esc", desc: "Back to top" },
          ].map((hint) => (
            <div key={hint.keys} className="flex items-center gap-2">
              <kbd
                className="px-1.5 py-0.5 border border-white/[0.06] rounded text-[8px] tracking-[0.1em]"
                style={{ fontFamily: "'JetBrains Mono', monospace", color: "#6b6b76" }}
              >
                {hint.keys}
              </kbd>
              <span
                className="text-[8px] tracking-[0.2em] uppercase text-[#6b6b76]/40"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                {hint.desc}
              </span>
            </div>
          ))}
        </div>
      </div>

      <CustomCursor />
      <FloatingNav />
    </div>
  );
}

/* ────────────────────────────────
   Process Line (scroll-animated)
   ───────────────────────────────── */
function ProcessLine({ color = "#c4ff00" }: { color?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const height = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <motion.div
      ref={ref}
      className="w-full origin-top relative"
      style={{ height, backgroundColor: `${color}40`, position: "relative" }}
    />
  );
}

/* ─────────────────────────────────
   Footer Link (hover-aware)
   ───────────────────────────────── */
function FooterLink({ onClick, label, color }: { onClick: () => void; label: string; color: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="text-[10px] tracking-[0.3em] uppercase transition-colors duration-500"
      style={{ fontFamily: "'JetBrains Mono', monospace", color: hovered ? color : "#6b6b76" }}
    >
      {label}
    </button>
  );
}
