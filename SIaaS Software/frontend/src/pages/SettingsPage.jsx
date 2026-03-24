import { useEffect, useState } from "react";
import { apiRequest } from "../lib/api";

const tabs = ["profile", "ai", "billing"];

function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [settings, setSettings] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formState, setFormState] = useState({
    fullName: "",
    company: "",
    role: "",
    primaryGoal: "",
    preferredModel: "groq",
    groqKeyHint: ""
  });

  useEffect(() => {
    async function loadSettings() {
      const data = await apiRequest("/api/profile/settings");
      setSettings(data);
      setFormState({
        fullName: data.profile.full_name || "",
        company: data.profile.company || "",
        role: data.profile.role || "",
        primaryGoal: data.profile.primary_goal || "",
        preferredModel: data.userSettings.preferred_model || "groq",
        groqKeyHint: data.userSettings.groq_key_hint || ""
      });
    }

    loadSettings();
  }, []);

  function updateField(field, value) {
    setFormState((current) => ({
      ...current,
      [field]: value
    }));
  }

  async function handleSave(event) {
    event.preventDefault();
    setSaving(true);

    try {
      await apiRequest("/api/profile/settings", {
        method: "POST",
        body: JSON.stringify(formState)
      });
    } finally {
      setSaving(false);
    }
  }

  if (!settings) {
    return <div className="state-card">Loading settings...</div>;
  }

  return (
    <div className="page product-page">
      <section className="page-title">
        <div>
          <span className="eyebrow">Settings</span>
          <h1>Manage your profile, AI preferences, and future billing info.</h1>
          <p>This page is ready for trial use now and leaves space for deeper controls later.</p>
        </div>
      </section>

      <section className="settings-layout">
        <aside className="settings-sidebar">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`settings-tab ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </aside>

        <div className="settings-panel">
          <form className="settings-form" onSubmit={handleSave}>
            {activeTab === "profile" ? (
              <>
                <label>
                  Full name
                  <input value={formState.fullName} onChange={(event) => updateField("fullName", event.target.value)} />
                </label>
                <label>
                  Company
                  <input value={formState.company} onChange={(event) => updateField("company", event.target.value)} />
                </label>
                <label>
                  Role
                  <input value={formState.role} onChange={(event) => updateField("role", event.target.value)} />
                </label>
                <label>
                  Primary goal
                  <textarea value={formState.primaryGoal} onChange={(event) => updateField("primaryGoal", event.target.value)} />
                </label>
              </>
            ) : null}

            {activeTab === "ai" ? (
              <>
                <label>
                  Preferred model routing
                  <select
                    value={formState.preferredModel}
                    onChange={(event) => updateField("preferredModel", event.target.value)}
                  >
                    <option value="groq">Groq</option>
                    <option value="auto">Auto (Groq default)</option>
                    <option value="demo">Demo fallback</option>
                  </select>
                </label>
                <label>
                  Groq key hint
                  <input
                    value={formState.groqKeyHint}
                    onChange={(event) => updateField("groqKeyHint", event.target.value)}
                    placeholder="gsk_...last4"
                  />
                </label>
              </>
            ) : null}

            {activeTab === "billing" ? (
              <>
                <div className="workflow-card">
                  <h3>Current plan</h3>
                  <p>{settings.userSettings.plan_name || "Free"}</p>
                </div>
                <div className="workflow-card">
                  <h3>Billing integration status</h3>
                  <p>
                    Billing UI is included, but checkout is intentionally left for a later Stripe
                    integration once you want to start charging.
                  </p>
                </div>
              </>
            ) : null}

            {activeTab !== "billing" ? (
              <button className="primary-button" type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save changes"}
              </button>
            ) : null}
          </form>
        </div>
      </section>
    </div>
  );
}

export default SettingsPage;
