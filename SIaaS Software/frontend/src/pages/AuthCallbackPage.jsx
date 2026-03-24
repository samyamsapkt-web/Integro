import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

function AuthCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    async function finishAuth() {
      await supabase.auth.getSession();
      navigate("/dashboard", { replace: true });
    }

    finishAuth();
  }, [navigate]);

  return <div className="state-card">Finalizing sign-in...</div>;
}

export default AuthCallbackPage;
