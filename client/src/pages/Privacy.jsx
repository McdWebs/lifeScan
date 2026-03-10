const sections = [
  {
    title: 'What this app does',
    body: `LifeScan helps you turn big life events into clear, actionable checklists. To do that, we store just enough information to keep your account working and your checklists in sync.`,
  },
  {
    title: 'What we store',
    body: `When you create an account, we store your email address, a hashed password, and any profile details you choose to add (like your name). When you generate checklists, we store the questions, your answers, and the resulting tasks so you can come back to them later.`,
  },
  {
    title: 'How AI is used',
    body: `Some checklists are generated with the help of AI. That means parts of what you type into the app may be sent to our AI provider to generate tasks and suggestions. We do not sell your data, and we use reputable infrastructure providers to process it securely.`,
  },
  {
    title: 'Your choices',
    body: `You can update your name and password from Settings, export a copy of your data, or delete your account entirely. Deleting your account removes your profile and checklists from our systems (subject to any legal obligations we may have to keep basic records).`,
  },
  {
    title: 'Contact',
    body: `If you have questions about privacy or how your data is handled, you can reach us any time at support@LifeScan.app.`,
  },
];

export default function Privacy() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:py-20">
      <h1 className="font-display text-3xl font-extrabold tracking-tight text-neu-fg sm:text-4xl">
        Privacy
      </h1>

      <p className="mt-6 text-lg leading-relaxed text-neu-muted">
        We take your data seriously. This page explains, in plain language, what we collect,
        how we use it, and the choices you have.
      </p>

      <div className="mt-10 space-y-8">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="font-display text-base font-semibold text-neu-fg">
              {section.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-neu-muted">
              {section.body}
            </p>
          </section>
        ))}
      </div>
    </div>
  );
}
