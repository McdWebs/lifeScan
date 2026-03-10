const steps = [
  { num: '1', title: 'Pick your event',       desc: 'Choose the life event that just happened to you.' },
  { num: '2', title: 'Answer a few questions', desc: 'Quick, tailored questions so we know your situation.' },
  { num: '3', title: 'Get your checklist',    desc: 'A personalized, actionable to-do list — ready in seconds.' },
];

export default function About() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:py-20">
      <h1 className="font-display text-3xl font-extrabold tracking-tight text-neu-fg sm:text-4xl">
        About LifeScan
      </h1>

      <p className="mt-6 text-lg leading-relaxed text-neu-muted">
        Major life events are exciting — but they come with an overwhelming number of
        things to do. LifeScan turns that chaos into a clear, personalized checklist
        so you can focus on what matters most.
      </p>

      <p className="mt-4 text-lg leading-relaxed text-neu-muted">
        Whether you just bought a house, had a baby, started a new job, moved to a new
        city, or got married, we've got you covered with expert-curated tasks tailored
        to your unique situation.
      </p>

      {/* How it works */}
      <h2 className="mt-14 font-display text-xl font-bold text-neu-fg">How it works</h2>
      <div className="mt-6 grid gap-5 sm:grid-cols-3">
        {steps.map((step) => (
          <div key={step.num} className="rounded-[32px] bg-neu-bg p-8 shadow-neu-raised">
            {/* Step number in a deep inset well */}
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-neu-bg shadow-neu-inset-deep font-display text-sm font-bold text-neu-accent">
              {step.num}
            </span>
            <h3 className="mt-4 font-display font-semibold text-neu-fg">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-neu-muted">{step.desc}</p>
          </div>
        ))}
      </div>

      {/* Affiliate disclosure */}
      <div className="mt-12 rounded-[32px] bg-neu-bg p-8 shadow-neu-raised">
        <div className="flex items-start gap-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-neu-bg shadow-neu-inset text-lg select-none">
            💡
          </span>
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-neu-muted">
              Affiliate Disclosure
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-neu-muted">
              Some checklist items include links to third-party products and services. These
              are affiliate links, which means we may earn a small commission at no extra
              cost to you. We only recommend services we believe are genuinely helpful.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
