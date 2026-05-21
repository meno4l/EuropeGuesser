import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import { PlayerProvider, usePlayer } from "./hooks/usePlayer";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import QuizPage from "./pages/QuizPage";
import Settings from "./pages/Settings";
import Setup from "./pages/Setup";
import Stats from "./pages/Stats";

function RequirePlayer({ children }) {
  const { profile } = usePlayer();
  return profile.name ? children : <Navigate to="/setup" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/setup" element={<Setup />} />
      <Route
        element={
          <RequirePlayer>
            <Layout />
          </RequirePlayer>
        }
      >
        <Route index element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/quiz/capitals" element={<QuizPage mode="capital" />} />
        <Route path="/quiz/map" element={<QuizPage mode="map" />} />
        <Route path="/quiz/flags" element={<QuizPage mode="flag" />} />
        <Route path="/quiz/mixed" element={<QuizPage mode="mixed" />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <PlayerProvider>
      <AppRoutes />
    </PlayerProvider>
  );
}
