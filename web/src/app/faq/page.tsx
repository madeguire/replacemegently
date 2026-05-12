"use client";

import { useState } from "react";
import PageView from "@/components/PageView";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const faqs = [
  {
    q: "Is this a real company or a joke?",
    a: "Yes. We're a real company that sells real products with a satirical edge. Every item is handcrafted and shipped to your door. The jokes are free.",
  },
  {
    q: "Who makes these products?",
    a: "Actual humans — designers, artists, and makers who may or may not be coping with existential dread about AI. Each product is designed and produced without generative AI.",
  },
  {
    q: "What's the return policy?",
    a: "30-day returns on unworn, unused items. We can't take back the existential realization that came with the purchase, though.",
  },
  {
    q: "Do you ship internationally?",
    a: "Yes. We ship worldwide because existential crises are a global phenomenon. International shipping rates calculated at checkout.",
  },
  {
    q: "How long does shipping take?",
    a: "Domestic orders: 3–7 business days. International: 7–21 days. We don't use teleportation because it hasn't been invented by humans yet.",
  },
  {
    q: "Is the 'replacement likelihood' real?",
    a: "As real as anything on the internet. It's a satirical metric we assign to each product based on vibes, not science. Please don't cite it in your performance review.",
  },
  {
    q: "Can I use AI to write my product review?",
    a: "We'd prefer you didn't, but we can't stop you. Just know we'll feel a little sad about it.",
  },
  {
    q: "Do you offer wholesale?",
    a: "For select partners who share our values. Contact us at hello@human-tm.com and prove you're not a bot.",
  },
];

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <>
      <PageView page="faq" />
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
          <div className="relative z-10 max-w-[1320px] mx-auto px-6 md:px-10 py-16 md:py-24">
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-glitch-cyan/70 block mb-3">
              knowledge_base
            </span>
            <h1
              className="font-display text-4xl md:text-6xl text-white tracking-tight"
              style={{ animation: "hero-glitch-text 8s ease-in-out infinite" }}
            >
              FAQ
            </h1>
            <p className="font-body text-sm md:text-base text-white/40 mt-3 max-w-md">
              Frequently asked questions from humans who still ask questions manually.
            </p>
          </div>
        </section>

        <section className="max-w-[800px] mx-auto px-6 md:px-10 py-10 md:py-16">
          <div className="space-y-0">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b border-border">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-start justify-between gap-4 py-5 text-left group"
                >
                  <div className="flex items-start gap-4">
                    <span className="font-mono text-[10px] text-glitch-cyan-on-light/50 tracking-wider mt-1 shrink-0">
                      0{i + 1}
                    </span>
                    <span className="font-body text-base text-foreground group-hover:text-glitch-cyan-on-light transition-colors">
                      {faq.q}
                    </span>
                  </div>
                  <span
                    className={`font-mono text-[16px] text-muted shrink-0 mt-0.5 transition-transform duration-200 ${
                      open === i ? "rotate-45" : ""
                    }`}
                  >
                    +
                  </span>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    open === i ? "max-h-40 pb-5" : "max-h-0"
                  }`}
                >
                  <p className="font-body text-sm text-muted leading-relaxed pl-10 md:pl-12">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
