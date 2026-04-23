"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

type Phase = "idle" | "q1" | "q2" | "q3" | "scanning" | "result";

interface Answer {
  label: string;
  value: string;
}

const roles: Answer[] = [
  { label: "Visual Designer", value: "visual-designer" },
  { label: "UX Researcher", value: "ux-researcher" },
  { label: "Frontend Developer", value: "frontend-dev" },
  { label: "Product Manager", value: "product-manager" },
  { label: "Copywriter", value: "copywriter" },
  { label: "Brand Strategist", value: "brand-strategist" },
];

const tenures: Answer[] = [
  { label: "< 2 years", value: "junior" },
  { label: "2 – 5 years", value: "mid" },
  { label: "5 – 10 years", value: "senior" },
  { label: "10+ years", value: "veteran" },
  { label: "I've lost count", value: "ancient" },
];

const tools: Answer[] = [
  { label: "Figma", value: "figma" },
  { label: "VS Code", value: "vscode" },
  { label: "Google Docs", value: "gdocs" },
  { label: "Post-it Notes", value: "postits" },
  { label: "My Intuition", value: "intuition" },
  { label: "A Whiteboard", value: "whiteboard" },
];

const roleScores: Record<string, number> = {
  "visual-designer": 78,
  "ux-researcher": 52,
  "frontend-dev": 71,
  "product-manager": 64,
  "copywriter": 88,
  "brand-strategist": 45,
};

const tenureModifiers: Record<string, number> = {
  junior: 8,
  mid: 3,
  senior: -4,
  veteran: -9,
  ancient: -14,
};

const toolModifiers: Record<string, number> = {
  figma: 5,
  vscode: 3,
  gdocs: 10,
  postits: -12,
  intuition: -18,
  whiteboard: -8,
};

const roleHeadlines: Record<string, Record<string, string>> = {
  "visual-designer": {
    critical: "Your pixels have been quantified.",
    high: "Layout generation is 4 seconds away.",
    warning: "Your taste is measurable. That's the problem.",
    moderate: "Your eye is still faster than the model.",
    low: "Design instinct: not yet tokenizable.",
    nominal: "You design in feelings. They can't parse that.",
  },
  "ux-researcher": {
    critical: "Surveys auto-generate now.",
    high: "Synthetic user panels are trending.",
    warning: "Your empathy has a half-life.",
    moderate: "Humans still confuse the models. You study that.",
    low: "The messy middle of research resists compression.",
    nominal: "You read between the lines. There's no API for that.",
  },
  "frontend-dev": {
    critical: "Your components are one prompt away.",
    high: "Vibe coding is eating your lunch.",
    warning: "The boilerplate is gone. What's left is you.",
    moderate: "Debugging intuition still requires a pulse.",
    low: "Your architecture decisions defy pattern matching.",
    nominal: "You write code that makes other code nervous.",
  },
  "product-manager": {
    critical: "Roadmaps are a structured data problem now.",
    high: "Stakeholder alignment is being A/B tested.",
    warning: "Your job is 60% meetings. Meetings are compressible.",
    moderate: "Cross-functional chaos is hard to simulate.",
    low: "You navigate politics. Models navigate tokens.",
    nominal: "Your superpower is saying no. Machines say yes to everything.",
  },
  "copywriter": {
    critical: "Your words are statistically average.",
    high: "Brand voice is a fine-tuning parameter now.",
    warning: "The first draft is already written. You're editing a machine.",
    moderate: "Your weird phrasing is a feature, not a bug.",
    low: "You write with scars. That's hard to train.",
    nominal: "Your copy has a heartbeat. Models have tokens.",
  },
  "brand-strategist": {
    critical: "Strategy decks are a template problem.",
    high: "Positioning frameworks are well-documented.",
    warning: "Your insights are one dataset away from obvious.",
    moderate: "Cultural intuition resists quantification.",
    low: "You see patterns in human behavior. That's still analog.",
    nominal: "You read rooms, not data. Untrainable.",
  },
};

