const features = [
  { code: "001", top: "Pre-AI era", bottom: "Limited supply" },
  { code: "002", top: "Human-made", bottom: "(while it lasts)" },
  { code: "003", top: "Anxiety approved", bottom: "Coping tools" },
  { code: "004", top: "Secure checkout", bottom: "Because we overthink" },
];

export default function FeatureStrip() {
  return (
    <section className="relative border-y border-border bg-white overflow-hidden">
      {/* Subtle scan lines */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.4) 2px, rgba(0,0,0,0.4) 4px)",
        }}
      />

      <div className="relative max-w-[1320px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {features.map((feature, i) => (
            <div
              key={i}
              className={`flex items-center gap-4 py-7 px-2 md:px-6 ${
                i < features.length - 1 ? "md:border-r border-border" : ""
              } ${i < 2 ? "border-b md:border-b-0" : ""}`}
            >
              <span className="font-mono text-[10px] text-glitch-cyan-on-light tracking-wider shrink-0">
                [{feature.code}]
              </span>
              <div>
                <p className="font-body text-[13px] font-semibold text-foreground leading-tight">
                  {feature.top}
                </p>
                <p className="font-mono text-[11px] text-muted/60 leading-tight mt-0.5">
                  {feature.bottom}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
