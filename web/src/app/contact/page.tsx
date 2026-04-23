"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrambleText from "@/components/ScrambleText";

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
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
            }}
          />
          <div className="relative z-10 max-w-[1320px] mx-auto px-6 md:px-10 py-16 md:py-24">
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-glitch-cyan/70 block mb-3">
              open_channel
            </span>
            <h1
              className="font-display text-4xl md:text-6xl text-white tracking-tight"
              style={{ animation: "hero-glitch-text 8s ease-in-out infinite" }}
            >
              Contact Us
            </h1>
            <p className="font-body text-sm md:text-base text-white/40 mt-3 max-w-md">
              Reach the humans behind Human&trade;. We read every message personally. No chatbots. Yet.
            </p>
          </div>
        </section>

        <section className="max-w-[1320px] mx-auto px-6 md:px-10 py-12 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
            {/* Form */}
            <div>
              <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-glitch-cyan-on-light block mb-6">
                send_transmission
              </span>
              <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted block mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      placeholder="Your human name"
                      className="w-full bg-transparent border border-border px-4 py-3 font-body text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-glitch-cyan-on-light transition-colors"
                    />
                  </div>
                  <div>
                    <label className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted block mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="you@still-employed.com"
                      className="w-full bg-transparent border border-border px-4 py-3 font-body text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-glitch-cyan-on-light transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted block mb-2">
                    Subject
                  </label>
                  <select className="w-full bg-transparent border border-border px-4 py-3 font-body text-sm text-foreground focus:outline-none focus:border-glitch-cyan-on-light transition-colors appearance-none">
                    <option value="">Select a topic...</option>
                    <option value="order">Order inquiry</option>
                    <option value="returns">Returns &amp; exchanges</option>
                    <option value="wholesale">Wholesale</option>
                    <option value="press">Press &amp; media</option>
                    <option value="existential">Existential crisis</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted block mb-2">
                    Message
                  </label>
                  <textarea
                    rows={6}
                    placeholder="Type your message here. Use your own words — we'll know if you used AI."
                    className="w-full bg-transparent border border-border px-4 py-3 font-body text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-glitch-cyan-on-light transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-[#0a0a0a] text-white font-body text-[14px] font-semibold px-8 py-4 rounded-full hover:bg-glitch-cyan-on-light transition-colors duration-200"
                >
                  <ScrambleText text="Send Message" duration={800} />
                </button>
              </form>
            </div>

            {/* Info */}
            <div>
              <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-glitch-cyan-on-light block mb-6">
                direct_channels
              </span>

              <div className="space-y-8">
                <div>
                  <h3 className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted mb-2">
                    Email
                  </h3>
                  <a
                    href="mailto:hello@human-tm.com"
                    className="font-body text-base text-foreground hover:text-glitch-cyan-on-light transition-colors"
                  >
                    hello@human-tm.com
                  </a>
                </div>

                <div>
                  <h3 className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted mb-2">
                    Response Time
                  </h3>
                  <p className="font-body text-base text-foreground">
                    24–48 hours
                  </p>
                  <p className="font-body text-sm text-muted mt-1">
                    Because humans need sleep and coffee breaks.
                  </p>
                </div>

                <div>
                  <h3 className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted mb-2">
                    Location
                  </h3>
                  <p className="font-body text-base text-foreground">
                    The Internet, Earth
                  </p>
                  <p className="font-body text-sm text-muted mt-1">
                    Physically distributed. Emotionally centralized.
                  </p>
                </div>

                <div className="pt-6 border-t border-border">
                  <h3 className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted mb-3">
                    Social
                  </h3>
                  <div className="flex items-center gap-5">
                    {["Twitter/X", "Instagram", "TikTok"].map((platform) => (
                      <a
                        key={platform}
                        href="#"
                        className="font-mono text-[11px] text-muted hover:text-glitch-cyan-on-light transition-colors tracking-wider"
                      >
                        {platform}
                      </a>
                    ))}
                  </div>
                </div>

                {/* Terminal-style status */}
                <div className="bg-[#0a0a0a] p-5 mt-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-2 h-2 rounded-full bg-glitch-cyan animate-pulse" />
                    <span className="font-mono text-[10px] text-white/40 tracking-wider">
                      human_support_terminal
                    </span>
                  </div>
                  <p className="font-mono text-[11px] text-white/30 leading-relaxed">
                    &gt; All support tickets are handled by biological<br />
                    &gt; entities. Average empathy level: HIGH.<br />
                    &gt; Average response quality: GENUINE.<br />
                    <span className="text-glitch-cyan/50">&gt; status: awaiting_your_message_</span>
                    <span className="inline-block w-1.5 h-3.5 bg-glitch-cyan/50 ml-0.5 animate-pulse" />
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