const roleDescriptions: Record<string, Record<string, string>> = {
  "visual-designer": {
    critical: "Image generation models now produce production-grade layouts in seconds. Your core output — visual composition — is the most automated creative function.",
    high: "Style transfer, auto-layout, and generative UI have narrowed the gap. The craft is still yours, but the floor is rising fast.",
    warning: "Your design decisions are increasingly replicable, but the nuance of brand-specific visual language still requires a trained eye.",
    moderate: "You operate in a space where subjective judgment and cultural context still matter more than pixel precision.",
    low: "Your process involves ambiguity, iteration, and client psychology that resists clean automation.",
    nominal: "Your design practice is deeply intuitive, idiosyncratic, and rooted in lived experience. Models can approximate the output, not the thinking.",
  },
  "ux-researcher": {
    critical: "Automated survey generation, synthetic user testing, and AI-driven analytics are replacing the discovery phase.",
    high: "Pattern recognition in user behavior is now a machine strength. Your qualitative edge is narrowing.",
    warning: "Quantitative research is largely automatable. Your value lives in the qualitative — for now.",
    moderate: "The human contradictions you study are exactly what makes your subjects hard to model.",
    low: "You deal in context, emotion, and the unsaid. These are the last frontier of automation.",
    nominal: "Your research instinct — knowing which question to ask next — is irreducibly human.",
  },
  "frontend-dev": {
    critical: "Code generation from prompts and screenshots is production-ready. Your implementation speed is no longer a differentiator.",
    high: "Component generation, styling, and even architecture suggestions are rapidly improving. Your debugging intuition is the remaining moat.",
    warning: "Boilerplate and standard patterns are gone. Your value is in the edge cases and integration complexity.",
    moderate: "System-level thinking and cross-domain debugging still require human context-switching.",
    low: "Your codebase knowledge and architectural instincts are accumulated, not generated.",
    nominal: "You build systems that reflect organizational complexity. That requires politics, not prompts.",
  },
  "product-manager": {
    critical: "Feature prioritization, spec writing, and roadmap generation are structured problems with structured solutions.",
    high: "Data-driven product decisions are increasingly automatable. Your stakeholder management is the remaining variable.",
    warning: "The analytical half of your job is compressible. The political half is not — yet.",
    moderate: "You operate at the intersection of business logic, user needs, and team dynamics. That's a messy Venn diagram.",
    low: "Your ability to navigate ambiguity, manage conflicting priorities, and make judgment calls under uncertainty is deeply human.",
    nominal: "You translate chaos into direction. That requires reading people, not data.",
  },
  "copywriter": {
    critical: "Large language models produce fluent, on-brand copy at scale. Your first-draft advantage is gone.",
    high: "Brand voice calibration and tone matching are fine-tuning problems now. Your editorial judgment is the remaining edge.",
    warning: "The volume game is lost. Your value is in the ideas behind the words, not the words themselves.",
    moderate: "Your writing carries subtext, cultural references, and emotional precision that models approximate but don't originate.",
    low: "You write from lived experience and hard-won perspective. That's training data nobody else has.",
    nominal: "Your voice is yours. It was shaped by failure, taste, and stubbornness — none of which scale.",
  },
  "brand-strategist": {
    critical: "Competitive analysis, market positioning, and brand frameworks are well-documented patterns.",
    high: "Strategic insights that once required months of research now surface in minutes. Your synthesis skills are being compressed.",
    warning: "The research phase is automatable. The leap from data to insight still requires human pattern-matching.",
    moderate: "You work in the space between data and meaning. That gap is shrinking but still very real.",
    low: "Cultural reading, trend intuition, and the ability to sense what's next are analog skills in a digital age.",
    nominal: "You operate on instinct refined by years of watching humans be irrational. No model has that dataset.",
  },
};

const toolQuips: Record<string, string> = {
  figma: "Your primary tool already has AI features. The call is coming from inside the house.",
  vscode: "Copilot is your coworker now. It doesn't take breaks.",
  gdocs: "Your main tool is a text box. So is ChatGPT.",
  postits: "Analog tools resist digitization. Your chaos is your moat.",
  intuition: "You can't export intuition to a .json file. That's your advantage.",
  whiteboard: "Spatial thinking on physical surfaces is the opposite of a prompt. Stay messy.",
};

const tenureQuips: Record<string, string> = {
  junior: "Early career: maximum adaptability, minimum institutional knowledge. The machines learn fast too.",
  mid: "Mid-career: you've built enough pattern recognition to be dangerous, but not enough to be irreplaceable.",
  senior: "Senior: your accumulated judgment is your moat. It took years to build and can't be fine-tuned in hours.",
  veteran: "Veteran: you've survived enough industry shifts to know this one is different — but also that you'll adapt.",
  ancient: "Beyond counting: you are the institutional memory. You've seen tools come and go. You'll see this one too.",
};

