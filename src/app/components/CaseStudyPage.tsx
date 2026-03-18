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
    title: "MERIDIAN",
    subtitle: "Turning onboarding into a trust engine",
    client: "Meridian Financial",
    year: "2025",
    role: "Lead Product Designer",
    timeline: "8 months",
    team: "2 designers, 4 engineers, 1 PM",
    platform: "iOS, Android, Web",
    tools: ["Figma", "Framer", "Principle", "Lottie", "Storybook"],
    color: "#c4ff00",
    heroImage:
      "https://images.unsplash.com/photo-1626364131837-89a92c9a84d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwbW9vZHklMjBmaW50ZWNoJTIwYXBwJTIwc2NyZWVucyUyMG1vY2t1cHxlbnwxfHx8fDE3NzM0MTA2MDR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    problem:
      "Meridian was hemorrhaging ~$2.4M annually — 40% of users abandoned onboarding before identity verification. The flow was a wall of form fields: no progress cues, no context for why data was needed, zero emotional payoff. It felt like paperwork, not the start of a financial relationship.",
    context:
      "Meridian is a digital bank targeting millennials and Gen-Z with competitive rates, but the product experience didn't match the brand promise. Engineer-built with minimal design input — functional but devoid of personality. My job: close the gap between what the brand marketed and what the product delivered.",
    constraints: [
      "Strict KYC/AML compliance — every data collection point legally required",
      "Backend locked for 6 months — had to design around existing API limitations",
      "Must accommodate users with limited digital literacy",
      "8-month timeline end-to-end, including engineering handoff",
      "No illustration budget — had to rely on typography, photography, and motion",
    ],
    researchInsights: [
      {
        title: "Users scan, they don't read",
        detail:
          "85% of test participants skipped instructional copy entirely. Visual hierarchy and progressive disclosure were the only reliable navigation cues.",
      },
      {
        title: "Trust is earned in 30 seconds",
        detail:
          "Users who didn't feel confident by the third screen were 4× more likely to abandon. Familiar patterns and visible security signals were non-negotiable.",
      },
      {
        title: "'Why' outperforms 'what'",
        detail:
          "Users who understood why they were sharing personal data completed onboarding at 2× the rate of those who only saw field labels.",
      },
      {
        title: "Small wins compound",
        detail:
          "Adding micro-celebrations after each step increased overall completion by 23%. Momentum is a design tool.",
      },
    ],
    strategy:
      "Reframe onboarding entirely — not as a form to fill, but as a guided conversation. Each step explains its purpose before asking for input, celebrates completion, and progressively builds the trust needed for a financial relationship.",
    strategyPillars: [
      {
        title: "Conversational UX",
        description:
          "Replaced form-heavy screens with a step-by-step dialogue. Each screen has one job: explain context, then collect one piece of information.",
      },
      {
        title: "Progressive Trust",
        description:
          "Showed exactly where data goes and why at every step. Made security visible, not assumed.",
      },
      {
        title: "Micro-Momentum",
        description:
          "Subtle animations after each completed step. Progress feels rewarding, not tedious. Small dopamine hits that keep users moving forward.",
      },
    ],
    processSteps: [
      {
        title: "Discovery & Audit",
        description:
          "Audited the existing flow with heatmaps, session recordings, and 12 user interviews. Mapped every friction point and categorized by severity and fixability.",
      },
      {
        title: "Competitive Analysis",
        description:
          "Benchmarked 8 onboarding flows across fintech, neobanks, and top consumer apps. Identified patterns that worked and gaps nobody was filling.",
      },
      {
        title: "Concept Sprints",
        description:
          "Ran 3 one-week sprints exploring different mental models — wizard, conversation, and narrative. Paper prototypes tested with 6 users narrowed us to conversational.",
      },
      {
        title: "Design & Iteration",
        description:
          "Built high-fidelity prototypes in Figma and Framer. Three rounds of usability testing, iterating between each. Cut 4 screens and reordered 3 based on test data.",
      },
      {
        title: "System & Handoff",
        description:
          "Created a 120+ component library with motion tokens and accessibility annotations. Delivered via Storybook with detailed interaction specs.",
      },
      {
        title: "Launch & Optimize",
        description:
          "Rolled out to 10% of users first, then full release. Monitored daily for a month, making micro-adjustments to copy and timing based on real behavior.",
      },
    ],
    wireframeImage:
      "https://images.unsplash.com/photo-1571456610111-72c649ad3521?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlZnJhbWUlMjBza2V0Y2glMjB3aGl0ZWJvYXJkJTIwZGVzaWduJTIwcHJvY2Vzc3xlbnwxfHx8fDE3NzM0MTA2MDV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    designSystem: [
      { label: "Typography", description: "Inter for UI, Syne for marketing — 4 weights, strict modular scale" },
      { label: "Color", description: "Dark-first palette with acid-green accent. WCAG AAA across all surfaces" },
      { label: "Spacing", description: "4px base grid, 8/16/24/32/48/64 spacing tokens for consistent rhythm" },
      { label: "Motion", description: "3 easing curves, 4 duration tokens. Choreographed step-to-step transitions" },
      { label: "Components", description: "120+ components, 3 size variants, dark/light modes, full a11y annotations" },
    ],
    designSystemImage:
      "https://images.unsplash.com/photo-1754666104720-28f18a9130e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ24lMjB0b2tlbnMlMjBjb2xvciUyMHBhbGV0dGUlMjB0eXBvZ3JhcGh5JTIwc3BlY2ltZW58ZW58MXx8fHwxNzczNDI1NDI5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    prototypeHighlights: [
      "One-question-per-screen conversational flow with contextual micro-copy explaining data purpose",
      "Biometric verification with real-time progress ring and animated success states",
      "First-transaction celebration with confetti particles and instant account summary",
      "Shared-element page transitions creating a seamless, app-like navigation feel",
    ],
    prototypeImage:
      "https://images.unsplash.com/photo-1663153203126-08bbadc178ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhcHAlMjBwcm90b3R5cGUlMjBkYXJrJTIwaW50ZXJmYWNlJTIwbW9ja3VwfGVufDF8fHx8MTc3MzQyNTQyN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    outcomes: [
      { label: "Onboarding Completion", value: "+67%", change: "33% → 55%" },
      { label: "NPS Score", value: "82", change: "Up from 34" },
      { label: "Time to First Transaction", value: "-53%", change: "14 min → 6.5 min" },
      { label: "Support Tickets", value: "-71%", change: "Onboarding-related" },
      { label: "App Store Rating", value: "4.8★", change: "Up from 3.2★" },
      { label: "Annual Revenue Impact", value: "+$3.1M", change: "From recovered activations" },
    ],
    learnings: [
      "Regulatory complexity doesn't excuse UX complexity. It just requires more design effort to abstract the hard parts away from the user.",
      "Micro-celebrations aren't decorative — they're a measurable conversion tool when placed at the right moments in a flow.",
      "Testing with real data instead of placeholders surfaced edge cases we never would have found otherwise. Always prototype with production-like content.",
    ],
    reflection:
      "The most impactful design work happens at the systems level, not the screen level. By reframing onboarding as a conversation, we didn't just improve metrics — we changed how the company thinks about user trust. The hardest part wasn't the design. It was convincing stakeholders that 'too simple' was the right answer.",
    improvements: [
      "Should have embedded with engineering from week one. Late-stage technical constraints forced us to simplify several animation decisions.",
      "The design system needed stronger motion opinions earlier — we lost iteration time in later phases because motion tokens were underdefined.",
      "Underestimated the impact of copy. A/B testing micro-copy variations showed the words mattered as much as the layouts.",
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
    nextProject: { slug: "forma", title: "FORMA", image: "https://images.unsplash.com/photo-1662906047226-971b484f5056?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicnV0YWxpc3QlMjBjb25jcmV0ZSUyMGFyY2hpdGVjdHVyZSUyMHNoYWRvd3xlbnwxfHx8fDE3NzM0MTAxNDN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
  },
  {
    slug: "forma",
    title: "FORMA",
    subtitle: "Unifying six products that grew up separately",
    client: "Forma Inc.",
    year: "2024",
    role: "Systems Design Lead",
    timeline: "12 months",
    team: "4 designers, 8 engineers, 2 PMs",
    platform: "Web, iOS, Android, Design Tools",
    tools: ["Figma", "Storybook", "Chromatic", "Style Dictionary", "Zeroheight"],
    color: "#06b6d4",
    heroImage: "https://images.unsplash.com/photo-1662906047226-971b484f5056?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicnV0YWxpc3QlMjBjb25jcmV0ZSUyMGFyY2hpdGVjdHVyZSUyMHNoYWRvd3xlbnwxfHx8fDE3NzM0MTAxNDN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    problem: "Six product teams, five years of independent evolution, zero shared language. 47 button variants, 23 grays, 3-week average to ship a component. The CEO called it 'six startups stitched together with duct tape.' Customers noticed — inconsistency eroded trust and made the platform feel broken.",
    context: "Forma is a B2B SaaS platform where each product surface was built by a separate team with its own component library, color palette, and conventions. My mandate: create a unified design system all six teams would actually adopt — not a component library, but an organizational operating system for design decisions.",
    constraints: ["Cannot break existing production UIs during migration — zero-downtime requirement", "Must support 6 teams with different velocity needs and technical stacks", "Token system must work across Figma, React, SwiftUI, and Kotlin simultaneously", "Full WCAG 2.1 AA compliance across all surfaces", "Must be adoptable incrementally — no big-bang migration"],
    researchInsights: [
      { title: "Autonomy within structure", detail: "Designers wanted consistency but resisted rigid control. The sweet spot: shared foundations with explicit extension points for team-specific needs." },
      { title: "Documentation is the product", detail: "Adoption correlated directly with documentation quality, not component quality. Teams with clear usage examples and guidelines shipped 2× faster." },
      { title: "Tokens matter more than components", detail: "Shared design tokens drove more visual consistency than shared components. Tokens are the DNA — components are just one expression of it." },
      { title: "Migration needs incentives", detail: "Teams adopted faster when migration reduced their workload. The sell wasn't 'use the system for consistency' — it was 'use the system to ship faster.'" },
    ],
    strategy: "Three-layer architecture: universal token foundation, shared component library, team-specific extension layer. Key insight: consistency comes from shared decisions (tokens), not shared implementations (components). Automated pipelines keep Figma and code in sync as single source of truth.",
    strategyPillars: [
      { title: "Token-First Architecture", description: "Every visual decision encoded as a semantic token. Components consume tokens, never raw values. Change a token, change everything." },
      { title: "Composable, Not Rigid", description: "Primitives that teams compose into product-specific patterns. Flexibility at the edges, consistency at the core." },
      { title: "Automated Governance", description: "CI/CD pipelines validate token usage, flag drift, and auto-generate changelogs. Compliance happens automatically, not through reviews." },
    ],
    processSteps: [
      { title: "System Audit", description: "Cataloged every component, color, and spacing value across all six products. Quantified the inconsistency — 47 button variants, 23 grays, 12 type scales." },
      { title: "Token Architecture", description: "Designed a 3-tier token system: global → alias → component. Built Style Dictionary pipelines for multi-platform output from a single source." },
      { title: "Component Taxonomy", description: "Classified everything into primitives, composites, and patterns. Defined APIs, props, and accessibility contracts for each level." },
      { title: "Migration Playbook", description: "Created phased migration plans with team-specific timelines and built codemods for automated token replacement. Made migration feel like an upgrade, not a chore." },
      { title: "Documentation", description: "Launched Zeroheight docs with live code examples, usage guidelines, do/don't patterns, and contribution workflows. Treated docs as a product with its own roadmap." },
      { title: "Governance & Adoption", description: "Built automated visual regression testing via Chromatic. Created community rituals — office hours, show-and-tells, contribution recognition." },
    ],
    wireframeImage: "https://images.unsplash.com/photo-1674509036252-5a517959a3b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1c2VyJTIwcmVzZWFyY2glMjBzdGlja3klMjBub3RlcyUyMGFmZmluaXR5JTIwbWFwcGluZ3xlbnwxfHx8fDE3NzM0MjU0MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    designSystem: [
      { label: "Tokens", description: "380+ semantic tokens across color, spacing, typography, motion, and elevation" },
      { label: "Components", description: "480+ components with 3 size variants, dark/light modes, and RTL support" },
      { label: "Platforms", description: "React, SwiftUI, Kotlin, Figma — all synced from a single token source" },
      { label: "Accessibility", description: "WCAG 2.1 AA with automated CI/CD testing on every component change" },
      { label: "Adoption", description: "6/6 teams fully migrated, 94% token compliance across all surfaces" },
    ],
    designSystemImage: "https://images.unsplash.com/photo-1546414701-81cc6963c67f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicnV0YWxpc3QlMjBhcmNoaXRlY3R1cmUlMjBjb25jcmV0ZSUyMGdlb21ldHJpYyUyMG1pbmltYWx8ZW58MXx8fHwxNzczNDI1NDM1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    prototypeHighlights: ["Live Figma-to-code token syncing via Style Dictionary — change once, propagate everywhere", "Component playground with real-time prop manipulation and live code output", "Automated visual regression testing catching drift before it reaches production", "Contribution workflow with clear governance guardrails and automated validation"],
    prototypeImage: "https://images.unsplash.com/photo-1754666104720-28f18a9130e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ24lMjB0b2tlbnMlMjBjb2xvciUyMHBhbGV0dGUlMjB0eXBvZ3JhcGh5JTIwc3BlY2ltZW58ZW58MXx8fHwxNzczNDI1NDI5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    outcomes: [
      { label: "Design Velocity", value: "+120%", change: "Component-to-production time" },
      { label: "Components", value: "480+", change: "Across all platforms" },
      { label: "Team Adoption", value: "6/6", change: "Full migration in 8 months" },
      { label: "Token Compliance", value: "94%", change: "Automated enforcement" },
      { label: "Accessibility", value: "AA+", change: "WCAG 2.1 across all products" },
      { label: "Cost Savings", value: "$1.8M/yr", change: "Eliminated duplication" },
    ],
    learnings: ["If using the system is harder than building custom, the system has already failed. Adoption is a UX problem, not a governance problem.", "Automated enforcement beats manual code reviews every time. Make compliance the path of least resistance.", "The best design systems feel like creative accelerators, not constraints. If designers feel slowed down, the system needs work."],
    reflection: "A design system isn't a component library — it's an organizational operating system. The human challenges were harder than the technical ones: navigating 'whose button wins' politics, building trust that the system would evolve with team needs, resisting the urge to over-prescribe. It succeeded because we treated adoption as a product problem, not a compliance problem.",
    improvements: ["Should have started with a beta program of 2 willing teams before attempting full org adoption.", "Motion token system was underdeveloped — teams ended up creating ad-hoc animation patterns that diverged.", "Needed more community-building rituals among system consumers. Cultural adoption is as important as technical adoption."],
    nextProject: { slug: "luxe", title: "LUXE", image: "https://images.unsplash.com/photo-1771955216611-0a826d819978?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBkYXJrJTIwcHJvZHVjdCUyMHN0aWxsJTIwbGlmZSUyMG1pbmltYWx8ZW58MXx8fHwxNzczNDEwMTQ0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
  },
  {
    slug: "luxe",
    title: "LUXE",
    subtitle: "Where editorial storytelling meets commerce",
    client: "Maison Luxe",
    year: "2024",
    role: "Lead Product Designer",
    timeline: "5 months",
    team: "2 designers, 3 engineers, 1 content strategist",
    platform: "Web (Shopify Plus), Mobile Web",
    tools: ["Figma", "Framer", "Shopify Liquid", "GSAP", "Contentful"],
    color: "#f0abfc",
    heroImage: "https://images.unsplash.com/photo-1771955216611-0a826d819978?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBkYXJrJTIwcHJvZHVjdCUyMHN0aWxsJTIwbGlmZSUyMG1pbmltYWx8ZW58MXx8fHwxNzczNDEwMTQ0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    problem: "Maison Luxe's online store converted 40% below luxury benchmarks — a product catalog with a checkout button, completely disconnected from the curated, story-driven experience their boutiques are known for. The brand was losing credibility online.",
    context: "Maison Luxe operates 12 boutiques across Europe and Japan, known for editorial curation and white-glove service. Their digital presence was an afterthought managed by a single developer. My brief: translate the boutique experience to the web — not by mimicking it, but by finding digital equivalents for what makes their stores feel special.",
    constraints: ["Must build on Shopify Plus — no custom backend", "Page load under 2.5 seconds despite rich media and animation", "Non-technical merchandising team must be able to update content independently via Contentful", "Product photography must be the visual hero — UI can't compete with it", "Must integrate with existing ERP and inventory systems"],
    researchInsights: [
      { title: "Luxury buying is emotional", detail: "Story-driven product pages converted 2.4x better than feature-focused ones." },
      { title: "White space signals premium", detail: "Users associated generous negative space with higher perceived quality." },
      { title: "Discovery > Search", detail: "Luxury shoppers browse for inspiration. Curated journeys outperformed category navigation." },
      { title: "Post-purchase matters", detail: "Post-purchase experience influenced repurchase rate by 34%." },
    ],
    strategy: "E-commerce reimagined as editorial magazine — every product is a story. Commerce mechanics woven seamlessly into content, deliberately blurring the line between reading and shopping.",
    strategyPillars: [
      { title: "Editorial Commerce", description: "Every product page is a story. Context, craft, and heritage precede price." },
      { title: "Cinematic Pacing", description: "Scroll-driven animations, full-bleed photography, and generous whitespace." },
      { title: "Seamless Conversion", description: "Purchase CTAs appear contextually within the editorial flow." },
    ],
    processSteps: [
      { title: "Brand Immersion", description: "2 weeks in boutiques observing customer behavior and interviewing store associates." },
      { title: "Editorial Framework", description: "5 flexible page templates blending storytelling with commerce for the merchandising team." },
      { title: "Visual Design", description: "Dark canvas, generous white space, cinematic typography. Photography as hero." },
      { title: "Interaction Design", description: "Scroll-driven reveals, hover micro-interactions, and premium page transitions." },
      { title: "Shopify Customization", description: "Custom sections, metafields, and GSAP-powered animations pushing Shopify Plus limits." },
      { title: "Post-Purchase", description: "Redesigned order confirmation, shipping emails, and return flow for luxury continuity." },
    ],
    wireframeImage: "https://images.unsplash.com/photo-1609605348579-3123e3d40eb8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZGl0b3JpYWwlMjBtYWdhemluZSUyMGxheW91dCUyMGRlc2lnbiUyMHR5cG9ncmFwaHl8ZW58MXx8fHwxNzczNDI1NDMxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    designSystem: [
      { label: "Typography", description: "Custom serif headlines, monospace details, generous type scale" },
      { label: "Layout", description: "12-column grid with intentional asymmetry and full-bleed moments" },
      { label: "Color", description: "Near-black with warm cream accents. Photography drives color" },
      { label: "Motion", description: "GSAP scroll-triggered animations, parallax, reveal transitions" },
      { label: "Templates", description: "5 editorial templates for merchandising team in Contentful" },
    ],
    designSystemImage: "https://images.unsplash.com/photo-1738247999551-6bee2ce9bc58?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBmYXNoaW9uJTIwZWRpdG9yaWFsJTIwcGhvdG9ncmFwaHklMjBkYXJrJTIwbW9vZHl8ZW58MXx8fHwxNzczNDI1NDMwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    prototypeHighlights: ["Full-bleed editorial product pages with scroll-driven parallax", "Contextual 'Add to Bag' within the editorial flow", "Ambient hover states with subtle perspective shifts", "Cinematic shared-element page transitions"],
    prototypeImage: "https://images.unsplash.com/photo-1771955216611-0a826d819978?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBkYXJrJTIwcHJvZHVjdCUyMHN0aWxsJTIwbGlmZSUyMG1pbmltYWx8ZW58MXx8fHwxNzczNDEwMTQ0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    outcomes: [
      { label: "Conversion", value: "+89%", change: "From 1.2% to 2.3%" },
      { label: "AOV", value: "+34%", change: "Editorial upsell effect" },
      { label: "Return Rate", value: "3.2x", change: "Content-driven engagement" },
      { label: "Bounce Rate", value: "-47%", change: "On product pages" },
      { label: "Load Time", value: "1.8s", change: "Under 2.5s target" },
      { label: "Revenue", value: "+$2.1M", change: "First quarter post-launch" },
    ],
    learnings: ["Luxury e-commerce is closer to magazine design than traditional commerce.", "Performance and aesthetics don't have to conflict.", "The merchandising team's content independence was crucial for sustained impact."],
    reflection: "Great design creates feeling. The website works because it respects the same principles as their boutiques: curation over abundance, story over spec sheet, atmosphere over efficiency. The moment I knew we'd succeeded was when the creative director said it felt like 'walking through the shop, but better.'",
    improvements: ["Would have designed mobile-specific experience, not just responsive.", "Post-purchase emails deserved the same editorial treatment.", "Template system needs more flexibility for campaign-specific layouts."],
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
    nextProject: { slug: "meridian", title: "MERIDIAN", image: "https://images.unsplash.com/photo-1663000803107-132fb64cc148?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwbW9vZHklMjBiYW5raW5nJTIwYXBwJTIwbW9iaWxlJTIwaW50ZXJmYWNlfGVufDF8fHx8MTc3MzQxMDE0MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
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
      className="w-full origin-top"
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