export default function Loader({ message = 'Generating your checklist...' }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-neu-bg/90 backdrop-blur-sm">
      {/* Deep-carved circular well containing a spinning ring */}
      <div className="relative h-20 w-20">
        <div className="absolute inset-0 rounded-full bg-neu-bg shadow-neu-inset-deep" />
        <div
          className="absolute inset-3 rounded-full border-4 border-transparent border-t-neu-accent animate-spin"
          style={{ animationDuration: '0.9s' }}
        />
      </div>

      {message && (
        <p className="mt-6 text-sm font-medium text-neu-muted">{message}</p>
      )}
    </div>
  );
}
