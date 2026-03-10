export default function Contact() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:py-20">
      <h1 className="font-display text-3xl font-extrabold tracking-tight text-neu-fg sm:text-4xl">
        Contact
      </h1>

      <p className="mt-6 text-lg leading-relaxed text-neu-muted">
        Have a question, found a bug, or have an idea that would make LifeScan more useful?
        We&apos;d love to hear from you.
      </p>

      <div className="mt-10 space-y-6">
        <section>
          <h2 className="font-display text-base font-semibold text-neu-fg">
            Support &amp; feedback
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-neu-muted">
            For account issues, bug reports, or general product feedback, email us at
            {' '}
            <a
              href="mailto:support@LifeScan.app"
              className="text-neu-accent underline-offset-2 hover:underline"
            >
              support@LifeScan.app
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="font-display text-base font-semibold text-neu-fg">
            Partnerships &amp; suggestions
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-neu-muted">
            If you have expert knowledge about a specific life event or want to partner with us
            on better checklists, reach out and include &quot;Partnership&quot; in the subject line.
          </p>
        </section>

        <section>
          <h2 className="font-display text-base font-semibold text-neu-fg">
            Response times
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-neu-muted">
            We try to respond to all messages within 2–3 business days. If your request is urgent,
            please mention that in the subject line.
          </p>
        </section>
      </div>
    </div>
  );
}
