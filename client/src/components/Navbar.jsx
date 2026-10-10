// Navbar.js
import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logOut } from "../store/userSlice";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

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
      ? "text-teal-300 bg-gray-800"
      : "text-gray-300 hover:text-white hover:bg-gray-800"
  }`;

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { isLoggedIn, data: user } = useSelector((state) => state.userSlice);
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
    <header className="sticky top-0 z-30 bg-gray-900/90 backdrop-blur border-b border-gray-800">
      <div className="w-full px-4 h-14 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white text-sm font-bold">
            {"</>"}
          </span>
          <span className="text-teal-300 font-bold">EatCode</span>
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
          {isLoggedIn ? (
            <>
              <span
                title={user?.name}
                className="w-8 h-8 rounded-full bg-teal-700 flex items-center justify-center text-xs font-bold text-white"
              >
                {initials(user?.name)}
              </span>
              <button
                onClick={handleLogOut}
                className="text-sm px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => go("/login")}
                className="text-sm px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800"
              >
                Log in
              </button>
              <button
                onClick={() => go("/signup")}
                className="text-sm px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-semibold"
              >
                Sign up
              </button>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
          className="md:hidden text-gray-300 hover:text-white p-2"
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {/* Mobile panel */}
      {open && (
        <nav className="md:hidden border-t border-gray-800 px-4 py-3 space-y-1">
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
                className="flex-1 text-sm px-3 py-2 rounded-lg bg-gray-800 text-gray-200"
              >
                Log out{user?.name ? ` (${user.name})` : ""}
              </button>
            ) : (
              <>
                <button
                  onClick={() => go("/login")}
                  className="flex-1 text-sm px-3 py-2 rounded-lg bg-gray-800 text-gray-200"
                >
                  Log in
                </button>
                <button
                  onClick={() => go("/signup")}
                  className="flex-1 text-sm px-3 py-2 rounded-lg bg-teal-600 text-white font-semibold"
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
