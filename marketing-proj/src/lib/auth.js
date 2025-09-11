export const API_BASE = process.env.NEXT_PUBLIC_API_URL + "/accounts";

export const getToken = (key) => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(key) || sessionStorage.getItem(key);
};

export const setToken = (key, value, remember = true) => {
  if (typeof window === "undefined") return;
  if (remember) localStorage.setItem(key, value);
  else sessionStorage.setItem(key, value);
};

export const removeTokens = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  sessionStorage.removeItem("access");
  sessionStorage.removeItem("refresh");
};

export const getStoredRemember = () => {
  return true; // default true, customize if needed
};

export const logout = async () => {
  const refresh = getToken("refresh");
  try {
    await fetch(`${API_BASE}/logout/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });
  } catch (err) {
    console.error("Logout failed:", err);
  } finally {
    removeTokens();
  }
};

export async function getValidAdminToken() {
  let access = getToken("access");
  const refresh = getToken("refresh");

  if (!access) return null;

  try {
    const { exp, is_admin } = JSON.parse(atob(access.split(".")[1]));

    if (!is_admin) return null;

    // Expired?
    if (exp * 1000 < Date.now()) {
      console.warn("⚠️ Access token expired, refreshing...");
      const res = await fetch(
        `${API_BASE.replace("/accounts", "")}/token/refresh/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh }),
        }
      );

      if (res.ok) {
        const data = await res.json();
        access = data.access;
        setToken("access", access, true);
      } else {
        console.error("❌ Refresh token failed");
        removeTokens();
        return null;
      }
    }
    return access;
  } catch (err) {
    console.error("❌ Invalid token", err);
    return null;
  }
}



/**
 * Refresh the access token if it is expired
 * @returns {Promise<string|null>} Returns the valid access token or null if refresh fails
 */
 export async function refreshTokenIfNeeded() {
  let access = getToken("access");
  const refresh = getToken("refresh");

  if (!access) return null; // No access token

  try {
    const payload = JSON.parse(atob(access.split(".")[1]));
    const { exp } = payload;

    // Check expiration
    if (exp * 1000 < Date.now()) {
      console.warn("⚠️ Access token expired, refreshing...");

      if (!refresh) {
        removeTokens();
        return null;
      }

      const res = await fetch(`${API_BASE.replace("/accounts", "")}/token/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh }),
      });

      if (!res.ok) {
        console.error("❌ Refresh token failed");
        removeTokens();
        return null;
      }

      const data = await res.json();
      access = data.access;
      setToken("access", access, true);
      console.log("✅ Access token refreshed");
    }

    return access; // Token is still valid or refreshed
  } catch (err) {
    console.error("❌ Invalid token", err);
    removeTokens();
    return null;
  }
}