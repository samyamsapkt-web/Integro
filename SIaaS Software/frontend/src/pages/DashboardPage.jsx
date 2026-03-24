import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { apiRequest } from "../lib/api";
import { useAuth } from "../context/AuthContext";

function DashboardPage() {
  const { profile, setProfile } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const result = await apiRequest("/api/profile/dashboard");
        setProfile(result.profile);
        setData(result);
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [setProfile]);

  if (loading) {
    return <div className="state-card">Loading dashboard...</div>;
  }

  if (profile && !profile.onboarding_completed) {
    return <Navigate to="/onboarding" replace />;
  }

  if (error) {
    return <div className="state-card">{error}</div>;
  }

  const metrics = data?.metrics || [];
  const workflows = data?.workflows || [];
  const runs = data?.recentRuns || [];

  return (
    <div className="page product-page">
      <section className="page-title">
        <div>
          <span className="eyebrow">Personal dashboard</span>
          <h1>Run your workflow operations from one adaptive workspace.</h1>
          <p>
            This dashboard is populated from your onboarding, saved workflows, and recent execution
            history.
          </p>
        </div>
        <div className="button-row">
          <Link className="ghost-button" to="/settings">
            Settings
          </Link>
          <Link className="primary-button" to="/workflows">
            Create workflow
          </Link>
        </div>
      </section>

      <section className="metric-grid">
        {metrics.map((metric) => (
          <article key={metric.label} className="metric-card">
            <span className="mini-label">{metric.label}</span>
            <strong>{metric.value}</strong>
            <p>{metric.helper}</p>
          </article>
        ))}
      </section>

      <section className="dashboard-grid">
        <div className="overview-card">
          <span className="eyebrow">Active workflows</span>
          <h2>Your current automation stack</h2>
          <div className="table-card">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Mode</th>
                </tr>
              </thead>
              <tbody>
                {workflows.map((workflow) => (
                  <tr key={workflow.id}>
                    <td>{workflow.name}</td>
                    <td>
                      <span className={`status-pill ${workflow.status}`}>
                        {workflow.status}
                      </span>
                    </td>
                    <td>{workflow.trigger_type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="overview-card">
          <span className="eyebrow">Recent runs</span>
          <h2>What happened most recently</h2>
          <div className="run-history">
            {runs.map((run) => (
              <div key={run.id} className="activity-row">
                <strong>{run.workflow_name}</strong>
                <p>{run.summary}</p>
                <span className={`status-pill ${run.status}`}>{run.status}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default DashboardPage;
