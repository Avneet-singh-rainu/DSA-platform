// Navbar.js
import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logOut } from "../store/userSlice";
import { useTheme } from "../hooks/useTheme";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

const LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/topics", label: "Topics" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
  { to: "/profile", label: "Profile" },
];

function initials(name) {
  return (name || "?")
    .split(/[@\s._-]+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const linkClass = ({ isActive }) =>
  `px-3 py-2 rounded-lg text-sm font-medium ${
    isActive
      ? "text-emerald-700 bg-emerald-100 dark:text-emerald-300 dark:bg-slate-800"
      : "text-slate-600 hover:text-slate-900 hover:bg-slate-200 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800"
  }`;

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { isLoggedIn, data: user } = useSelector((state) => state.userSlice);
  const { isDark, toggle } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogOut = () => {
    dispatch(logOut());
    setOpen(false);
    navigate("/");
  };

  const go = (to) => {
    setOpen(false);
    navigate(to);
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-950/90 backdrop-blur border-b border-slate-200 dark:border-slate-800">
      <div className="w-full px-4 h-14 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white text-sm font-bold">
            {"</>"}
          </span>
          <span className="text-emerald-700 dark:text-emerald-300 font-bold">
            EatCode
          </span>
        </Link>

        {/* Desktop links */}
        <nav className="hidden md:flex items-center gap-1">
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        {/* Desktop auth */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={toggle}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800"
          >
            {isDark ? <LightModeIcon /> : <DarkModeIcon />}
          </button>
          {isLoggedIn ? (
            <>
              <span
                title={user?.name}
                className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center text-xs font-bold text-white"
              >
                {initials(user?.name)}
              </span>
              <button
                onClick={handleLogOut}
                className="text-sm px-3 py-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => go("/login")}
                className="text-sm px-3 py-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800"
              >
                Log in
              </button>
              <button
                onClick={() => go("/signup")}
                className="text-sm px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
              >
                Sign up
              </button>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <div className="md:hidden flex items-center gap-1">
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="text-slate-500 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white p-2"
          >
            {isDark ? <LightModeIcon /> : <DarkModeIcon />}
          </button>
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            className="text-slate-500 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white p-2"
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile panel */}
      {open && (
        <nav className="md:hidden border-t border-slate-200 dark:border-slate-800 px-4 py-3 space-y-1">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              onClick={() => setOpen(false)}
              className={linkClass}
            >
              {l.label}
            </NavLink>
          ))}
          <div className="pt-2 flex gap-2">
            {isLoggedIn ? (
              <button
                onClick={handleLogOut}
                className="flex-1 text-sm px-3 py-2 rounded-lg bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200"
              >
                Log out{user?.name ? ` (${user.name})` : ""}
              </button>
            ) : (
              <>
                <button
                  onClick={() => go("/login")}
                  className="flex-1 text-sm px-3 py-2 rounded-lg bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200"
                >
                  Log in
                </button>
                <button
                  onClick={() => go("/signup")}
                  className="flex-1 text-sm px-3 py-2 rounded-lg bg-emerald-600 text-white font-semibold"
                >
                  Sign up
                </button>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
