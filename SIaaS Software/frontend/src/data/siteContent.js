export const heroStats = [
  { label: "Multi-model execution", value: "12+" },
  { label: "Starter templates", value: "24" },
  { label: "Live workflow signals", value: "Real time" }
];

export const features = [
  {
    title: "AI-native workflow building",
    description: "Describe a process in plain English and turn it into an orchestrated work cycle."
  },
  {
    title: "Model-aware routing",
    description: "Send the right task to the right model based on content type, risk, and intent."
  },
  {
    title: "Human-in-the-loop checkpoints",
    description: "Escalate when confidence is low instead of letting automations fail silently."
  },
  {
    title: "Tailored workspaces",
    description: "Onboarding adapts the dashboard to the tools, role, and workflows each user cares about."
  },
  {
    title: "Usage and run analytics",
    description: "Track live runs, workflow health, and where automation is actually saving time."
  },
  {
    title: "BYOK or managed credits later",
    description: "Start with your own keys today, then layer in hosted credits when you're ready."
  }
];

export const workflowTemplates = [
  {
    title: "Weekly ops digest",
    description: "Pull sales metrics, summarize anomalies, and send a clear Monday briefing."
  },
  {
    title: "Content production loop",
    description: "Research, outline, draft, refine, and push review-ready content in one chain."
  },
  {
    title: "Lead triage and outreach",
    description: "Classify inbound leads, enrich context, and draft personalized next-step emails."
  }
];

export const pricingPlans = [
  {
    name: "Free",
    priceMonthly: 0,
    priceYearly: 0,
    description: "A generous trial tier to validate the product and attract early users.",
    cta: "Start free",
    highlight: false,
    features: [
      "10 active workflows",
      "100 workflow runs per month",
      "Core integrations",
      "Basic analytics",
      "Email and Google sign-in",
      "Community support"
    ]
  },
  {
    name: "Pro",
    priceMonthly: 15,
    priceYearly: 12,
    description: "The main plan for solo operators, agencies, and builders running serious automation.",
    cta: "Choose Pro",
    highlight: true,
    features: [
      "Unlimited workflows",
      "1,500 workflow runs per month",
      "Advanced AI routing",
      "Saved prompt presets",
      "Priority email support",
      "Early access to new integrations"
    ]
  },
  {
    name: "Team",
    priceMonthly: 49,
    priceYearly: 39,
    description: "Built for small businesses that need shared visibility and operational coverage.",
    cta: "Start Team trial",
    highlight: false,
    features: [
      "Everything in Pro",
      "Up to 5 seats",
      "Shared workflows",
      "Advanced analytics",
      "Approval checkpoints",
      "Priority support"
    ]
  }
];
