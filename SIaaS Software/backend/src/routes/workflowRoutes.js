import { Router } from "express";
import { supabaseAdmin } from "../supabaseAdmin.js";
import { executeWorkflow } from "../services/aiRouter.js";
import { ensureUserRecords } from "../services/profileService.js";

const router = Router();

router.get("/", async (req, res) => {
  await ensureUserRecords(req.user);

  const { data, error } = await supabaseAdmin
    .from("workflows")
    .select("*")
    .eq("user_id", req.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json({ workflows: data || [] });
});

router.post("/", async (req, res) => {
  await ensureUserRecords(req.user);

  const newWorkflow = {
    user_id: req.user.id,
    name: req.body.name,
    description: req.body.description,
    prompt: req.body.prompt,
    trigger_type: req.body.triggerType || "manual",
    provider_mode: req.body.providerMode || "auto",
    status: "active"
  };

  const { data, error } = await supabaseAdmin.from("workflows").insert(newWorkflow).select("*").single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(201).json({ workflow: data });
});

router.post("/:workflowId/run", async (req, res) => {
  const { workflowId } = req.params;

  const { data: workflow, error: workflowError } = await supabaseAdmin
    .from("workflows")
    .select("*")
    .eq("id", workflowId)
    .eq("user_id", req.user.id)
    .single();

  if (workflowError || !workflow) {
    return res.status(404).json({ error: "Workflow not found." });
  }

  const runResult = await executeWorkflow(workflow);

  const runRecord = {
    user_id: req.user.id,
    workflow_id: workflow.id,
    workflow_name: workflow.name,
    status: runResult.status,
    summary: runResult.summary,
    output: runResult.output
  };

  const { data, error } = await supabaseAdmin.from("workflow_runs").insert(runRecord).select("*").single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json({ run: data });
});

export default router;
