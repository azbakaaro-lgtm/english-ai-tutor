import { AlertTriangle } from "lucide-react";
import { StarGlyph } from "./Star";

// Shown anywhere the app needs the backend and VITE_API_URL isn't set.
// This is a real production app now — accounts, progress, and content all
// live on the server, so there's no "works without a server" fallback.
export default function BackendRequiredNotice() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-ink-50 dark:bg-ink-950 px-4">
      <div className="max-w-md text-center">
        <div className="w-12 h-12 mx-auto rounded-xl bg-ink-800 dark:bg-gold-400 flex items-center justify-center">
          <StarGlyph className="w-6 h-6 text-gold-400 dark:text-ink-900" />
        </div>
        <div className="mt-5 flex items-center justify-center gap-2 text-coral-500">
          <AlertTriangle className="w-5 h-5" />
          <h1 className="text-lg font-semibold">Backend not configured</h1>
        </div>
        <p className="mt-3 text-sm text-ink-500 dark:text-ink-300">
          This app requires the backend API to sign in and load content. Set{" "}
          <code className="px-1.5 py-0.5 rounded bg-ink-100 dark:bg-ink-800 font-mono text-xs">VITE_API_URL</code>{" "}
          in your environment (see <code className="px-1.5 py-0.5 rounded bg-ink-100 dark:bg-ink-800 font-mono text-xs">.env.example</code>) and rebuild/redeploy.
        </p>
      </div>
    </div>
  );
}
