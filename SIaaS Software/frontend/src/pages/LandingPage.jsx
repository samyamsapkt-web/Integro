import { Link } from "react-router-dom";
import SectionHeading from "../components/SectionHeading";
import { features, heroStats, workflowTemplates } from "../data/siteContent";

function LandingPage() {
  return (
    <div className="page marketing-page">
      <section className="hero-card hero-grid">
        <div className="hero-copy">
          <span className="eyebrow">Smart Integration as a Service</span>
          <h1>
            AI orchestration for workflows that should feel like an operations team, not a chain of
            brittle triggers.
          </h1>
          <p>
            SIaaS by INNOVISR turns plain-English workflow ideas into AI-powered work cycles that
            route tasks, monitor execution, and adapt to real-world edge cases.
          </p>
          <div className="button-row">
            <Link to="/auth?mode=signup" className="primary-button">
              Start free
            </Link>
            <Link to="/pricing" className="ghost-button">
              View pricing
            </Link>
          </div>
          <div className="stat-row">
            {heroStats.map((stat) => (
              <div key={stat.label} className="mini-stat">
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-panel gradient-panel">
          <div className="panel-window">
            <div className="panel-header">
              <span className="panel-dot pink" />
              <span className="panel-dot blue" />
              <span className="panel-dot violet" />
            </div>
            <div className="workflow-preview">
              <div className="preview-block">
                <small>Prompted workflow</small>
                <h3>Weekly pipeline review</h3>
                <p>
                  Pull HubSpot leads, summarize movement, flag stalled deals, and draft follow-up
                  notes.
                </p>
              </div>
              <div className="preview-steps">
                <div>
                  <span>1</span>
                  <p>Fetch CRM data and classify urgency</p>
                </div>
                <div>
                  <span>2</span>
                  <p>Route analysis to the best-fit model</p>
                </div>
                <div>
                  <span>3</span>
                  <p>Generate summary, next actions, and approval request</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="content-section">
        <SectionHeading
          eyebrow="Why it feels different"
          title="Traditional integrations connect software. SIaaS connects judgment."
          description="The platform is designed to decide what should happen next instead of blindly following a trigger map."
        />
        <div className="feature-grid">
          {features.map((feature, index) => (
            <article key={feature.title} className={`feature-card tint-${index % 3}`}>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="content-section split-section">
        <div>
          <SectionHeading
            eyebrow="How it works"
            title="Describe the workflow. Let SIaaS build the operating system around it."
            description="The first version is intentionally practical: help people launch valuable automations fast, then expand."
          />
          <div className="timeline">
            <div className="timeline-card">
              <strong>1. Tell SIaaS what outcome you need</strong>
              <p>Use plain English to explain the process, tools, approvals, and success signals.</p>
            </div>
            <div className="timeline-card">
              <strong>2. Configure the logic with guided AI setup</strong>
              <p>Pick tools, review recommendations, and tailor the dashboard to your workflow style.</p>
            </div>
            <div className="timeline-card">
              <strong>3. Run, monitor, and improve</strong>
              <p>Track live runs, adjust prompts, and bring humans in only where confidence drops.</p>
            </div>
          </div>
        </div>

        <div className="template-stack">
          {workflowTemplates.map((template) => (
            <article key={template.title} className="template-card">
              <h3>{template.title}</h3>
              <p>{template.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="cta-banner">
        <div>
          <span className="eyebrow">Start with a trial-ready build</span>
          <h2>Launch the first version, validate it, then keep shaping the product with real usage.</h2>
        </div>
        <div className="button-row">
          <Link to="/auth?mode=signup" className="primary-button">
            Create account
          </Link>
          <Link to="/pricing" className="ghost-button">
            Compare plans
          </Link>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
