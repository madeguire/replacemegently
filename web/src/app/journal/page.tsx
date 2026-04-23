import Header from "@/components/Header";
import AnnouncementBar from "@/components/AnnouncementBar";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";

const articles = [
  {
    slug: "midjourney-stole-my-mood-board",
    title: "Midjourney Stole My Mood Board and Made It Better",
    excerpt: "I spent three hours curating references. The AI did it in four seconds. I still billed for three hours.",
    category: "Essay",
    date: "Apr 2026",
    readTime: "6 min",
    image: "/product-notebook.png",
  },
  {
    slug: "five-stages-of-ai-grief",
    title: "The Five Stages of AI Grief: A Designer's Guide",
    excerpt: "Denial, anger, bargaining, pivoting to product management, acceptance.",
    category: "Guide",
    date: "Mar 2026",
    readTime: "8 min",
    image: "/product-career-pivot-pack.png",
  },
  {
    slug: "prompt-engineering-is-not-design",
    title: "Prompt Engineering Is Not Design (But My Résumé Says Otherwise)",
    excerpt: "How I rebranded 'typing words into a box' as a senior-level skill.",
    category: "Satire",
    date: "Feb 2026",
    readTime: "4 min",
    image: "/product-prompt-tee.png",
  },
  {
    slug: "human-made-manifesto",
    title: "The Human-Made Manifesto",
    excerpt: "A declaration for everyone who still believes that imperfect, emotional, human-crafted work has a place in this world.",
    category: "Manifesto",
    date: "Jan 2026",
    readTime: "10 min",
    image: "/product-pixels-hoodie.png",
  },
  {
    slug: "my-figma-files-are-legacy-code",
    title: "My Figma Files Are Now Considered Legacy Code",
    excerpt: "The moment I realized my meticulously organized component library was being called 'training data.'",
    category: "Essay",
    date: "Dec 2025",
    readTime: "5 min",
    image: "/product-deprecated-tote.png",
  },
  {
    slug: "exit-interview-with-creativity",
    title: "An Exit Interview with Human Creativity",
    excerpt: "We sat down with creativity on its last day. It had some thoughts about the severance package.",
    category: "Interview",
    date: "Nov 2025",
    readTime: "7 min",
    image: "/product-water-bottle.png",
  },
];

export default function JournalPage() {
  return (
    <>
      <Header />
      <AnnouncementBar />
      <main className="flex-1">
        {/* Hero strip */}
        <section className="relative bg-[#0a0a0a] overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)",
              animation: "hero-scanline-drift 0.4s linear infinite",
            }}
          />
          <div
            className="pointer-events-none absolute left-0 right-0 h-[2px] bg-glitch-red/30 z-10"
            style={{ animation: "hero-hbar 8s ease-in-out 2s infinite" }}
          />
          <div className="relative z-10 max-w-[1320px] mx-auto px-6 md:px-10 py-16 md:py-24">
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-glitch-cyan/70 block mb-3">
              transmission_log
            </span>
            <h1
              className="font-display text-4xl md:text-6xl text-white tracking-tight"
              style={{ animation: "hero-glitch-text 8s ease-in-out infinite" }}
            >
              Journal
            </h1>
            <p className="font-body text-sm md:text-base text-white/40 mt-3 max-w-md">
              Dispatches from the human side. Essays, satire, and manifestos for the beautifully redundant.
            </p>
          </div>
        </section>

        {/* Articles */}
        <section className="max-w-[1320px] mx-auto px-6 md:px-10 py-10 md:py-16">
          {/* Featured article */}
          <Link
            href={`/journal/${articles[0].slug}`}
            className="group block mb-12 md:mb-16"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-center">
              <div className="relative aspect-[4/3] bg-[#f2f2f2] overflow-hidden">
                <Image
                  src={articles[0].image}
                  alt={articles[0].title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-glitch-cyan/60 group-hover:w-full transition-all duration-500" />
                <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-foreground/15" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-glitch-cyan-on-light">
                    {articles[0].category}
                  </span>
                  <span className="text-border">|</span>
                  <span className="font-mono text-[10px] text-muted tracking-wider">
                    {articles[0].date}
                  </span>
                  <span className="text-border">|</span>
                  <span className="font-mono text-[10px] text-muted tracking-wider">
                    {articles[0].readTime}
                  </span>
                </div>
                <h2 className="font-display text-2xl md:text-3xl text-foreground tracking-tight leading-tight group-hover:text-glitch-cyan-on-light transition-colors duration-200">
                  {articles[0].title}
                </h2>
                <p className="font-body text-base text-muted mt-3 leading-relaxed">
                  {articles[0].excerpt}
                </p>
                <span className="inline-block font-mono text-[11px] tracking-wider text-muted mt-4 group-hover:text-glitch-cyan-on-light transition-colors">
                  Read transmission →
                </span>
              </div>
            </div>
          </Link>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {articles.slice(1).map((article) => (
              <Link
                key={article.slug}
                href={`/journal/${article.slug}`}
                className="group block"
              >
                <div className="relative aspect-[4/3] bg-[#f2f2f2] overflow-hidden mb-4">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-glitch-cyan/60 group-hover:w-full transition-all duration-500" />
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-glitch-cyan-on-light">
                    {article.category}
                  </span>
                  <span className="font-mono text-[9px] text-muted tracking-wider">
                    {article.date} · {article.readTime}
                  </span>
                </div>
                <h3 className="font-display text-lg text-foreground tracking-tight leading-snug group-hover:text-glitch-cyan-on-light transition-colors duration-200">
                  {article.title}
                </h3>
                <p className="font-body text-sm text-muted mt-1.5 leading-relaxed line-clamp-2">
                  {article.excerpt}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
