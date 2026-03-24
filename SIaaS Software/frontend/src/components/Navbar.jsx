import { useMemo } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const initials = useMemo(() => {
    const name = user?.user_metadata?.full_name || user?.email || "IN";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [user]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate("/");
  }

  return (
    <header className="navbar">
      <Link to="/" className="brand">
        <span className="brand-mark">I</span>
        <span>
          <strong>INNOVISR</strong>
          <small>SIaaS</small>
        </span>
      </Link>

      <nav className="nav-links">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/pricing">Pricing</NavLink>
        {user ? <NavLink to="/dashboard">Dashboard</NavLink> : <NavLink to="/auth">Sign in</NavLink>}
      </nav>

      <div className="nav-actions">
        {user ? (
          <>
            <span className="user-chip">{initials}</span>
            <button className="ghost-button" onClick={handleSignOut}>
              Sign out
            </button>
          </>
        ) : (
          <>
            <Link className="ghost-button" to="/auth">
              Sign in
            </Link>
            <Link className="primary-button" to="/auth?mode=signup">
              Start free
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

export default Navbar;
