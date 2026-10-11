import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { API_BASE } from "../utils/apiBase";

function readUserId() {
  try {
    const raw = sessionStorage.getItem("user");
    if (!raw) return null;
    const u = JSON.parse(raw);
    return u?._id || u?.id || null;
  } catch {
    return null;
  }
}

// Fire-and-forget page-view beacon. Public endpoint, no cookies, no UI.
export default function useVisitBeacon() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (pathname.startsWith("/admin")) return; // keep stats free of own admin views
    const body = JSON.stringify({ path: pathname, userId: readUserId() });
    try {
      fetch(`${API_BASE}/api/visits`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      }).catch(() => {});
    } catch {
      // analytics must never break the app
    }
  }, [pathname]);
}
