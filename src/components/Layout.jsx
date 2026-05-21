import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { BarChart3, Home, Map, Moon, Settings, Sun, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import Button from "./Button";
import { usePlayer } from "../hooks/usePlayer";

const navItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/dashboard", label: "Dashboard", icon: Trophy },
  { to: "/stats", label: "Stats", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function Layout() {
  const { profile, theme, setTheme } = usePlayer();
  const location = useLocation();

  return (
    <div className="app-shell min-h-screen text-slate-900 dark:text-slate-100">
      <header className="sticky top-0 z-20 border-b border-white/60 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-slate-950/70">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <Link to="/" className="flex items-center gap-3 font-extrabold tracking-tight">
            <span className="grid size-10 place-items-center rounded-lg bg-slate-950 text-white dark:bg-white dark:text-slate-950">
              <Map size={22} aria-hidden="true" />
            </span>
            <span className="text-lg">EuropeGuesser</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold transition ${
                    isActive ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950" : "text-slate-600 hover:bg-white dark:text-slate-300 dark:hover:bg-white/10"
                  }`
                }
              >
                <item.icon size={17} aria-hidden="true" />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <span className="hidden text-sm font-semibold text-slate-500 sm:inline dark:text-slate-400">{profile.name || "Guest"}</span>
            <Button
              variant="secondary"
              className="size-11 px-0"
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
            </Button>
          </div>
        </div>

        <nav className="grid grid-cols-4 gap-1 px-2 pb-2 md:hidden" aria-label="Mobile navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 rounded-lg px-2 py-2 text-xs font-bold transition ${
                  isActive ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950" : "text-slate-600 dark:text-slate-300"
                }`
              }
            >
              <item.icon size={17} aria-hidden="true" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <motion.main
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="mx-auto max-w-7xl px-4 py-8"
      >
        <Outlet />
      </motion.main>
    </div>
  );
}
