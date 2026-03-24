import { Router } from "express";
import { supabaseAdmin } from "../supabaseAdmin.js";
import { ensureUserRecords, getProfileBundle } from "../services/profileService.js";

const router = Router();

router.get("/dashboard", async (req, res) => {
  await ensureUserRecords(req.user);

  const { profile } = await getProfileBundle(req.user.id);
  const [{ data: workflows }, { data: recentRuns }] = await Promise.all([
    supabaseAdmin
      .from("workflows")
      .select("id,name,status,trigger_type")
      .eq("user_id", req.user.id)
      .order("created_at", { ascending: false })
      .limit(5),
    supabaseAdmin
      .from("workflow_runs")
      .select("id,status,summary,workflow_name")
      .eq("user_id", req.user.id)
      .order("created_at", { ascending: false })
      .limit(5)
  ]);

  const metrics = [
    {
      label: "Active workflows",
      value: workflows?.length || 0,
      helper: "Workflows currently saved in your workspace."
    },
    {
      label: "Completed runs",
      value: recentRuns?.filter((run) => run.status === "completed").length || 0,
      helper: "Recent workflow runs that finished successfully."
    },
    {
      label: "Primary focus",
      value: Array.isArray(profile?.workflow_focus) && profile.workflow_focus.length ? profile.workflow_focus[0] : "Unset",
      helper: "Taken from onboarding."
    },
    {
      label: "Plan",
      value: "Free",
      helper: "Update later when billing is connected."
    }
  ];

  res.json({
    profile,
    metrics,
    workflows: workflows || [],
    recentRuns: recentRuns || []
  });
});

router.post("/onboarding", async (req, res) => {
  await ensureUserRecords(req.user);

  const update = {
    id: req.user.id,
    email: req.user.email,
    full_name: req.body.fullName,
    role: req.body.role,
    company: req.body.company,
    workflow_focus: req.body.workflowFocus || [],
    preferred_tools: req.body.tools || [],
    primary_goal: req.body.primaryGoal,
    onboarding_completed: true
  };

  const { data, error } = await supabaseAdmin
    .from("profiles")
    .upsert(update, { onConflict: "id" })
    .select("*")
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json({ profile: data });
});

router.get("/settings", async (req, res) => {
  await ensureUserRecords(req.user);
  const bundle = await getProfileBundle(req.user.id);
  res.json(bundle);
});

router.post("/settings", async (req, res) => {
  const profileUpdate = {
    id: req.user.id,
    full_name: req.body.fullName,
    company: req.body.company,
    role: req.body.role,
    primary_goal: req.body.primaryGoal
  };

  const settingsUpdate = {
    user_id: req.user.id,
    preferred_model: req.body.preferredModel,
    groq_key_hint: req.body.groqKeyHint
  };

  const [{ error: profileError }, { error: settingsError }] = await Promise.all([
    supabaseAdmin.from("profiles").upsert(profileUpdate, { onConflict: "id" }),
    supabaseAdmin.from("user_settings").upsert(settingsUpdate, { onConflict: "user_id" })
  ]);

  if (profileError || settingsError) {
    return res.status(500).json({ error: profileError?.message || settingsError?.message });
  }

  return res.json({ ok: true });
});

export default router;
