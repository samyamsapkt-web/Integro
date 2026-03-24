import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../lib/api";
import { useAuth } from "../context/AuthContext";

const workflowOptions = [
  "Sales reporting",
  "Research automation",
  "Content production",
  "Client operations",
  "Support workflows",
  "Internal admin"
];

const toolOptions = ["Google Workspace", "Slack", "HubSpot", "Notion", "Airtable", "Stripe"];

function OnboardingPage() {
  const navigate = useNavigate();
  const { user, setProfile } = useAuth();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [selectedWorkflows, setSelectedWorkflows] = useState([]);
  const [selectedTools, setSelectedTools] = useState([]);
  const [goal, setGoal] = useState("");
  const [saving, setSaving] = useState(false);

  const canAdvance = useMemo(() => {
    if (step === 1) {
      return role.trim() && company.trim();
    }

    if (step === 2) {
      return selectedWorkflows.length > 0 && selectedTools.length > 0;
    }

    return goal.trim();
  }, [company, goal, role, selectedTools.length, selectedWorkflows.length, step]);

  function toggleValue(value, current, setter) {
    if (current.includes(value)) {
      setter(current.filter((item) => item !== value));
      return;
    }

    setter([...current, value]);
  }

  async function handleFinish() {
    if (!user) {
      return;
    }

    setSaving(true);

    try {
      const payload = {
        fullName: user.user_metadata?.full_name || user.email,
        role,
        company,
        workflowFocus: selectedWorkflows,
        tools: selectedTools,
        primaryGoal: goal
      };

      const data = await apiRequest("/api/profile/onboarding", {
        method: "POST",
        body: JSON.stringify(payload)
      });

      setProfile(data.profile);
      navigate("/dashboard");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="page onboarding-shell">
      <section className="onboarding-card">
        <div className="step-progress">
          {[1, 2, 3].map((value) => (
            <span key={value} className={value <= step ? "active" : ""} />
          ))}
        </div>
        <span className="eyebrow">AI-powered setup</span>
        <h1>Let’s tailor SIaaS to the way you actually work.</h1>
        <p>
          This first-run setup stores your preferences so the dashboard, workflow suggestions, and
          recommendations feel personal from the start.
        </p>

        {step === 1 ? (
          <div className="wizard-card">
            <h3>Who is this workspace for?</h3>
            <div className="stack-form">
              <label>
                Your role
                <input value={role} onChange={(event) => setRole(event.target.value)} placeholder="Founder, operator, agency lead..." />
              </label>
              <label>
                Company or brand
                <input value={company} onChange={(event) => setCompany(event.target.value)} placeholder="INNOVISR" />
              </label>
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="wizard-card">
            <h3>What do you want to automate first?</h3>
            <div className="choice-grid">
              {workflowOptions.map((option) => (
                <button
                  key={option}
                  className={`choice-card ${selectedWorkflows.includes(option) ? "active" : ""}`}
                  onClick={() => toggleValue(option, selectedWorkflows, setSelectedWorkflows)}
                >
                  {option}
                </button>
              ))}
            </div>
            <h3>Which tools matter most?</h3>
            <div className="choice-grid">
              {toolOptions.map((option) => (
                <button
                  key={option}
                  className={`choice-card ${selectedTools.includes(option) ? "active" : ""}`}
                  onClick={() => toggleValue(option, selectedTools, setSelectedTools)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="wizard-card">
            <h3>What outcome matters most?</h3>
            <label className="stack-form">
              Describe your main goal
              <textarea
                value={goal}
                onChange={(event) => setGoal(event.target.value)}
                placeholder="Example: I want SIaaS to build a weekly workflow that reviews sales data, drafts a summary, and alerts me when something looks off."
              />
            </label>
          </div>
        ) : null}

        <div className="button-row">
          {step > 1 ? (
            <button className="ghost-button" onClick={() => setStep(step - 1)}>
              Back
            </button>
          ) : null}
          {step < 3 ? (
            <button className="primary-button" onClick={() => setStep(step + 1)} disabled={!canAdvance}>
              Continue
            </button>
          ) : (
            <button className="primary-button" onClick={handleFinish} disabled={!canAdvance || saving}>
              {saving ? "Saving..." : "Finish setup"}
            </button>
          )}
        </div>
      </section>
    </div>
  );
}

export default OnboardingPage;
