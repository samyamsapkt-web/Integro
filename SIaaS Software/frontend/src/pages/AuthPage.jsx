import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mode, setMode] = useState(new URLSearchParams(location.search).get("mode") === "signup" ? "signup" : "signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  async function handleEmailAuth(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      if (mode === "signup") {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            data: {
              full_name: fullName
            }
          }
        });

        if (signUpError) {
          throw signUpError;
        }

        setMessage("Account created. Check your email if confirmation is enabled in Supabase.");
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (signInError) {
          throw signInError;
        }

        navigate("/dashboard");
      }
    } catch (authError) {
      setError(authError.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleOAuth(provider) {
    setError("");
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (oauthError) {
      setError(oauthError.message);
    }
  }

  return (
    <div className="page auth-page">
      <section className="auth-card">
        <div className="auth-copy">
          <span className="eyebrow">Sign in to SIaaS</span>
          <h1>Launch a personalized AI workflow workspace in minutes.</h1>
          <p>
            Use Google, GitHub, or email to create your account. On first sign-in, SIaaS will guide
            you through a short setup so the dashboard fits your workflow.
          </p>
          <div className="auth-benefits">
            <span>Personalized dashboard</span>
            <span>Stored workflows</span>
            <span>Usage history</span>
          </div>
        </div>

        <div className="auth-form-card">
          <div className="tab-row">
            <button className={mode === "signin" ? "tab-active" : ""} onClick={() => setMode("signin")}>
              Sign in
            </button>
            <button className={mode === "signup" ? "tab-active" : ""} onClick={() => setMode("signup")}>
              Sign up
            </button>
          </div>

          <div className="oauth-grid">
            <button className="oauth-button" onClick={() => handleOAuth("google")}>
              Continue with Google
            </button>
            <button className="oauth-button" onClick={() => handleOAuth("github")}>
              Continue with GitHub
            </button>
          </div>

          <div className="divider">or continue with email</div>

          <form onSubmit={handleEmailAuth} className="stack-form">
            {mode === "signup" ? (
              <label>
                Full name
                <input value={fullName} onChange={(event) => setFullName(event.target.value)} required />
              </label>
            ) : null}
            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
              />
            </label>
            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Choose a secure password"
                required
              />
            </label>
            {error ? <p className="form-error">{error}</p> : null}
            {message ? <p className="form-message">{message}</p> : null}
            <button type="submit" className="primary-button full-width" disabled={submitting}>
              {submitting ? "Working..." : mode === "signup" ? "Create account" : "Sign in"}
            </button>
          </form>

          <p className="micro-copy">
            By continuing, you agree to your future terms and privacy policy. For now, this is a
            trial-ready starter app you can keep customizing.
          </p>
          <Link to="/pricing" className="text-link">
            Compare plans first
          </Link>
        </div>
      </section>
    </div>
  );
}

export default AuthPage;
