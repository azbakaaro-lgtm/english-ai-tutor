import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { StarGlyph } from "./Star";
import BackendRequiredNotice from "./BackendRequiredNotice";

export default function ProtectedRoute({ children }) {
  const { user, loading, backendConfigured } = useAuth();

  if (!backendConfigured) return <BackendRequiredNotice />;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink-50 dark:bg-ink-950">
        <StarGlyph className="w-8 h-8 text-gold-400 animate-pulse" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  return children;
}
