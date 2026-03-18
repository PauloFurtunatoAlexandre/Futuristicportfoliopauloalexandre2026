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
import healthpilotImg from "figma:asset/e4a5a5199e012811840cc269dafae9f17eab509a.png";
import { CustomCursor } from "./CustomCursor";
import { FloatingNav } from "./FloatingNav";
import { useIsMobile, useReducedMotion } from "./ui/useMediaQuery";
import { BeforeAfterSlider } from "./BeforeAfterSlider";

/* ─────────────────────────────────
   Easing tokens
   ───────────────────────────────── */
const EASE_OUT = [0.25, 0.46, 0.45, 0.94] as const;
const EASE_SMOOTH = [0.43, 0.13, 0.23, 0.96] as const;

/* ─────────────────────────────────
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
  strategy: string;
  strategyPillars: { title: string; description: string }[];
  processSteps: { title: string; description: string }[];
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
    slug: "meridian",
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
    heroImage: healthpilotImg,
    problem:
      "Seniors were abandoning HealthPilot's Medicare enrollment mid-flow — frustrated, confused, and distrustful of their own decisions. The platform read like an insurance manual, not a tool built for the people who needed it most. Drop-offs were bleeding the business, and every lost user was someone left navigating healthcare alone.",
    context:
      "HealthPilot simplifies Medicare plan selection for seniors — a demographic drowning in jargon, fine print, and paralyzing choice overload. The product team flagged high abandonment, but nobody had asked users why. I took the initiative to dig beneath the analytics, conducting interviews and usability tests to find the human story behind the numbers. What I found: people weren't confused by Medicare — they were confused by us.",
    constraints: [
      "Medicare compliance requirements — every data point and disclaimer legally mandated",
      "Users skew 65+ with varying digital literacy — no room for assumed tech fluency",
      "Complex insurance terminology that must remain accurate while becoming accessible",
      "Four-month deadline for V1 — speed without sacrificing quality",
      "Must support the full enrollment funnel from discovery to plan selection to sign-up",
    ],
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
    wireframeImage:
      "https://images.unsplash.com/photo-1615387000571-bdcfe92eb67c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlZnJhbWUlMjBwcm90b3R5cGUlMjBza2V0Y2glMjBVWCUyMGRlc2lnbiUyMHByb2Nlc3N8ZW58MXx8fHwxNzczODAwNjgxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    designSystem: [
      { label: "Typography", description: "Clear, high-contrast type scale optimized for 65+ readability — generous sizing, tight hierarchy" },
      { label: "Color", description: "Accessible palette meeting WCAG AAA. Trust-first blues and greens, warm neutrals for comfort" },
      { label: "Components", description: "Plan cards, comparison tables, progress indicators, contextual tip modules — all senior-friendly tap targets" },
      { label: "Language", description: "Full terminology glossary co-authored with SMEs — every insurance term has a plain-English equivalent" },
      { label: "Patterns", description: "Reusable enrollment step templates, error recovery flows, and decision-support layouts" },
    ],
    designSystemImage:
      "https://images.unsplash.com/photo-1720962158937-7ea890052166?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ24lMjBzeXN0ZW0lMjBjb21wb25lbnRzJTIwVUklMjBraXQlMjBkYXJrJTIwaW50ZXJmYWNlfGVufDF8fHx8MTc3MzgwMDY3N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    prototypeHighlights: [
      "Step-by-step enrollment flow with progress indicators and contextual micro-copy explaining every data request",
      "Side-by-side plan comparison with plain-language pros, cons, and cost breakdowns",
      "Contextual tooltips translating insurance jargon into human language on hover/tap",
      "Decision-confidence scoring that helps users feel certain about their final plan choice",
    ],
    prototypeImage:
      "https://images.unsplash.com/photo-1592323401640-9c24ed330baf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGhjYXJlJTIwYXBwJTIwbW9iaWxlJTIwaW50ZXJmYWNlJTIwY2xlYW58ZW58MXx8fHwxNzczODAwNjgxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
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
    nextProject: { slug: "void", title: "VOID", image: "https://images.unsplash.com/photo-1562672421-94d4c2aaabe5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aXJ0dWFsJTIwcmVhbGl0eSUyMG1peGVkJTIwcmVhbGl0eSUyMGRhcmslMjBzdHVkaW98ZW58MXx8fHwxNzczNDEwMTQyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
  },
  {
    slug: "void",
    title: "VOID",
    subtitle: "Designing for the body, not the screen",
    client: "VOID Technologies",
    year: "2025",
    role: "Creative Director",
    timeline: "10 months",
    team: "3 designers, 6 engineers, 1 PM, 1 researcher",
    platform: "visionOS, Quest, Web Companion",
    tools: ["Figma", "Unity", "Blender", "Principle", "ProtoPie"],
    color: "#ff6b35",
    heroImage: "https://images.unsplash.com/photo-1562672421-94d4c2aaabe5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aXJ0dWFsJTIwcmVhbGl0eSUyMG1peGVkJTIwcmVhbGl0eSUyMGRhcmslMjBzdHVkaW98ZW58MXx8fHwxNzczNDEwMTQyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    problem: "VOID's spatial computing tools had sub-60% task completion and session fatigue after just 12 minutes. The root cause: 2D paradigms extruded into 3D space. Users were fighting the interaction model instead of working with it.",
    context: "VOID builds volumetric data manipulation tools for architects and 3D artists. Powerful but unusable for sustained work — the 2-hour deep sessions their users actually need. I was brought in to rethink the entire interaction paradigm from first principles, not reskin the existing UI.",
    constraints: ["Must work across visionOS (hand tracking) and Quest (controllers) with different input methods", "Gesture recognition limited to ~85% accuracy in production environments", "No persistent menus or traditional UI chrome — spatial context is the only navigation", "Must support 2+ hour sessions without physical fatigue", "Strict 90fps performance floor — dropped frames break spatial presence"],
    researchInsights: [
      { title: "Hands want to rest", detail: "Arm fatigue set in after 8 minutes of sustained gesture input. Any interaction model that ignores gravity will fail. We needed passive states and resting positions baked into the core design." },
      { title: "Peripheral vision is navigation", detail: "Users naturally glanced at peripheral elements before engaging. Spatial cues at vision edges outperformed central UI elements for wayfinding." },
      { title: "Sound replaces pixels", detail: "In spatial contexts, subtle audio cues confirmed actions 3× more effectively than visual feedback alone. Sound became our primary confirmation layer." },
      { title: "Proximity beats fixed position", detail: "Users wanted tools near the content they were manipulating, not anchored in fixed locations. Context-aware proximity UI outperformed every toolbar pattern we tested." },
    ],
    strategy: "A gesture-first interaction model treating the body as the primary input device. Instead of asking users to navigate to tools, tools navigate to users — surfacing contextually near active content with spatial audio and haptic confirmation replacing visual chrome.",
    strategyPillars: [
      { title: "Embodied Interaction", description: "Every action maps to a natural physical gesture — pinch to select, push to dismiss, pull to inspect. No learned abstractions." },
      { title: "Ambient Intelligence", description: "The interface anticipates needs based on task context. Tools surface near active content without explicit invocation." },
      { title: "Multi-Sensory Feedback", description: "Spatial audio, haptic pulses, and minimal visual cues combine for rich confirmation without visual clutter or attention competition." },
    ],
    processSteps: [
      { title: "Embodied Research", description: "100+ hours of observation in VR/AR environments. Mapped natural gesture vocabularies across 24 users to establish what feels intuitive before designing anything." },
      { title: "Gesture Grammar", description: "Developed a formal gesture language — 12 core interactions, each tested for ergonomic comfort, learnability, and cross-platform viability." },
      { title: "Spatial Prototyping", description: "Built interactive prototypes in Unity with real hand-tracking. Measured gesture accuracy, cognitive load, and time-to-action in controlled sessions." },
      { title: "Multi-Modal Design", description: "Designed audio and haptic feedback layers synchronized with visual transitions. Each modality carries distinct information so nothing is redundant." },
      { title: "Endurance Testing", description: "Ran 2-hour session tests to identify fatigue patterns. Redesigned rest states and introduced passive interaction modes that reduced required arm elevation by 60%." },
      { title: "Cross-Platform Adaptation", description: "Built separate interaction profiles for hand-tracking and controller input, sharing the same conceptual model but optimized for each input method's strengths." },
    ],
    wireframeImage: "https://images.unsplash.com/photo-1683225831293-6d289c20e963?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kJTIwZ2VzdHVyZSUyMGludGVyYWN0aW9uJTIwdG91Y2hsZXNzJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NzM0MjU0MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    designSystem: [
      { label: "Spatial Grid", description: "Volumetric 3D grid system with depth-aware spacing tokens for consistent layering" },
      { label: "Gesture Library", description: "12 core gestures with ergonomic guidelines, fallback inputs, and accessibility alternatives" },
      { label: "Audio Tokens", description: "48 spatial audio cues categorized by proximity, confirmation, error, and ambient context" },
      { label: "Motion", description: "Physics-based springs for all spatial transitions, tuned to 90fps performance budget" },
      { label: "Adaptive Density", description: "UI density scales dynamically based on viewing distance and task urgency" },
    ],
    designSystemImage: "https://images.unsplash.com/photo-1683821291889-3ad254f02e22?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxWUiUyMGhlYWRzZXQlMjBzcGF0aWFsJTIwY29tcHV0aW5nJTIwcHJvdG90eXBlJTIwbGFifGVufDF8fHx8MTc3MzQyNTQyN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    prototypeHighlights: ["Gesture-first volumetric object manipulation with physics-based response curves", "Proximity-aware contextual toolbars that orbit active content without explicit invocation", "Spatial audio layer providing interaction confirmation without visual noise", "Adaptive rest states that reduce required arm elevation by 60% during sustained sessions"],
    prototypeImage: "https://images.unsplash.com/photo-1687389806477-22be64a5480f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHwzRCUyMGhvbG9ncmFwaGljJTIwaW50ZXJmYWNlJTIwZnV0dXJpc3RpYyUyMGRpc3BsYXl8ZW58MXx8fHwxNzczNDI1NDI4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    outcomes: [
      { label: "Task Completion", value: "94%", change: "Up from 58%" },
      { label: "Gesture Accuracy", value: "+41%", change: "With new interaction model" },
      { label: "Session Duration", value: "47min", change: "Up from 12 min avg" },
      { label: "User Satisfaction", value: "4.8/5", change: "Post-launch survey" },
      { label: "Arm Fatigue Reports", value: "-73%", change: "With adaptive rest states" },
      { label: "Industry Recognition", value: "3 Awards", change: "Including IXDA Spatial" },
    ],
    learnings: ["Spatial design requires abandoning most 2D UI assumptions. Real-world physics and the human body are better design references than any screen-based pattern library.", "Ergonomics isn't a nice-to-have — it's a core design constraint that shapes every interaction decision.", "Multi-sensory design is exponentially more complex to coordinate, but the payoff in user confidence and task completion is transformative."],
    reflection: "The most challenging project of my career — it required unlearning everything I knew about interface design. The breakthrough came when we stopped making 3D versions of 2D interfaces and started designing around the body as the input device. The best spatial interface is one you forget exists.",
    improvements: ["Should have invested more in accessibility for users with limited hand mobility — gesture-first doesn't mean gesture-only.", "Cross-platform adaptation was compressed — each input method deserved its own dedicated design sprint, not a shared one.", "Audio design needed to adapt to ambient environment noise levels, which we only partially solved."],
    nextProject: { slug: "aether", title: "AETHER", image: "https://images.unsplash.com/photo-1764866127860-1da95e9c74a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZW9uJTIwYWJzdHJhY3QlMjBkaWdpdGFsJTIwYXJ0JTIwaW5zdGFsbGF0aW9ufGVufDF8fHx8MTc3MzQxMDE0M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
  },
  {
    slug: "aether",
    title: "AETHER",
    subtitle: "Making algorithmic art feel like painting",
    client: "Aether Labs",
    year: "2024",
    role: "Product Designer & Strategist",
    timeline: "6 months",
    team: "2 designers, 3 engineers, 1 ML engineer",
    platform: "Web (Desktop-first), iPad",
    tools: ["Figma", "Framer", "Three.js", "Storybook", "Lottie"],
    color: "#a855f7",
    heroImage: "https://images.unsplash.com/photo-1764866127860-1da95e9c74a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZW9uJTIwYWJzdHJhY3QlMjBkaWdpdGFsJTIwYXJ0JTIwaW5zdGFsbGF0aW9ufGVufDF8fHx8MTc3MzQxMDE0M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    problem: "Generative art tools were split into two worlds: powerful-but-impenetrable code environments and dumbed-down visual toys. 80% of potential users — artists who think spatially, not syntactically — had no path into algorithmic creation. Aether's MVP was powerful but felt like an IDE, not a creative tool.",
    context: "Aether Labs wants to democratize generative art. Their MVP attracted technical artists but completely failed to convert visual-first creators. I was brought in to bridge that gap — make the tool approachable without sacrificing output quality or creative depth.",
    constraints: ["Must feel intuitive to artists with zero coding experience on first use", "Cannot sacrifice generative output quality or algorithmic complexity", "Real-time preview required for all parameter changes — WebGL at 60fps minimum", "Must support collaborative creation and social sharing from day one", "AI features must feel like creative partnership, not automation that replaces the artist"],
    researchInsights: [
      { title: "Visual creators think in layers", detail: "A node-based editor mapped more naturally to how visual artists think than timelines or code. They compose by stacking and connecting, not by writing sequences." },
      { title: "Happy accidents drive adoption", detail: "Users who discovered unexpected results in their first session were 4× more likely to return the next day. Serendipity is the hook." },
      { title: "Sharing precedes saving", detail: "87% of users wanted to share before saving. Social validation — not file management — was their primary motivation for finishing a piece." },
      { title: "AI should expand, not decide", detail: "Users rejected AI that auto-generated finished work but embraced AI that suggested interesting parameter ranges and starting points. The key distinction: suggestion vs. substitution." },
    ],
    strategy: "A dual-mode interface: visual node editor for building generative systems, direct manipulation canvas for real-time parameter tweaking. Core principle: progressive complexity — start with 3 nodes and a beautiful default, unlock depth as confidence grows.",
    strategyPillars: [
      { title: "Progressive Complexity", description: "Start simple — 3 nodes, one beautiful output. Complexity unlocks gradually as the user explores, never overwhelming at the start." },
      { title: "Creative Serendipity", description: "Randomization and 'happy accident' mechanics built into the core loop. Every parameter has a 'surprise me' state that generates within aesthetic bounds." },
      { title: "Social Creation", description: "Every creation gets a shareable URL instantly. Gallery, remix, and fork mechanics turn individual creation into community momentum." },
    ],
    processSteps: [
      { title: "Artist Interviews", description: "Interviewed 15 generative artists and 15 traditional digital artists separately. Mapped mental models and identified where workflows diverge and where they align." },
      { title: "Interaction Modeling", description: "Prototyped 4 interaction paradigms in parallel. The node-based + direct manipulation hybrid won decisively in testing — fastest to first output, highest satisfaction." },
      { title: "Visual Language", description: "Dark-first aesthetic that puts artwork center stage. All UI elements recede when not actively in use. The canvas is the hero, always." },
      { title: "AI Integration", description: "Designed AI as a 'creative companion' — surfacing parameter explorations and interesting starting points without overriding artist intent. Six iterations to find the right balance." },
      { title: "Performance Tuning", description: "Achieved real-time WebGL preview at 60fps while editing node parameters. Worked closely with engineering to optimize the render pipeline without sacrificing visual fidelity." },
      { title: "Community Layer", description: "Gallery, remix, and collaboration features designed to make sharing the path of least resistance. Discovery mechanics that surface interesting work, not just popular work." },
    ],
    wireframeImage: "https://images.unsplash.com/photo-1771503735122-22405ba958f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxub2RlJTIwZWRpdG9yJTIwdmlzdWFsJTIwcHJvZ3JhbW1pbmclMjBkYXJrJTIwaW50ZXJmYWNlfGVufDF8fHx8MTc3MzQyNTQyOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    designSystem: [
      { label: "Typography", description: "Space Grotesk for UI, monospace for parameter values — minimal and recessive" },
      { label: "Color", description: "Near-black canvas with purple accent. Content always dominates the visual hierarchy" },
      { label: "Components", description: "Node editor, parameter controls, gallery cards, sharing flows — 80+ components" },
      { label: "Motion", description: "Smooth parameter transitions, node connection animations, canvas zoom/pan physics" },
      { label: "Theming", description: "Accent color auto-adapts based on dominant color in current artwork" },
    ],
    designSystemImage: "https://images.unsplash.com/photo-1765445666227-dce7ccbf3c2c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwYXJ0JTIwY3JlYXRpdmUlMjBjb2RpbmclMjBnZW5lcmF0aXZlJTIwdmlzdWFsaXphdGlvbnxlbnwxfHx8fDE3NzM0MjU0Mjh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    prototypeHighlights: ["Node-based generative system builder with real-time WebGL preview at 60fps", "AI 'Creative Companion' suggesting parameter explorations without overriding artist decisions", "One-click sharing with auto-generated social preview images and instant public URL", "Remix mechanics letting users fork and evolve each other's work with full attribution"],
    prototypeImage: "https://images.unsplash.com/photo-1767727239153-8bf7f6be90e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGdlb21ldHJpYyUyMG5lb24lMjBwYXJ0aWNsZXMlMjBkYXJrJTIwYmFja2dyb3VuZHxlbnwxfHx8fDE3NzM0MjU0MzN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    outcomes: [
      { label: "Creators", value: "12K+", change: "First 3 months" },
      { label: "Artworks", value: "1.2M", change: "6 months post-launch" },
      { label: "Avg. Session", value: "34min", change: "3× industry average" },
      { label: "Day-30 Retention", value: "72%", change: "Up from 18%" },
      { label: "Remix Rate", value: "41%", change: "Of published artworks" },
      { label: "Funding", value: "Series A", change: "$12M raised post-launch" },
    ],
    learnings: ["The first 5 minutes determine whether someone becomes a creator or churns. Every onboarding decision should optimize for 'time to first beautiful output.'", "AI in creative tools works best when it expands the possibility space, not narrows it. Suggestion over substitution.", "Community features aren't add-ons — they're the retention engine. Sharing and remixing drove more return visits than any feature improvement."],
    reflection: "The best creative tools disappear. The hardest challenge was AI integration — balancing helpfulness with creative autonomy. Six iterations before finding the right tone: curious collaborator, not prescriptive assistant. The product succeeded because it made artists feel more capable, not replaced.",
    improvements: ["iPad version was adapted too late — should have been designed in parallel from the start with its own interaction model.", "Underinvested in onboarding tutorials for the initial learning curve. Progressive complexity only works if the first steps are truly effortless.", "The node editor needs a visual 'recipe' system for common generative patterns — templates that teach by example."],
    nextProject: { slug: "forma", title: "GAIG", image: "https://images.unsplash.com/photo-1566748886022-ec212e5642fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicnV0YWxpc3QlMjBjb25jcmV0ZSUyMGFyY2hpdGVjdHVyZSUyMHNoYWRvd3xlbnwxfHx8fDE3NzM0MTAxNDN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
  },
  {
    slug: "forma",
    title: "GAIG",
    subtitle: "Taming 33 business lines with one design language",
    client: "Great American Insurance Group",
    year: "2022",
    role: "Lead Product Designer",
    timeline: "12 months",
    team: "2 product designers, 4 mentored designers, cross-functional stakeholders",
    platform: "Web (B2B — Agent & Insured Portals)",
    tools: ["Figma", "Miro", "Teams", "Jira"],
    color: "#06b6d4",
    heroImage: "https://images.unsplash.com/photo-1566748886022-ec212e5642fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBpbnN1cmFuY2UlMjBlbnRlcnByaXNlJTIwcGxhdGZvcm0lMjBkYXJrJTIwbW9vZHl8ZW58MXx8fHwxNzczODAxNDQ1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    problem:
      "Imagine a Fortune 500 insurance platform where every business line invented its own interface. 33 products, 33 different UIs, zero shared language. Agents learned one system only to face a completely different one for their next product. Insureds abandoned policy enrollment mid-flow — confused by clunky navigation, inconsistent patterns, and a platform that never once told them if their action actually worked. No feedback, no guidance, no trust.",
    context:
      "Great American Insurance Group operates across 33 distinct business lines — from property and casualty to specialty risk management. Over years of independent development, each line built its own UI conventions, component libraries, and interaction patterns. The result: a Frankenstein platform that punished both the agents who sold through it and the insureds who depended on it. I was brought in to lead the redesign of the insured and risk management portals, build a scalable design system, and establish a UX governance model that would prevent this kind of drift from ever happening again.",
    constraints: [
      "33 business lines with entrenched stakeholders — each believing their product's UI was 'different enough' to warrant custom treatment",
      "Legacy technical architecture that couldn't absorb sweeping visual changes overnight — required incremental adoption",
      "Insurance compliance requirements mandating specific data fields and disclosures across every product",
      "No existing accessibility standards — the platform had grown without WCAG considerations",
      "Must support both agent-facing (power user, speed-optimized) and insured-facing (first-time, guidance-heavy) experiences from a shared system",
    ],
    researchInsights: [
      {
        title: "Silence breeds distrust",
        detail:
          "12 insured user interviews revealed the same pattern: when the system gave no feedback after an action, users assumed it failed. They'd retry, create duplicates, or abandon entirely. One participant said, 'I clicked submit and nothing happened. I thought the whole thing was broken.' The platform's silence was its loudest design failure.",
      },
      {
        title: "Inconsistency is cognitive tax",
        detail:
          "Agents working across multiple business lines reported spending up to 15 extra minutes per task reorienting themselves in unfamiliar UIs. The same action — submitting a policy endorsement — looked and behaved differently in each product. Consistency wasn't a nice-to-have; it was directly eroding productivity and revenue.",
      },
      {
        title: "Navigation was the first casualty",
        detail:
          "Desk research and internal data analysis confirmed that users who hit friction at navigation never recovered. They didn't try alternative paths — they left. The enrollment funnel had no breadcrumbs, no progress indication, and no way back without starting over.",
      },
      {
        title: "Accessibility was invisible",
        detail:
          "An internal audit revealed zero inclusive design practices. Color contrast failures, missing alt text, keyboard navigation gaps — the platform was functionally unusable for anyone relying on assistive technology, and legally exposed because of it.",
      },
    ],
    strategy:
      "Build once, apply everywhere. Create a token-first design system that encodes every visual and interaction decision into reusable, governed primitives — then establish a UX governance process that makes drift structurally impossible. The system wouldn't just fix what was broken; it would make consistency the path of least resistance for every team, every time.",
    strategyPillars: [
      {
        title: "Standardized Component Library",
        description:
          "Reusable UI components with built-in accessibility, consistent behavior, and clear documentation. Every button, form, modal, and feedback pattern behaves identically whether you're in specialty risk or property casualty. Designers stop reinventing; engineers stop guessing.",
      },
      {
        title: "Design Tokens & Visual Identity",
        description:
          "Predefined variables for colors, typography, spacing, and elevation — a single source of truth that propagates across all 33 business lines. Change a token, change the entire ecosystem. No more rogue palettes and inconsistent grays.",
      },
      {
        title: "UX Governance Framework",
        description:
          "A corporate-level change management process I co-created to control how the design system evolves. Any proposed change goes through impact assessment, stakeholder review, and accessibility validation before entering the system. Drift doesn't happen accidentally anymore.",
      },
    ],
    processSteps: [
      {
        title: "Discovery & Research",
        description:
          "Participated in 12 user interviews with insureds alongside a UX researcher, uncovering deep pain points around navigation confusion, missing feedback, and trust erosion. Ran desk research analyzing existing analytics, previous user feedback, and internal specialist surveys to map every friction point across enrollment and claims flows.",
      },
      {
        title: "Service Blueprinting",
        description:
          "Built comprehensive service blueprints mapping user journeys across policy enrollment, risk management, and claims submission. Visualized where users encountered friction and where the experience failed silently. The Okta verification blueprint alone revealed 6 unnecessary steps agents absorbed daily.",
      },
      {
        title: "Design Studio Workshop",
        description:
          "Facilitated a cross-functional workshop generating 30+ ideas. Used Impact/Effort matrices to prioritize: standardizing UI components, introducing design tokens, and creating accessible layout patterns rose to the top. Quick wins first, systemic fixes in parallel.",
      },
      {
        title: "Wireframing & Iteration",
        description:
          "Created low-fidelity wireframes for key workflows — enrollment, claims, risk assessment — introducing navigation patterns, progress indicators, and feedback mechanisms. Killed what didn't test well; doubled down on what users gravitated toward.",
      },
      {
        title: "High-Fidelity Design System",
        description:
          "Evolved wireframes into a polished component library with standardized UI elements, design tokens, and accessibility baked into every component. Built detailed guidelines, usage examples, and do/don't documentation. The system wasn't a library — it was a language.",
      },
      {
        title: "Testing & Governance Launch",
        description:
          "Conducted usability tests with 12 participants achieving 40% improvement in task completion rates. Simultaneously launched the UX governance process ensuring changes pass impact assessment and accessibility validation before release.",
      },
    ],
    wireframeImage: "https://images.unsplash.com/photo-1729710877209-1d2f9df0c8c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlZnJhbWUlMjBibHVlcHJpbnQlMjBVWCUyMHByb2Nlc3MlMjB3aGl0ZWJvYXJkJTIwZGFya3xlbnwxfHx8fDE3NzM4MDE0NDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    designSystem: [
      { label: "Tokens", description: "Color, typography, spacing, and elevation tokens encoding every visual decision into a single governed source of truth across 33 business lines" },
      { label: "Components", description: "Standardized UI library — buttons, forms, modals, feedback patterns, data tables — all with built-in accessibility and consistent behavior" },
      { label: "Accessibility", description: "Inclusive design standards meeting WCAG compliance: contrast ratios, keyboard navigation, screen reader support, and focus management" },
      { label: "Governance", description: "Corporate-level UX governance flow for proposing, reviewing, and approving design system changes — preventing drift at the organizational level" },
      { label: "Documentation", description: "Comprehensive guidelines with usage examples, do/don't patterns, and Figma best practices mentored across a team of 6 designers" },
    ],
    designSystemImage: "https://images.unsplash.com/photo-1720962158937-7ea890052166?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ24lMjBzeXN0ZW0lMjBjb21wb25lbnRzJTIwVUklMjBraXQlMjBkYXJrJTIwaW50ZXJmYWNlfGVufDF8fHx8MTc3MzgwMDY3N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    prototypeHighlights: [
      "Redesigned insured portal with consistent navigation, progress indicators, and real-time feedback replacing the platform's silence",
      "Risk management interface with standardized data tables, inline validation, and contextual help reducing agent reorientation time",
      "Unified component library deployed across all 33 business lines with zero visual fragmentation",
      "UX governance workflow ensuring every system change passes impact assessment and accessibility validation before release",
    ],
    prototypeImage: "https://images.unsplash.com/photo-1679601613261-88a176e4dbb9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbnRlcnByaXNlJTIwQjJCJTIwZGFzaGJvYXJkJTIwZGFyayUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NzM4MDE0NDZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    outcomes: [
      { label: "Feature Delivery", value: "+30%", change: "Standardized components eliminated rebuild waste" },
      { label: "User Satisfaction", value: "+39%", change: "Post-redesign survey improvement" },
      { label: "Task Completion", value: "+40%", change: "Usability testing vs. legacy baseline" },
      { label: "Business Lines", value: "33", change: "All unified under one design language" },
      { label: "Designers Mentored", value: "4", change: "Guided through UX methods & Figma practices" },
      { label: "Accessibility", value: "WCAG", change: "Inclusive design standards implemented platform-wide" },
    ],
    learnings: [
      "In enterprise, the human challenge is harder than the design challenge. 33 business lines means 33 sets of stakeholders who believe their product is 'special.' The breakthrough wasn't the component library — it was building trust that a shared system could flex enough to serve everyone without flattening anyone's needs.",
      "Governance isn't bureaucracy — it's the immune system. Without a formal change process, the design system would have fragmented within months. The governance framework I co-created wasn't about control; it was about making intentional decisions the default and accidental drift structurally impossible.",
      "Mentorship multiplies impact. Training four designers on UX methodologies, design processes, and Figma best practices meant the system's quality extended far beyond what I could personally review. The best design systems don't just scale components — they scale design thinking.",
    ],
    reflection:
      "This project taught me that a design system is never really about the components. It's about changing how an organization makes decisions. Great American had 33 business lines that had been designing in isolation for years — not because they wanted to, but because nobody had given them a shared language or a reason to converge. The real deliverable wasn't a Figma library. It was a governance model that made consistency feel like freedom instead of constraint. The 30% boost in feature delivery wasn't magic — it was the compounding effect of eliminating thousands of small, redundant decisions that had been draining every team, every sprint, for years. I left before seeing the full post-implementation metrics, and that's my one regret. But the foundation was built to outlast any individual contributor — and that, I think, is the mark of a system done right.",
    improvements: [
      "Should have pushed harder for a dedicated accessibility audit at the start, not midway through. Retrofitting inclusive design is always more expensive than building it in from day one.",
      "The incremental rollout — while necessary for legacy constraints — meant some business lines lived with inconsistency longer than ideal. A parallel 'fast track' for willing early adopters would have built internal momentum faster.",
      "Needed more formalized design-to-engineering handoff. The governance flow controlled design changes well, but translation to code still relied too heavily on tribal knowledge and individual relationships.",
    ],
    nextProject: { slug: "luxe", title: "RISE", image: "https://images.unsplash.com/photo-1764795849755-ab58c8fef307?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBkYXJrJTIwcHJvZHVjdCUyMHN0aWxsJTIwbGlmZSUyMG1pbmltYWx8ZW58MXx8fHwxNzczNDEwMTQ0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
  },
  {
    slug: "luxe",
    title: "RISE",
    subtitle: "When shopping becomes feeling",
    client: "Rise Cannabis / Green Thumb Industries",
    year: "2021",
    role: "Product Designer",
    timeline: "6 months",
    team: "1 product designer, 1 UX strategist, PMs, developers",
    platform: "Web (E-Commerce), Mobile Web",
    tools: ["Figma", "Mural", "Slack", "Photoshop"],
    color: "#f0abfc",
    heroImage: "https://images.unsplash.com/photo-1764795849755-ab58c8fef307?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYW5uYWJpcyUyMGRpc3BlbnNhcnklMjBtb2Rlcm4lMjByZXRhaWwlMjBkYXJrJTIwbW9vZHl8ZW58MXx8fHwxNzczODAxNzEzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    problem:
      "Nobody walks into a dispensary and says 'I'd like 3.5 grams of a sativa-dominant hybrid with 22% THC and a myrcene-forward terpene profile.' They say 'I want to relax after work' or 'I need something for creativity.' But Rise's online platform was built like a pharmaceutical catalog — strain names, THC percentages, and taxonomies that meant nothing to most customers. Users couldn't translate what they wanted to feel into what they should buy. They browsed, got confused, and left. Engagement was low, loyalty was leaking, and in a market where every dispensary sells the same products, the experience was the only differentiator Rise was wasting.",
    context:
      "Rise Cannabis, part of Green Thumb Industries — one of the largest multi-state operators in the U.S. — had a digital storefront that treated cannabis like commodity retail. But cannabis isn't commodity retail. It's one of the few product categories where the purchase decision is fundamentally emotional: people buy feelings, not SKUs. I was brought in as product designer alongside a UX strategist to redesign the shopping experience from the ground up — not by adding more filters to a broken catalog, but by reimagining how emotion could become the primary navigation paradigm.",
    constraints: [
      "Heavily regulated industry — product claims, health language, and marketing copy all legally constrained",
      "Enormous product catalog across multiple dispensary locations with inconsistent inventory",
      "Users range from first-time cannabis buyers to experienced connoisseurs — one experience must serve both",
      "Existing technical architecture with limited engineering bandwidth for custom features",
      "Competitive market where product selection is nearly identical across brands — experience is the only moat",
    ],
    researchInsights: [
      {
        title: "People buy emotions, not products",
        detail:
          "Surveys and customer feedback analysis revealed that the emotional outcome — relaxation, energy, creativity, pain relief — was the #1 factor in purchase decisions, yet the platform organized products by category and strain type. The entire information architecture was misaligned with how customers actually think.",
      },
      {
        title: "Drop-offs cluster at decision points",
        detail:
          "Analytics review showed users engaged with product pages but abandoned at the moment of commitment. They'd browse 8-12 products, compare nothing meaningful, and leave. The platform gave them data but no decision framework — like handing someone a wine list sorted by grape chemistry.",
      },
      {
        title: "Social proof outweighs expert opinion",
        detail:
          "Persona development and customer interviews showed that users trusted other customers' emotional experiences over brand descriptions or budtender recommendations. 'This made me feel calm and focused' was more persuasive than any marketing copy we could write.",
      },
      {
        title: "Education builds confidence, not just knowledge",
        detail:
          "First-time buyers didn't just lack information — they lacked confidence. The intimidation factor of cannabis terminology was actively preventing purchases. Users who encountered educational touchpoints during browsing were significantly more likely to complete a purchase.",
      },
    ],
    strategy:
      "Flip the entire shopping paradigm. Instead of 'browse products → guess which one matches your mood,' make it 'tell us how you want to feel → here's exactly what to buy.' Two core tools: a Fit Guide that maps desired emotional states to product recommendations, and a Feelings in Reviews filter that lets customers sort by what other users actually felt. Commerce driven by empathy, not taxonomy.",
    strategyPillars: [
      {
        title: "The Fit Guide",
        description:
          "An interactive tool that starts with the question every customer is actually asking: 'How do you want to feel?' Users select from emotional states — relaxed, energized, creative, pain-free, social — and the system recommends products based on real effect profiles and user-reported outcomes. Decision-making simplified to its emotional core.",
      },
      {
        title: "Feelings in Reviews",
        description:
          "A filter system layered on top of user-generated reviews, letting customers sort products by emotional experiences shared by real people. Not star ratings — feeling tags. 'Made me creative,' 'helped me sleep,' 'perfect for anxiety.' Social proof transformed into a navigation tool.",
      },
      {
        title: "Educational Commerce",
        description:
          "Contextual learning moments woven throughout the shopping flow — not a separate 'learn' section nobody visits, but micro-education at the exact moment of relevance. What's the difference between indica and sativa? Explained when it matters, not before.",
      },
    ],
    processSteps: [
      {
        title: "Discovery & Emotional Mapping",
        description:
          "Conducted surveys and analyzed customer feedback to understand the emotional drivers behind cannabis purchases. Built a risk and assumptions matrix to identify what we knew, what we assumed, and where we needed validation. The biggest assumption we killed: that experienced users didn't need emotional guidance. They did — they just wouldn't admit it.",
      },
      {
        title: "Persona & Journey Development",
        description:
          "Created detailed personas representing different customer archetypes — the curious first-timer, the wellness-focused regular, the recreational explorer — each mapped to emotional needs and shopping behaviors. Built customer journey maps revealing that the 'consideration' phase was where the entire experience collapsed.",
      },
      {
        title: "Design Studio Workshop",
        description:
          "Facilitated a collaborative workshop with stakeholders generating 8+ ideas. Used Impact/Effort matrices to prioritize. The Fit Guide and Feelings in Reviews rose immediately — high impact, technically feasible, and directly addressing the emotional gap. Some advanced filtering features were deprioritized for future iterations.",
      },
      {
        title: "Wireframing & Concept Validation",
        description:
          "Created low-fidelity wireframes for the Fit Guide flow, dispensary pages, and emotion-centric product filtering. Tested early concepts with internal teams to validate the paradigm shift from taxonomy-based to emotion-based navigation before investing in high-fidelity work.",
      },
      {
        title: "High-Fidelity Prototyping",
        description:
          "Evolved wireframes into polished prototypes featuring the Fit Guide, Feelings in Reviews filter, redesigned dispensary pages, and a reimagined cart-to-checkout flow with emotional cues reinforcing purchase confidence throughout. Designed a marketing page introducing users to the new emotion-driven tools.",
      },
      {
        title: "Usability Testing & Iteration",
        description:
          "Conducted usability tests revealing a 60% success rate in users finding products aligned with their desired effects — a massive improvement over the baseline of confused browsing. Feedback drove iterative refinements to navigation labels, filter affordances, and educational touchpoint placement.",
      },
    ],
    wireframeImage: "https://images.unsplash.com/photo-1621974182258-ce59c657267d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbW90aW9uJTIwbW9vZCUyMGNvbG9yJTIwZ3JhZGllbnQlMjBhYnN0cmFjdCUyMGRhcmt8ZW58MXx8fHwxNzczODAxNzE0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    designSystem: [
      { label: "Emotional UI", description: "Color, imagery, and micro-copy calibrated to reflect emotional states — warm tones for relaxation, vibrant for energy, soft for calm" },
      { label: "Fit Guide", description: "Interactive mood-to-product matching engine with progressive disclosure — simple entry, detailed results" },
      { label: "Review Filters", description: "Feeling-tagged review system transforming social proof into navigable product discovery" },
      { label: "Education", description: "Contextual learning moments integrated at decision points — not a knowledge base, but in-flow guidance" },
      { label: "Commerce Flow", description: "Redesigned cart, checkout, and order history with emotional reinforcement and simplified transitions" },
    ],
    designSystemImage: "https://images.unsplash.com/photo-1621584309109-ff65ab71f9fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib3RhbmljYWwlMjBwbGFudCUyMGxlYXZlcyUyMGRhcmslMjBhcnRpc3RpYyUyMG1pbmltYWx8ZW58MXx8fHwxNzczODAxNzE0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    prototypeHighlights: [
      "Fit Guide mapping emotional states to product recommendations — 'How do you want to feel?' as the primary entry point",
      "Feelings in Reviews filter letting users sort products by real emotional experiences shared by other customers",
      "Redesigned dispensary pages with emotion-centric navigation replacing taxonomy-based browsing",
      "Cart-to-checkout flow with confidence-building cues and educational micro-moments reducing abandonment",
    ],
    prototypeImage: "https://images.unsplash.com/photo-1720962158883-b0f2021fb51e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlY29tbWVyY2UlMjBtb2JpbGUlMjBzaG9wcGluZyUyMGFwcCUyMGRhcmslMjBpbnRlcmZhY2V8ZW58MXx8fHwxNzczODAxNzE0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    outcomes: [
      { label: "Product Matches", value: "+61%", change: "Users finding effect-aligned products" },
      { label: "Engagement", value: "+44%", change: "Time exploring via emotional navigation" },
      { label: "Repeat Customers", value: "+52%", change: "Loyalty driven by personalized experience" },
      { label: "Q3 Revenue", value: "$275M", change: "GTI quarterly — 9% sequential increase" },
      { label: "Usability Success", value: "60%", change: "Effect-matching task completion rate" },
      { label: "User Sentiment", value: "Positive", change: "'Intuitive' and 'easy to navigate'" },
    ],
    learnings: [
      "Emotions aren't soft metrics — they're the hardest business lever in experiential commerce. When your product catalog is identical to every competitor's, the feeling of shopping is the product. Rise's 52% repeat customer surge wasn't driven by better inventory — it was driven by a platform that finally spoke the language customers were already thinking in.",
      "Cross-functional alignment on emotional design requires evangelism, not just evidence. Stakeholders and developers initially resisted the shift from taxonomy-based to emotion-based navigation. The breakthrough was running the workshop — letting everyone experience the user's confusion firsthand, not just read about it in a research deck.",
      "Regulatory constraints aren't creative enemies — they're creative forcing functions. Cannabis marketing restrictions meant we couldn't make health claims or use certain language. That constraint pushed us toward user-generated emotional content, which turned out to be more authentic and persuasive than anything we could have written ourselves.",
    ],
    reflection:
      "This project changed how I think about commerce design. We spend so much energy optimizing funnels, reducing friction, A/B testing button colors — and none of it matters if the fundamental information architecture doesn't match how people actually make decisions. Rise customers weren't making rational choices based on THC percentages. They were making emotional choices based on how they wanted their evening to feel. The moment we rebuilt the entire shopping experience around that truth — feelings first, products second — everything moved. Engagement, loyalty, revenue. The $275M quarterly revenue wasn't caused by our redesign alone, but the 52% surge in repeat customers was. And in a commodity market, repeat customers are the only metric that actually compounds.",
    improvements: [
      "The Feelings in Reviews filter needed more data density at launch — with limited reviews tagged by emotion, some product categories felt sparse. Should have seeded the system with structured data from budtender expertise before relying on user-generated content alone.",
      "Advanced filtering features were cut for scope, and I still think that was the right call. But the roadmap for re-introducing them needed to be more concrete — 'future iteration' isn't a plan, it's a postponement.",
      "Should have pushed harder for A/B testing the cart and checkout flows. We redesigned them based on best practices and usability testing, but quantitative validation in production would have given us the confidence to iterate faster post-launch.",
    ],
    nextProject: { slug: "synth", title: "SYNTH", image: "https://images.unsplash.com/photo-1751945965597-71171ec7a458?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbWJpZW50JTIwbGlnaHRpbmclMjBzbWFydCUyMGhvbWUlMjBpbnRlcmlvciUyMG1vb2R5fGVufDF8fHx8MTc3MzQxMDE0NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
  },
  {
    slug: "synth",
    title: "SYNTH",
    subtitle: "Making the smart home disappear",
    client: "SynthOS",
    year: "2023",
    role: "Creative Director & Designer",
    timeline: "9 months",
    team: "2 designers, 5 engineers, 1 PM, 1 IoT specialist",
    platform: "iOS, Android, Smart Display, Watch",
    tools: ["Figma", "Principle", "Swift Playgrounds", "Lottie", "Arduino"],
    color: "#34d399",
    heroImage: "https://images.unsplash.com/photo-1751945965597-71171ec7a458?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbWJpZW50JTIwbGlnaHRpbmclMjBzbWFydCUyMGhvbWUlMjBpbnRlcmlvciUyMG1vb2R5fGVufDF8fHx8MTc3MzQxMDE0NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    problem: "Smart home controls scattered across 6+ apps — 73% of users had abandoned at least one device because controlling it was too frustrating. 47 daily interactions just to manage basic routines. The mental overhead made 'smart' homes feel actively dumb.",
    context: "SynthOS integrates with 200+ device manufacturers as the unified layer for connected homes. But their app was a glorified remote control — flat device list, no intelligence, no spatial awareness. The CEO's vision: an ambient interface reducing daily interactions to near-zero. I was brought in to make that tangible across phone, tablet, smart display, and watch.",
    constraints: [
      "Must support 200+ device protocols with wildly varying latencies and reliability",
      "Must work across phone, tablet, smart display, and watch — each with distinct use cases",
      "Context-aware automation must feel helpful, not invasive or surveillance-like",
      "Basic setup under 2 minutes — no manual device configuration",
      "Must handle offline states and device disconnection gracefully without breaking the experience",
    ],
    researchInsights: [
      { title: "Invisible is ideal", detail: "Users' ideal interaction count was zero. The more the home 'just worked,' the higher the satisfaction — regardless of how many features were available. Automation that eliminated taps always beat automation that added smarter taps." },
      { title: "Rooms > Devices", detail: "Users think in rooms, not device categories. 'Make the bedroom cozy' is the mental model, not 'set Hue bulbs to 2700K, Nest to 72°, blinds to 40%.' The interface needed to speak in environments, not endpoints." },
      { title: "Transparency builds trust", detail: "Users who could see why an automation triggered were 3× more likely to keep it enabled. Black-box intelligence scared people. Explainable automation was the only kind that stuck." },
      { title: "Glanceable is essential", detail: "80% of interactions were status checks, not controls. The dashboard needed to communicate whole-home state in under 2 seconds — ambient information, not interactive dashboards." },
    ],
    strategy: "An ambient, room-centric interface treating the home as a living environment, not a device collection. Instead of managing individual endpoints, users interact through rooms and scenes — Morning, Focus, Relax, Sleep — that control multiple devices with one action. Proactive automation learns patterns and suggests routines, always explaining its reasoning so trust compounds over time.",
    strategyPillars: [
      { title: "Room-Centric Model", description: "Every interaction starts from a room context. Individual devices are abstracted into environmental controls — temperature, light, sound, privacy — so users manipulate feelings, not firmware." },
      { title: "Ambient Intelligence", description: "The system observes daily patterns and suggests automations. Users approve or dismiss — never program. Over time, the home learns to anticipate needs without being told." },
      { title: "Zero-Config Onboarding", description: "Auto-discover devices on network, suggest room assignments based on signal strength and type, propose initial scenes based on household size. Full setup in under 2 minutes." },
    ],
    processSteps: [
      { title: "Home Ethnography", description: "Spent 1 week living in each of 4 'smart homes' with different setups. Documented daily routines, friction points, and the workarounds people invented. The biggest insight: most people used voice assistants as a crutch because the apps were too painful." },
      { title: "Interaction Audit", description: "Mapped every tap across 6 competitor apps for common tasks. 'Turn off lights at bedtime' required 12 taps on average. Set a design target: every routine achievable in ≤2 taps or zero taps via automation." },
      { title: "Scene Design", description: "Developed preset environmental states — Morning, Focus, Relax, Sleep — that control multiple devices simultaneously. Tested with 20 households, iterated on which defaults felt right vs. arbitrary." },
      { title: "Ambient UI System", description: "Dashboard communicates state through visual warmth/coolness, ambient breathing animations, and contextual density. Active devices glow subtly; inactive ones recede. The interface breathes with the home." },
      { title: "Multi-Surface Adaptation", description: "Designed distinct interface variants for phone (control), tablet (dashboard), smart display (ambient glance), and watch (quick actions). Each optimized for its primary use case, not responsive copies." },
      { title: "Automation UX", description: "Built a visual automation builder using 'When → Then' logic with natural language. 'When I leave home → Turn off all lights and lock doors.' Tested extensively to ensure suggestions felt helpful, not presumptuous." },
    ],
    wireframeImage: "https://images.unsplash.com/photo-1583432949827-4360d9f484e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJb1QlMjBkZXZpY2UlMjBjb250cm9sJTIwcGFuZWwlMjBtaW5pbWFsJTIwZGFya3xlbnwxfHx8fDE3NzM0MjU0MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    designSystem: [
      { label: "Color System", description: "Adaptive palette that reflects home ambiance — warm tones for evening/cozy, cool tones for morning/focus. The UI color temperature matches the room's lighting state" },
      { label: "Iconography", description: "120+ device and scene icons with consistent 1.5px stroke style, designed for legibility at glance distances across all four surfaces" },
      { label: "Components", description: "Room cards, device controls, scene builders, automation tiles — 200+ components with 4 surface variants sharing a unified token system" },
      { label: "Motion", description: "Ambient breathing animations for idle states, physics-based controls for direct manipulation, choreographed scene transitions" },
      { label: "Multi-Surface", description: "Shared token foundation with surface-specific component variants — not responsive breakpoints, but distinct experiences per device" },
    ],
    designSystemImage: "https://images.unsplash.com/photo-1575388902449-6bca946ad549?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydCUyMGhvbWUlMjBkYXNoYm9hcmQlMjBhbWJpZW50JTIwaW50ZXJmYWNlJTIwZGFya3xlbnwxfHx8fDE3NzM0MjU0MzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    prototypeHighlights: ["Ambient dashboard with visual temperature and mood indicators that communicate whole-home state at a glance", "One-tap scene activation with choreographed multi-device transitions and spatial audio confirmation", "Zero-config auto-discovery setup that configures a smart home in under 2 minutes with room suggestions", "Visual 'When → Then' automation builder using natural language and explainable trigger logic"],
    prototypeImage: "https://images.unsplash.com/photo-1751945965597-71171ec7a458?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbWJpZW50JTIwbGlnaHRpbmclMjBzbWFydCUyMGhvbWUlMjBpbnRlcmlvciUyMG1vb2R5fGVufDF8fHx8MTc3MzQxMDE0NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    outcomes: [
      { label: "DAU", value: "280K", change: "6 months post-launch" },
      { label: "Daily Interactions", value: "47→8", change: "83% reduction per user" },
      { label: "Setup Time", value: "<2min", change: "Full basic configuration" },
      { label: "Automation Adoption", value: "78%", change: "Users with 3+ active automations" },
      { label: "App Store Rating", value: "4.9★", change: "Up from 2.8★" },
      { label: "Device Abandonment", value: "-61%", change: "Users reconnecting previously abandoned devices" },
    ],
    learnings: [
      "The best IoT design reduces interactions, not adds features. Every 'smart' feature requiring a tap was a design failure. North star: can this happen with zero input?",
      "Multi-surface design is fundamentally different from responsive design. A watch is not a small phone. A smart display is not a wall-mounted tablet. Each surface needs its own interaction model, sharing concepts but not implementations.",
      "Context-aware automation needs radical transparency. Every suggestion had to explain its reasoning in plain language, or users disabled it within a week. 'Because you usually do this at 7am' beats 'Suggested automation' every time.",
    ],
    reflection: "SYNTH changed how I think about digital interfaces and physical space. The interface isn't just on the screen — it's in the room. Ambient color, breathing animations, spatial audio — all contributing to a feeling that the home is alive and attentive. The most satisfying user quote from post-launch: 'I forgot I had a smart home. It just works.' That invisibility was the entire goal.",
    improvements: [
      "The watch interface was too feature-dense — it should have been scene activation and status only. We tried to pack phone-level control onto a 44mm screen and it showed.",
      "Failure states for device disconnections needed more elegant handling. When a device went offline, the UI felt broken rather than gracefully degraded.",
      "Automation suggestions were sometimes too aggressive for non-daily routines — the system would suggest automations based on 2-3 occurrences, which felt presumptuous. Needed a higher confidence threshold before surfacing suggestions.",
    ],
    nextProject: { slug: "solstice", title: "SOLSTICE", image: "https://images.unsplash.com/photo-1702726001096-096efcf640b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNobm9sb2d5JTIwY29uc3VsdGluZyUyMG9mZmljZSUyMG1vZGVybiUyMGRhcmslMjBtb29keXxlbnwxfHx8fDE3NzM4MDMwMTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
  },
  {
    slug: "solstice",
    title: "SOLSTICE",
    subtitle: "Scaling a consultancy's product through design system discipline",
    client: "Solstice Innovations (via Technology Consulting)",
    year: "2020–2021",
    role: "Senior Product Designer & Design Lead",
    timeline: "14 months",
    team: "3 mentored designers, 2 PMs, cross-functional engineering pods",
    platform: "Web (Enterprise SaaS — Client Portals & Internal Tools)",
    tools: ["Figma", "Miro", "Jira", "Storybook", "Slack", "Teams"],
    color: "#f59e0b",
    heroImage:
      "https://images.unsplash.com/photo-1702726001096-096efcf640b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNobm9sb2d5JTIwY29uc3VsdGluZyUyMG9mZmljZSUyMG1vZGVybiUyMGRhcmslMjBtb29keXxlbnwxfHx8fDE3NzM4MDMwMTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    problem:
      "Solstice had built a powerful enterprise platform — but it had grown the way most consultancy products grow: fast, client by client, feature by feature, with no shared design language holding it together. Every new engagement added UI debt. Every new developer interpreted the same component differently. The application worked, technically — but it felt like six different products wearing the same logo. Users stumbled through inconsistent navigation, contradictory interaction patterns, and an interface that demanded relearning with every module. The product was scaling in features but shrinking in usability.",
    context:
      "Solstice is a technology consulting and custom software development firm that builds digital products for enterprise clients across industries. Their internal platform — used by both consultants and client teams — had evolved organically through years of rapid delivery cycles. I was brought in as Senior Product Designer to lead UX research, own the product design for key modules, and — critically — mentor a team of three junior designers who had been shipping features without a unifying design framework. The mandate was clear: stop the bleeding, build the system, and teach the team to sustain it. This wasn't a redesign project. It was a rescue operation disguised as design system work.",
    constraints: [
      "Active client engagements running on the platform — no 'big bang' redesign possible without breaking live workflows",
      "Three junior designers with varying skill levels who needed upskilling while simultaneously shipping features",
      "Multiple engineering pods working in parallel sprints — any design system had to be adoptable incrementally, not all-at-once",
      "Legacy codebase with inconsistent front-end architecture — some modules in React, others still in Angular",
      "Stakeholders across multiple client accounts, each with different priorities and definitions of 'done'",
    ],
    researchInsights: [
      {
        title: "Nobody trusts the interface",
        detail:
          "8 user interviews with internal consultants and 6 with client stakeholders revealed a shared pattern: users had learned to distrust the platform's feedback. Buttons that looked clickable weren't. Forms submitted without confirmation. Success states looked identical to error states. One consultant said, 'I always screenshot my submissions because I never know if it actually worked.' The platform had a credibility problem disguised as a UI problem.",
      },
      {
        title: "Designers were designing in isolation",
        detail:
          "The three junior designers were talented but disconnected. Each owned a module, each had developed their own component conventions, and none had visibility into what the others were building. The result: three parallel design dialects that made the product feel schizophrenic. This wasn't a people problem — it was a process problem. Nobody had given them a shared vocabulary.",
      },
      {
        title: "Navigation was a maze built by committee",
        detail:
          "Heuristic evaluation and task analysis showed users averaging 7+ clicks to complete core workflows that should take 3. Navigation patterns changed between modules — sidebar in one, top-bar in another, hamburger menu in a third. Users couldn't build muscle memory because the interface kept changing the rules.",
      },
      {
        title: "Accessibility was an afterthought everywhere",
        detail:
          "An audit revealed critical WCAG failures across every module: missing focus states, color contrast below AA, no keyboard navigation paths, unlabeled form inputs. The platform was functionally inaccessible to anyone using assistive technology — and legally exposed.",
      },
    ],
    strategy:
      "Build a design system that doesn't just unify components — it unifies the team. Create a shared design language that encodes decisions about interaction, feedback, navigation, and accessibility into reusable, governed primitives. Then embed that system into the team's daily workflow through mentorship, paired design sessions, and a review cadence that makes quality the default, not the exception. The system would scale the product by first scaling the people.",
    strategyPillars: [
      {
        title: "Foundation-First Design System",
        description:
          "A token-driven component library built from audit findings — not aspirational ideals. Every component addressed a real inconsistency we'd documented. Color tokens, spacing scales, typography hierarchy, elevation system, and interaction states standardized across all modules. Not a library to admire — a language to speak.",
      },
      {
        title: "Mentorship as Multiplier",
        description:
          "Weekly 1:1s with each junior designer. Bi-weekly design critiques where we reviewed work against the system — not aesthetics, but consistency, accessibility, and user intent. Paired design sessions on complex flows. The goal wasn't to create followers — it was to create three designers who could sustain the system without me.",
      },
      {
        title: "Progressive Adoption Strategy",
        description:
          "Instead of demanding a full migration, we prioritized the highest-traffic modules first. New features adopted the system by default. Legacy screens were migrated during existing sprint work — never as a separate 'design debt' initiative that could be deprioritized. Consistency spread like an infection, not a mandate.",
      },
    ],
    processSteps: [
      {
        title: "Research & Audit",
        description:
          "Conducted 14 user interviews (8 internal consultants, 6 client stakeholders) alongside heuristic evaluation of all 5 core modules. Documented 120+ inconsistencies across navigation, interaction patterns, feedback states, and visual treatment. Built a severity matrix that prioritized fixes by user impact, not visual severity.",
      },
      {
        title: "Team Assessment & Mentorship Plan",
        description:
          "Assessed each junior designer's strengths, gaps, and growth goals. Created individualized mentorship tracks: one focused on interaction design rigor, another on visual systems thinking, the third on research-informed design. Established weekly rituals — 1:1s, critiques, paired sessions — that created psychological safety alongside accountability.",
      },
      {
        title: "Design System Architecture",
        description:
          "Designed the token structure, component hierarchy, and pattern library based directly on audit findings. Every token and component traced back to a documented inconsistency. Built the system in Figma with auto-layout, variants, and detailed usage documentation — then worked with engineering to establish a Storybook instance as the source of truth.",
      },
      {
        title: "Navigation & IA Redesign",
        description:
          "Unified the information architecture across all modules — consistent sidebar navigation, predictable breadcrumb patterns, and a global search that actually worked. Reduced average clicks-to-task from 7+ to 3. Tested with 10 users, iterated on label clarity and grouping logic.",
      },
      {
        title: "Feedback & State System",
        description:
          "Designed a comprehensive feedback framework: loading states, success confirmations, error handling, empty states, and inline validation. Every user action now produced a visible, consistent response. Toasts, banners, inline messages — each with clear hierarchy and accessibility compliance. The platform learned to speak back.",
      },
      {
        title: "Rollout & Governance",
        description:
          "Rolled out the design system progressively — highest-traffic modules first, then legacy screens during sprint work. Established a lightweight governance process: any new pattern required documentation, accessibility check, and peer review before entering the library. The system became self-sustaining because the team owned it, not just me.",
      },
    ],
    wireframeImage:
      "https://images.unsplash.com/photo-1630673489068-d329fa4e2767?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2Z0d2FyZSUyMGRldmVsb3BtZW50JTIwdGVhbSUyMGNvbGxhYm9yYXRpb24lMjB3aGl0ZWJvYXJkfGVufDF8fHx8MTc3MzgwMzAxN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    designSystem: [
      { label: "Tokens", description: "Color, typography, spacing, elevation, and shadow tokens encoding every visual decision into a single governed source of truth — with dark/light mode support" },
      { label: "Components", description: "60+ production-ready components — inputs, buttons, tables, modals, toasts, navigation elements — all with built-in states, accessibility, and detailed usage docs" },
      { label: "Patterns", description: "Reusable page templates for dashboards, forms, detail views, settings, and empty states — reducing design-from-scratch to configure-and-ship" },
      { label: "Feedback System", description: "Unified loading, success, error, and validation patterns replacing the platform's silence with consistent, trustworthy interaction responses" },
      { label: "Governance", description: "Lightweight review process for new patterns — documentation, a11y check, peer review — owned by the team, not dependent on any single designer" },
    ],
    designSystemImage:
      "https://images.unsplash.com/photo-1731033182396-721f7ba29532?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ24lMjBzeXN0ZW0lMjBjb21wb25lbnRzJTIwVUklMjBsaWJyYXJ5JTIwZGFyayUyMGludGVyZmFjZXxlbnwxfHx8fDE3NzM4MDMwMjF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    prototypeHighlights: [
      "Unified navigation system with consistent sidebar, breadcrumbs, and global search reducing average task clicks from 7+ to 3",
      "Comprehensive feedback framework — every action produces visible, accessible confirmation replacing the platform's previous silence",
      "Token-driven component library with 60+ components, all featuring built-in states, dark/light mode, and WCAG AA compliance",
      "Progressive adoption strategy allowing live client engagements to migrate incrementally without workflow disruption",
    ],
    prototypeImage:
      "https://images.unsplash.com/photo-1760670399462-f5e479452c27?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbnRlcnByaXNlJTIwZGFzaGJvYXJkJTIwYW5hbHl0aWNzJTIwcGxhdGZvcm0lMjBkYXJrJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc3MzgwMzAyNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    outcomes: [
      { label: "Usability Score", value: "+63%", change: "Measured across all 5 core modules post-system adoption" },
      { label: "Task Completion", value: "+45%", change: "Users completing core workflows without assistance" },
      { label: "UI Inconsistencies", value: "-80%", change: "From 120+ documented issues to under 25" },
      { label: "Design Velocity", value: "+55%", change: "Team shipping features faster with system components" },
      { label: "Designers Mentored", value: "3", change: "All promoted within 12 months of program" },
      { label: "Accessibility", value: "WCAG AA", change: "Full compliance achieved across all modules" },
    ],
    learnings: [
      "A design system built in isolation is a museum piece. The reason Solstice's system actually stuck is because the team built it with me, not for me. Every token, every component, every pattern had a designer's name on it — someone who understood the 'why' because they'd fought through the 'how.' When I left, the system didn't leave with me. That's the only metric that matters for design system success.",
      "Mentorship isn't about making people design like you — it's about giving them the frameworks to make better decisions on their own. The three designers I mentored didn't become copies of my approach. They became stronger versions of their own. One leaned into interaction design, another became the accessibility champion the team needed, the third developed a systems-thinking mindset that reshaped how the team approached new features. The best mentorship creates independence, not dependence.",
      "Research in a consultancy environment is a political act. You're not just uncovering user needs — you're building the case for why design decisions should be evidence-based in an organization where speed often trumps rigor. Every insight I presented was framed in business terms: not 'users are confused' but 'confusion costs us X hours per week in support escalations.' The language of impact is the only language that travels upward.",
    ],
    reflection:
      "This project lives in my memory as the one where I understood that design leadership isn't about the artifacts you create — it's about the capability you leave behind. When I joined Solstice, the platform was held together by duct tape and good intentions. Three talented but unsupported designers were doing their best in a vacuum. The product was growing in features but drowning in inconsistency. Fourteen months later, the platform had a unified design language, a governance process that made consistency automatic, and — most importantly — three designers who didn't need me anymore. The +63% usability improvement and -80% inconsistency reduction are the metrics I report. But the moment I'm proudest of is when one of my mentees pushed back on a stakeholder request using research data she'd gathered herself, defended her recommendation with clarity and confidence, and won. That's not a metric. That's a legacy. The design system was the deliverable. The team was the product.",
    improvements: [
      "Should have established the Storybook-to-Figma sync pipeline from day one. We built the Figma library first and the code components second, which created a drift window that cost us rework. In hindsight, parallel development with a clear source-of-truth protocol would have saved weeks.",
      "The Angular-to-React migration happening in parallel with the design system rollout created friction I underestimated. Some engineering pods adopted the system's React components eagerly; others were stuck in Angular and felt left behind. A dedicated Angular component bridge — even a temporary one — would have accelerated adoption across the entire platform.",
      "I should have documented the mentorship framework more formally. What I did with those three designers worked, but it was intuitive and ad-hoc. A structured mentorship curriculum — with clear milestones, skill assessments, and growth tracks — would have made the model repeatable for future design leads.",
    ],
    nextProject: { slug: "meridian", title: "HEALTHPILOT", image: healthpilotImg },
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
      <div ref={ref} className="relative overflow-hidden rounded-sm">
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

      const idx = CHAPTERS.findIndex((ch) => ch.id === activeChapter);

      if (e.key === "j" || e.key === "ArrowDown") {
        // Next chapter
        if (idx < CHAPTERS.length - 1) {
          e.preventDefault();
          document.getElementById(CHAPTERS[idx + 1].id)?.scrollIntoView({ behavior: "smooth" });
        }
      } else if (e.key === "k" || e.key === "ArrowUp") {
        // Previous chapter
        if (idx > 0) {
          e.preventDefault();
          document.getElementById(CHAPTERS[idx - 1].id)?.scrollIntoView({ behavior: "smooth" });
        }
      } else if (e.key === "Escape") {
        // Back to top
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (e.key >= "1" && e.key <= "9") {
        // Jump to chapter by number
        const num = parseInt(e.key, 10) - 1;
        if (num < CHAPTERS.length) {
          e.preventDefault();
          document.getElementById(CHAPTERS[num].id)?.scrollIntoView({ behavior: "smooth" });
        }
      } else if (e.key === "0") {
        // 0 => chapter 10
        if (CHAPTERS.length >= 10) {
          e.preventDefault();
          document.getElementById(CHAPTERS[9].id)?.scrollIntoView({ behavior: "smooth" });
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeChapter]);

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
      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
    >
      {/* Grain */}
      <div className="grain-overlay" />

      {/* FloatingNav handles global scroll progress bar */}
      <ChapterNav activeChapter={activeChapter} accentColor={cs.color} />
      <MobileChapterDrawer activeChapter={activeChapter} accentColor={cs.color} />

      {/* ═══════════════════════════════════════
         1. HERO BANNER
         ═══════════════════════════════════════ */}
      <section ref={heroRef} className="relative h-[85vh] md:h-screen overflow-hidden">
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
              className="text-[clamp(3rem,12vw,10rem)] leading-[0.85] tracking-[-0.04em]"
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

      {/* ═══════════════════════════════════════
         2. OVERVIEW
         ═══════════════════════════════════════ */}
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
          src="https://images.unsplash.com/photo-1693044216415-e2c1d759ed62?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1c2VyJTIwcmVzZWFyY2glMjBpbnRlcnZpZXclMjBzZXNzaW9uJTIwb2ZmaWNlfGVufDF8fHx8MTc3MzQxMDYwNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
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
        <div className="relative">
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
      </Section>

      {/* ═══════════════════════════════════════
         8. WIREFRAMES
         ═══════════════════════════════════════ */}
      <Section id="wireframes" className="px-6 md:px-12 lg:px-24 py-20 md:py-32" onInView={handleChapterChange}>
        <ChapterLabel number="07" title="Wireframes & Explorations" accentColor={cs.color} />
        <ImmersiveImage src={cs.wireframeImage} alt="Wireframe explorations" caption="Early explorations — low-fidelity flows and concept sketches" reducedMotion={isMobile || reducedMotion} />
        {/* Before / After comparison */}
        <Reveal delay={0.15}>
          <div className="mt-4 mb-4">
            <span
              className="block text-[10px] tracking-[0.4em] uppercase text-[#6b6b76]/60 mb-6"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              Before → After — Drag to compare
            </span>
          </div>
        </Reveal>
        <BeforeAfterSlider
          beforeImage={cs.wireframeImage}
          afterImage={cs.prototypeImage}
          beforeLabel="Wireframe"
          afterLabel="Final Design"
          accentColor={cs.color}
        />
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

      {/* ═══════════════════════════════════════
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
                  className="text-[clamp(3rem,10vw,8rem)] leading-[0.85] tracking-[-0.04em] text-[#e8e6e3]"
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
              className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-white/10 flex items-center justify-center transition-all duration-500 shrink-0 lg:hidden"
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
          <FooterLink onClick={() => navigate("/")} label="← Back to Portfolio" color={cs.color} />
          <FooterLink onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} label="Back to Top ↑" color={cs.color} />
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
      style={{ height, backgroundColor: `${color}40` }}
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