import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";
import { AuthProvider } from "./context/AuthContext";
import { ProgressProvider } from "./context/ProgressContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AppShell from "./components/AppShell";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import LessonGenerator from "./pages/LessonGenerator";
import Chatbot from "./pages/Chatbot";
import Speaking from "./pages/Speaking";
import Vocabulary from "./pages/Vocabulary";
import Quiz from "./pages/Quiz";
import ProgressPage from "./pages/Progress";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import Reading from "./pages/Reading";
import Listening from "./pages/Listening";
import Stories from "./pages/Stories";
import Conversations from "./pages/Conversations";
import NotFound from "./pages/NotFound";

function Protected({ children }) {
  return (
    <ProtectedRoute>
      <ProgressProvider>
        <AppShell>{children}</AppShell>
      </ProgressProvider>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route path="/app" element={<Protected><Dashboard /></Protected>} />
              <Route path="/app/lessons" element={<Protected><LessonGenerator /></Protected>} />
              <Route path="/app/reading" element={<Protected><Reading /></Protected>} />
              <Route path="/app/listening" element={<Protected><Listening /></Protected>} />
              <Route path="/app/stories" element={<Protected><Stories /></Protected>} />
              <Route path="/app/conversations" element={<Protected><Conversations /></Protected>} />
              <Route path="/app/chat" element={<Protected><Chatbot /></Protected>} />
              <Route path="/app/speaking" element={<Protected><Speaking /></Protected>} />
              <Route path="/app/vocabulary" element={<Protected><Vocabulary /></Protected>} />
              <Route path="/app/quiz" element={<Protected><Quiz /></Protected>} />
              <Route path="/app/progress" element={<Protected><ProgressPage /></Protected>} />
              <Route path="/app/profile" element={<Protected><Profile /></Protected>} />
              <Route path="/app/admin" element={<Protected><Admin /></Protected>} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