const recommendations: Record<string, Record<string, string>> = {
  "visual-designer": {
    critical: "Suggested action: stop designing screens. Start designing systems that screens can't contain.",
    high: "Suggested action: move upstream. Art direction is harder to automate than execution.",
    warning: "Suggested action: invest in motion and interaction — the parts that still need a human clock.",
    moderate: "Suggested action: keep making weird stuff. Weird is expensive to automate.",
    low: "Suggested action: trust your instincts louder. They're your best feature.",
    nominal: "Suggested action: teach others. Your perspective is the product now.",
  },
  "ux-researcher": {
    critical: "Suggested action: go deeper. The surface-level insights are automated. The deep ones aren't.",
    high: "Suggested action: own the synthesis. Anyone can gather data. Meaning-making is still manual.",
    warning: "Suggested action: get closer to users. Proximity is your competitive edge.",
    moderate: "Suggested action: embrace the contradictions. Messy data is your territory.",
    low: "Suggested action: stay curious. Curiosity doesn't have a model architecture.",
    nominal: "Suggested action: write the questions no one thought to ask. That's still magic.",
  },
  "frontend-dev": {
    critical: "Suggested action: move to systems architecture. The higher up the stack, the safer you are.",
    high: "Suggested action: own the weird edge cases. The 80% is automated. Be the 20%.",
    warning: "Suggested action: build taste into your code. Beautiful systems resist templating.",
    moderate: "Suggested action: get closer to the product. Technical empathy is irreplaceable.",
    low: "Suggested action: keep building things that surprise you. That's the test.",
    nominal: "Suggested action: you're the glue. Lean into the human layer of engineering.",
  },
  "product-manager": {
    critical: "Suggested action: become the decision-maker, not the decision-documenter.",
    high: "Suggested action: own the stakeholder relationships. Diplomacy doesn't scale.",
    warning: "Suggested action: get better at saying no. AI says yes to everything.",
    moderate: "Suggested action: stay in the mess. Clean processes get automated. Messy ones need you.",
    low: "Suggested action: trust your gut more. Data-informed, not data-determined.",
    nominal: "Suggested action: keep being the translator. Between humans, not systems.",
  },
  "copywriter": {
    critical: "Suggested action: stop writing copy. Start writing culture.",
    high: "Suggested action: own the editorial voice. Models can match tone, not create it.",
    warning: "Suggested action: write the things that make you uncomfortable. That's where the value is.",
    moderate: "Suggested action: lean into your weirdness. The algorithm optimizes for average.",
    low: "Suggested action: keep failing interestingly. Your best work comes from the misses.",
    nominal: "Suggested action: be more you. That's the one thing they can't generate.",
  },
  "brand-strategist": {
    critical: "Suggested action: move from frameworks to instinct. The templates are commoditized.",
    high: "Suggested action: be in the room. Physical presence and reading energy don't have an API.",
    warning: "Suggested action: go deeper on culture. The surface patterns are mapped. The undercurrents aren't.",
    moderate: "Suggested action: trust the hunches. They're compressed experience, not guesswork.",
    low: "Suggested action: stay close to the humans you serve. Understanding them is the whole job.",
    nominal: "Suggested action: keep watching people. You see what dashboards can't.",
  },
};

interface Result {
  score: number;
  status: string;
  statusColor: string;
  headline: string;
  body: string;
  toolNote: string;
  tenureNote: string;
  recommendation: string;
}

function getScoreTier(score: number): string {
  if (score >= 85) return "critical";
  if (score >= 75) return "high";
  if (score >= 62) return "warning";
  if (score >= 48) return "moderate";
  if (score >= 35) return "low";
  return "nominal";
}

function getStatusLabel(tier: string): { status: string; statusColor: string } {
  switch (tier) {
    case "critical": return { status: "CRITICAL", statusColor: "text-glitch-red" };
    case "high": return { status: "HIGH RISK", statusColor: "text-glitch-red/80" };
    case "warning": return { status: "WARNING", statusColor: "text-[#f0a030]" };
    case "moderate": return { status: "MODERATE", statusColor: "text-[#f0a030]/70" };
    case "low": return { status: "LOW RISK", statusColor: "text-glitch-cyan" };
    default: return { status: "NOMINAL", statusColor: "text-glitch-cyan" };
  }
}

