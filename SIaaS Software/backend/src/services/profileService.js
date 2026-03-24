import { supabaseAdmin } from "../supabaseAdmin.js";

export async function ensureUserRecords(user) {
  const baseProfile = {
    id: user.id,
    email: user.email,
    full_name: user.user_metadata?.full_name || user.email,
    onboarding_completed: false
  };

  await supabaseAdmin.from("profiles").upsert(baseProfile, { onConflict: "id" });

  await supabaseAdmin
    .from("user_settings")
    .upsert({ user_id: user.id, plan_name: "Free", preferred_model: "groq" }, { onConflict: "user_id" });
}

export async function getProfileBundle(userId) {
  const [{ data: profile }, { data: userSettings }] = await Promise.all([
    supabaseAdmin.from("profiles").select("*").eq("id", userId).single(),
    supabaseAdmin.from("user_settings").select("*").eq("user_id", userId).single()
  ]);

  return {
    profile,
    userSettings
  };
}
