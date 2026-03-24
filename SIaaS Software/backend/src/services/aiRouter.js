import { config } from "../config.js";

function buildDemoOutput(workflow) {
  return {
    route: workflow.provider_mode === "auto" ? "groq-demo" : workflow.provider_mode,
    tasks: [
      "Fetched connected workflow context",
      "Analyzed workflow intent",
      "Prepared recommendation summary",
      "Generated next-action draft"
    ],
    confidence: 0.88
  };
}

function buildGroqMessages(workflow) {
  return [
    {
      role: "system",
      content:
        "You are SIaaS, a Smart Integration as a Service workflow orchestration assistant. Respond with valid JSON only."
    },
    {
      role: "user",
      content: `Analyze and execute this workflow request in a trial environment.

Workflow name: ${workflow.name}
Trigger type: ${workflow.trigger_type}
Provider mode: ${workflow.provider_mode}
Description: ${workflow.description || "No description provided"}
Workflow prompt: ${workflow.prompt}

Return JSON with this exact shape:
{
  "summary": "short plain-English summary",
  "tasks": ["task 1", "task 2", "task 3"],
  "confidence": 0.0,
  "recommended_next_steps": ["step 1", "step 2"],
  "route": "groq/llama-3.3-70b-versatile"
}`
    }
  ];
}

async function executeGroqWorkflow(workflow) {
  if (!config.groqApiKey) {
    const output = buildDemoOutput(workflow);

    return {
      status: "completed",
      summary: `Workflow "${workflow.name}" ran in demo mode because GROQ_API_KEY is not configured.`,
      output
    };
  }

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.groqApiKey}`
    },
    body: JSON.stringify({
      model: config.groqModel,
      messages: buildGroqMessages(workflow),
      temperature: 0.2,
      response_format: {
        type: "json_object"
      }
    })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Groq request failed: ${response.status} ${errorBody}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("Groq returned no message content.");
  }

  const parsed = JSON.parse(content);

  return {
    status: "completed",
    summary: parsed.summary || `Workflow "${workflow.name}" ran with Groq.`,
    output: {
      route: parsed.route || `groq/${config.groqModel}`,
      tasks: parsed.tasks || [],
      confidence: parsed.confidence ?? null,
      recommended_next_steps: parsed.recommended_next_steps || []
    }
  };
}

export async function executeWorkflow(workflow) {
  if (config.aiProviderMode === "demo") {
    const output = buildDemoOutput(workflow);

    return {
      status: "completed",
      summary: `Workflow "${workflow.name}" ran in demo mode using ${output.route}.`,
      output
    };
  }

  if (config.aiProviderMode === "groq" || workflow.provider_mode === "groq" || workflow.provider_mode === "auto") {
    return executeGroqWorkflow(workflow);
  }

  const output = buildDemoOutput(workflow);

  return {
    status: "completed",
    summary: `Workflow "${workflow.name}" fell back to demo mode because provider "${workflow.provider_mode}" is unsupported.`,
    output
  };
}
