import Header from "@/components/Header";
import AnnouncementBar from "@/components/AnnouncementBar";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";

const timeline = [
  { year: "2023", event: "AI starts designing logos. Designers start drinking." },
  { year: "2024", event: "First wave of &ldquo;prompt engineers&rdquo; appear. We launch Human&trade;." },
  { year: "2025", event: "Our mugs outsell Figma subscriptions in 3 states." },
  { year: "2026", event: "Still here. Still human. Probably." },
];

const values = [
  {
    label: "human_made",
    title: "Stubbornly Handcrafted",
    body: "Every product is designed, produced, and shipped by actual humans. Not because it's efficient — because it matters.",
  },
  {
    label: "honest_humor",
    title: "Gallows Humor, Real Talk",
    body: "We cope with the absurdity of automation through sharp satire. Every tagline is a mirror.",
  },
  {
    label: "anti_optimization",
    title: "Against Optimization",
    body: "We refuse to A/B test our soul. Imperfection is the point. Human touch is the product.",
  },
  {
    label: "community_signal",
    title: "Signal Over Noise",
    body: "Wearing Human™ is a quiet signal: I was here. I made things. I still do.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <AnnouncementBar />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative bg-[#0a0a0a] overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)",
              animation: "hero-scanline-drift 0.4s linear infinite",
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              backgroundSize: "128px 128px",
              animation: "hero-noise-drift 0.5s steps(3) infinite",
            }}
          />
          <div
            className="pointer-events-none absolute left-0 right-0 h-[2px] bg-glitch-cyan/40 z-10"
            style={{ animation: "hero-hbar 8s ease-in-out infinite" }}
          />
          <div className="relative z-10 max-w-[1320px] mx-auto px-6 md:px-10 py-20 md:py-32">
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-glitch-cyan/70 block mb-3">
              origin_signal
            </span>
            <h1
              className="font-display text-4xl md:text-6xl lg:text-7xl text-white tracking-tight max-w-3xl"
              style={{ animation: "hero-glitch-text 8s ease-in-out infinite" }}
            >
              We started this brand<br className="hidden md:block" /> because we got scared.
            </h1>
            <p className="font-body text-base md:text-lg text-white/40 mt-5 max-w-xl leading-relaxed">
              Human™ was born in the gap between &ldquo;AI will never replace designers&rdquo; and
              watching it redesign a logo in 4 seconds. We make things by hand because
              the hands still work.
            </p>
          </div>
        </section>

        {/* Mission split */}
        <section className="relative max-w-[1320px] mx-auto px-6 md:px-10 py-16 md:py-24">
          <div
            className="pointer-events-none absolute top-16 right-8 w-20 h-2 bg-glitch-cyan-on-light/12"
            style={{ animation: "hero-corruption-2 7s step-end infinite" }}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
            <div>
              <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-glitch-cyan-on-light block mb-4">
                the_mission
              </span>
              <h2 className="font-display text-3xl md:text-4xl text-foreground tracking-tight leading-tight">
                Objects for the<br />beautifully redundant.
              </h2>
              <p className="font-body text-base text-muted mt-4 leading-relaxed">
                Every mug, hoodie, and sticker is a small act of defiance. A reminder that
                the human touch — messy, slow, emotional — is worth preserving. We don&apos;t
                compete with machines. We make things machines can&apos;t feel.
              </p>
              <p className="font-body text-base text-muted mt-3 leading-relaxed">
                This isn&apos;t anti-technology. It&apos;s pro-humanity. We use AI. We also laugh at it.
                Then we ship you something made with hands that tremble slightly from
                too much coffee.
              </p>
            </div>
            <div className="relative aspect-square bg-[#f2f2f2] overflow-hidden">
              <Image
                src="/product-pixels-hoodie.png"
                alt="Human™ Hoodie"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.02) 2px, rgba(0,0,0,0.02) 4px)",
                }}
              />
              <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-foreground/20" />
              <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-foreground/20" />
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="relative bg-[#0a0a0a] overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0 opacity-50"
            style={{
              background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)",
            }}
          />
          <div className="relative z-10 max-w-[1320px] mx-auto px-6 md:px-10 py-16 md:py-24">
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-glitch-cyan/50 block mb-4">
              core_values
            </span>
            <h2 className="font-display text-3xl md:text-4xl text-white tracking-tight mb-12">
              What we believe
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
              {values.map((v, i) => (
                <div key={v.label} className="border border-white/8 p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-mono text-[10px] text-glitch-cyan/50 tracking-wider">
                      0{i + 1}
                    </span>
                    <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-white/30">
                      {v.label}
                    </span>
                  </div>
                  <h3 className="font-display text-xl text-white tracking-tight mb-2">
                    {v.title}
                  </h3>
                  <p className="font-body text-sm text-white/40 leading-relaxed">
                    {v.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="max-w-[1320px] mx-auto px-6 md:px-10 py-16 md:py-24">
          <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-glitch-cyan-on-light block mb-4">
            event_log
          </span>
          <h2 className="font-display text-3xl md:text-4xl text-foreground tracking-tight mb-12">
            How we got here
          </h2>
          <div className="space-y-0">
            {timeline.map((t, i) => (
              <div
                key={t.year}
                className="flex items-start gap-6 md:gap-10 py-6 border-b border-border group"
              >
                <span className="font-mono text-[13px] md:text-[15px] text-glitch-cyan-on-light font-semibold tabular-nums shrink-0 w-12">
                  {t.year}
                </span>
                <div className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-glitch-cyan-on-light/40 shrink-0 mt-1.5" />
                  <p
                    className="font-body text-base text-foreground/70"
                    dangerouslySetInnerHTML={{ __html: t.event }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="relative bg-white overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0 z-10"
            style={{
              background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)",
              animation: "hero-scanline-drift 0.4s linear infinite",
            }}
          />
          <div className="relative z-20 max-w-[1320px] mx-auto px-6 md:px-10 py-16 md:py-24 text-center">
            <h2
              className="font-display text-3xl md:text-5xl text-foreground tracking-tight"
              style={{ animation: "hero-glitch-text 8s ease-in-out infinite" }}
            >
              Join the resistance.
            </h2>
            <p className="font-body text-base text-muted mt-4 max-w-md mx-auto">
              Buy something made by a human. Wear it. Let them know you were here.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2.5 bg-[#0a0a0a] text-white font-body text-[14px] font-semibold px-7 py-3.5 rounded-full hover:bg-glitch-cyan-on-light transition-colors duration-200 mt-8"
            >
              Shop Now
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