function computeResult(role: string, tenure: string, tool: string): Result {
  const raw = roleScores[role] + tenureModifiers[tenure] + toolModifiers[tool];
  const score = Math.max(12, Math.min(97, raw));
  const tier = getScoreTier(score);
  const { status, statusColor } = getStatusLabel(tier);

  return {
    score,
    status,
    statusColor,
    headline: roleHeadlines[role]?.[tier] ?? "Signal unclear.",
    body: roleDescriptions[role]?.[tier] ?? "Unable to compute assessment.",
    toolNote: toolQuips[tool] ?? "",
    tenureNote: tenureQuips[tenure] ?? "",
    recommendation: recommendations[role]?.[tier] ?? "Suggested action: stay human.",
  };
}

const scanLines = [
  "initializing scan protocol...",
  "analyzing neural patterns...",
  "cross-referencing skill matrix...",
  "checking job board saturation...",
  "computing emotional labor index...",
  "factoring existential dread coefficient...",
  "calibrating replacement probability...",
  "scan complete.",
];

export default function ReplacementScanner() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [role, setRole] = useState("");
  const [tenure, setTenure] = useState("");
  const [tool, setTool] = useState("");
  const [scanProgress, setScanProgress] = useState(0);
  const [visibleLines, setVisibleLines] = useState(0);
  const [resultGlitch, setResultGlitch] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [phase, visibleLines, scrollToBottom]);

  useEffect(() => {
    if (phase !== "scanning") return;

    setScanProgress(0);
    setVisibleLines(0);

    const lineInterval = setInterval(() => {
      setVisibleLines((prev) => {
        if (prev >= scanLines.length) {
          clearInterval(lineInterval);
          return prev;
        }
        return prev + 1;
      });
    }, 400);

    const progressInterval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        const jump = Math.random() * 18 + 2;
        return Math.min(100, prev + jump);
      });
    }, 300);

    const finishTimeout = setTimeout(() => {
      clearInterval(lineInterval);
      clearInterval(progressInterval);
      setScanProgress(100);
      setVisibleLines(scanLines.length);

      setTimeout(() => {
        setResultGlitch(true);
        setTimeout(() => {
          setResult(computeResult(role, tenure, tool));
          setPhase("result");
          setTimeout(() => setResultGlitch(false), 200);
        }, 200);
      }, 600);
    }, 3600);

    return () => {
      clearInterval(lineInterval);
      clearInterval(progressInterval);
      clearTimeout(finishTimeout);
    };
  }, [phase, role, tenure, tool]);

  const reset = () => {
    setPhase("idle");
    setRole("");
    setTenure("");
    setTool("");
    setScanProgress(0);
    setVisibleLines(0);
    setResult(null);
    setResultGlitch(false);
  };

  const roleLabel = roles.find((r) => r.value === role)?.label;
  const tenureLabel = tenures.find((t) => t.value === tenure)?.label;
  const toolLabel = tools.find((t) => t.value === tool)?.label;

  return (
    <section className="relative bg-[#0a0a0a] overflow-hidden py-16 md:py-24">
      {/* Scan lines */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.12) 2px, rgba(0,0,0,0.12) 4px)",
          animation: "hero-scanline-drift 0.4s linear infinite",
        }}
      />

      {/* Noise */}
      <div
        className="pointer-events-none absolute inset-0 z-10 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "128px 128px",
          animation: "hero-noise-drift 0.5s steps(3) infinite",
        }}
      />

      {/* Corruption */}
      <div
        className="pointer-events-none absolute w-20 h-2 bg-glitch-cyan/15 z-10"
        style={{ top: "12%", right: "15%", animation: "hero-corruption-1 7s step-end infinite" }}
      />
      <div
        className="pointer-events-none absolute w-14 h-3 bg-glitch-red/10 z-10"
        style={{ bottom: "18%", left: "10%", animation: "hero-corruption-2 8s step-end infinite" }}
      />

      <div className="relative z-20 max-w-[720px] mx-auto px-5 md:px-10">
        {/* Section header */}
        <div className="text-center mb-10 md:mb-14">
          <span className="inline-block font-mono text-[10px] tracking-[0.25em] uppercase text-glitch-cyan/60 mb-4">
            diagnostic_tool
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-white tracking-tight">
            How replaceable are you?
          </h2>
          <p className="font-mono text-[11px] text-white/30 tracking-wide mt-3">
            An honest assessment. Takes 10 seconds. Hurts for longer.
          </p>
        </div>

        {/* Terminal window */}
        <div className="relative border border-white/10 bg-[#0d0d0d]">
          {/* Terminal title bar */}
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/10 bg-white/[0.02]">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-glitch-red/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#f0a030]/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-glitch-cyan/60" />
            </div>
            <span className="font-mono text-[10px] text-white/20 tracking-wider ml-2">
              replacement_scan.exe
            </span>
            <span
              className="ml-auto font-mono text-[9px] text-white/15 tracking-wider"
              style={{ animation: "glitch-flicker 4s step-end infinite" }}
            >
              {phase === "scanning" ? "SCANNING..." : phase === "result" ? "COMPLETE" : "READY"}
            </span>
          </div>

          {/* Terminal body */}
          <div
            ref={terminalRef}
            className="p-5 md:p-6 min-h-[320px] max-h-[480px] overflow-y-auto font-mono text-[12px] md:text-[13px] leading-relaxed"
          >
            {/* IDLE */}
            {phase === "idle" && (
              <div className="space-y-4">
                <p className="text-white/30">
                  <span className="text-glitch-cyan/60">system</span> &gt; replacement probability scanner v2.4
                </p>
                <p className="text-white/30">
                  <span className="text-glitch-cyan/60">system</span> &gt; this tool analyzes your professional profile against current AI capability indices.
                </p>
                <p className="text-white/40">
                  <span className="text-glitch-cyan/60">system</span> &gt; results may cause existential discomfort.
                </p>
                <button
                  onClick={() => setPhase("q1")}
                  className="group mt-4 inline-flex items-center gap-2 border border-glitch-cyan/30 text-glitch-cyan px-5 py-2.5 hover:bg-glitch-cyan/10 transition-colors"
                >
                  <span className="inline-block w-2 h-2 border border-glitch-cyan/60 group-hover:bg-glitch-cyan/40 transition-colors" />
                  INITIATE SCAN
                </button>
              </div>
            )}

            {/* Q1 — Role */}
            {(phase === "q1" || phase === "q2" || phase === "q3" || phase === "scanning" || phase === "result") && (
              <div className="space-y-3 mb-6">
                <p className="text-white/50">
                  <span className="text-glitch-cyan/60">[01/03]</span> select primary function:
                </p>
                {phase === "q1" ? (
                  <div className="grid grid-cols-2 gap-2">
                    {roles.map((r) => (
                      <button
                        key={r.value}
                        onClick={() => {
                          setRole(r.value);
                          setPhase("q2");
                        }}
                        className="text-left px-3 py-2 border border-white/10 text-white/50 hover:border-glitch-cyan/40 hover:text-glitch-cyan hover:bg-glitch-cyan/5 transition-all text-[11px] md:text-[12px]"
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-glitch-cyan/80 pl-4 border-l border-glitch-cyan/20">
                    → {roleLabel}
                  </p>
                )}
              </div>
            )}

            {/* Q2 — Tenure */}
            {(phase === "q2" || phase === "q3" || phase === "scanning" || phase === "result") && (
              <div className="space-y-3 mb-6">
                <p className="text-white/50">
                  <span className="text-glitch-cyan/60">[02/03]</span> years in service:
                </p>
                {phase === "q2" ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {tenures.map((t) => (
                      <button
                        key={t.value}
                        onClick={() => {
                          setTenure(t.value);
                          setPhase("q3");
                        }}
                        className="text-left px-3 py-2 border border-white/10 text-white/50 hover:border-glitch-cyan/40 hover:text-glitch-cyan hover:bg-glitch-cyan/5 transition-all text-[11px] md:text-[12px]"
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-glitch-cyan/80 pl-4 border-l border-glitch-cyan/20">
                    → {tenureLabel}
                  </p>
                )}
              </div>
            )}

            {/* Q3 — Tool */}
            {(phase === "q3" || phase === "scanning" || phase === "result") && (
              <div className="space-y-3 mb-6">
                <p className="text-white/50">
                  <span className="text-glitch-cyan/60">[03/03]</span> primary tool of choice:
                </p>
                {phase === "q3" ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {tools.map((t) => (
                      <button
                        key={t.value}
                        onClick={() => {
                          setTool(t.value);
                          setPhase("scanning");
                        }}
                        className="text-left px-3 py-2 border border-white/10 text-white/50 hover:border-glitch-cyan/40 hover:text-glitch-cyan hover:bg-glitch-cyan/5 transition-all text-[11px] md:text-[12px]"
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-glitch-cyan/80 pl-4 border-l border-glitch-cyan/20">
                    → {toolLabel}
                  </p>
                )}
              </div>
            )}

            {/* Scanning */}
            {phase === "scanning" && (
              <div className="space-y-3 mt-4">
                <div className="h-px bg-white/10 mb-4" />
                {scanLines.slice(0, visibleLines).map((line, i) => (
                  <p
                    key={i}
                    className={`text-[11px] ${
                      i === scanLines.length - 1
                        ? "text-glitch-cyan"
                        : "text-white/30"
                    }`}
                  >
                    &gt; {line}
                  </p>
                ))}

                {/* Progress bar */}
                <div className="mt-4 h-1 bg-white/5 overflow-hidden">
                  <div
                    className="h-full bg-glitch-cyan/60 transition-all duration-300"
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
                <p className="text-[10px] text-white/20 tracking-wider">
                  {Math.round(scanProgress)}% complete
                </p>

                {/* Glitch flash before result */}
                {resultGlitch && (
                  <div className="fixed inset-0 z-50 pointer-events-none">
                    <div className="absolute inset-0 bg-glitch-cyan/5 mix-blend-screen" />
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "repeating-linear-gradient(0deg, transparent 0px, transparent 1px, rgba(255,255,255,0.04) 1px, rgba(255,255,255,0.04) 2px)",
                      }}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Result */}
            {phase === "result" && result && (
              <div className="mt-4 space-y-5">
                <div className="h-px bg-white/10" />

                {/* Score display */}
                <div className="flex items-start gap-6">
                  <div className="shrink-0">
                    <p className="text-[10px] text-white/30 tracking-wider uppercase mb-1">
                      replacement index
                    </p>
                    <p
                      className="font-display text-[64px] md:text-[80px] leading-none text-white tracking-tight"
                      style={{ animation: "hero-glitch-text 4s ease-in-out infinite" }}
                    >
                      {result.score}
                      <span className="text-[32px] md:text-[40px] text-white/40">%</span>
                    </p>
                  </div>
                  <div className="pt-2">
                    <span
                      className={`inline-block font-mono text-[10px] tracking-[0.2em] uppercase ${result.statusColor} border px-2.5 py-1 mb-3`}
                      style={{
                        borderColor: "currentColor",
                        opacity: 0.8,
                        animation: "glitch-flicker 3s step-end infinite",
                      }}
                    >
                      status: {result.status}
                    </span>
                    <p className="font-mono text-[13px] text-white/70 leading-relaxed">
                      {result.headline}
                    </p>
                  </div>
                </div>

                {/* Assessment text */}
                <div className="border-l border-white/10 pl-4 space-y-3">
                  <p className="text-[12px] text-white/40 leading-relaxed">
                    {result.body}
                  </p>
                  <p className="text-[11px] text-white/25 leading-relaxed">
                    {result.toolNote}
                  </p>
                  <p className="text-[11px] text-white/25 leading-relaxed">
                    {result.tenureNote}
                  </p>
                  <p className="text-[11px] text-glitch-cyan/60 italic pt-1">
                    {result.recommendation}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 bg-glitch-cyan text-[#0a0a0a] font-mono text-[11px] font-semibold tracking-wider uppercase px-5 py-2.5 hover:bg-glitch-cyan/80 transition-colors"
                  >
                    Cope responsibly →
                  </Link>
                  <button
                    onClick={reset}
                    className="font-mono text-[11px] tracking-wider text-white/30 hover:text-white/60 transition-colors underline underline-offset-2"
                  >
                    run_again
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-center font-mono text-[9px] text-white/15 tracking-wider mt-4">
          * results calibrated against gpt-5.4-medium. accuracy not guaranteed. feelings not considered.
        </p>
      </div>
    </section>
  );
}
