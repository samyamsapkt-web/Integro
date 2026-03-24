import { useEffect, useState } from "react";
import { apiRequest } from "../lib/api";

const triggers = ["manual", "scheduled", "webhook"];
const providers = ["auto", "groq", "demo"];

function WorkflowBuilderPage() {
  const [name, setName] = useState("");
  const [prompt, setPrompt] = useState("");
  const [triggerType, setTriggerType] = useState("manual");
  const [providerMode, setProviderMode] = useState("auto");
  const [saving, setSaving] = useState(false);
  const [running, setRunning] = useState(false);
  const [workflows, setWorkflows] = useState([]);
  const [result, setResult] = useState(null);

  async function loadWorkflows() {
    const data = await apiRequest("/api/workflows");
    setWorkflows(data.workflows);
  }

  useEffect(() => {
    loadWorkflows();
  }, []);

  async function handleCreate(event) {
    event.preventDefault();
    setSaving(true);

    try {
      await apiRequest("/api/workflows", {
        method: "POST",
        body: JSON.stringify({
          name,
          description: prompt.slice(0, 140),
          prompt,
          triggerType,
          providerMode
        })
      });

      setName("");
      setPrompt("");
      setTriggerType("manual");
      setProviderMode("auto");
      await loadWorkflows();
    } finally {
      setSaving(false);
    }
  }

  async function handleRun(workflowId) {
    setRunning(true);
    setResult(null);

    try {
      const response = await apiRequest(`/api/workflows/${workflowId}/run`, {
        method: "POST"
      });
      setResult(response.run);
      await loadWorkflows();
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="page product-page">
      <section className="page-title">
        <div>
          <span className="eyebrow">Workflow builder</span>
          <h1>Turn a plain-English idea into a reusable AI workflow.</h1>
          <p>
            This trial builder lets users create manual, scheduled, or webhook-driven workflows and
            run them through a starter AI orchestration layer.
          </p>
        </div>
      </section>

      <section className="builder-layout">
        <div className="workflow-card">
          <h2>Create a workflow</h2>
          <form className="builder-form" onSubmit={handleCreate}>
            <label>
              Workflow name
              <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Weekly revenue review" required />
            </label>
            <label>
              Workflow prompt
              <textarea
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                placeholder="Describe what should happen, what data matters, and what output you want."
                required
              />
            </label>

            <div>
              <span className="mini-label">Trigger</span>
              <div className="pill-row">
                {triggers.map((value) => (
                  <button
                    key={value}
                    type="button"
                    className={`select-pill ${triggerType === value ? "active" : ""}`}
                    onClick={() => setTriggerType(value)}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="mini-label">Provider mode</span>
              <div className="pill-row">
                {providers.map((value) => (
                  <button
                    key={value}
                    type="button"
                    className={`select-pill ${providerMode === value ? "active" : ""}`}
                    onClick={() => setProviderMode(value)}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>

            <button className="primary-button" type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save workflow"}
            </button>
          </form>
        </div>

        <div className="builder-stack">
          <div className="workflow-card">
            <h2>Saved workflows</h2>
            <div className="run-history">
              {workflows.map((workflow) => (
                <div key={workflow.id} className="activity-row">
                  <strong>{workflow.name}</strong>
                  <p>{workflow.description}</p>
                  <div className="button-row">
                    <span className={`status-pill ${workflow.status}`}>{workflow.status}</span>
                    <button className="ghost-button" onClick={() => handleRun(workflow.id)} disabled={running}>
                      Run now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="workflow-card">
            <h2>Latest run output</h2>
            {result ? (
              <div className="metric-stack">
                <p>{result.summary}</p>
                <div className="table-card">
                  <pre>{JSON.stringify(result.output, null, 2)}</pre>
                </div>
              </div>
            ) : (
              <p>Run a workflow to view its latest orchestration summary here.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default WorkflowBuilderPage;
