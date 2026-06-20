/**
 * Client-side seam for the unified AI endpoint (`/api/ai`).
 *
 * Usage:
 *   const { text, simulated } = await runAI("summary", "Marketing lead, 6 yrs");
 *
 * `runAI` resolves to the generated text. When the backend has no
 * ANTHROPIC_API_KEY it returns simulated content and `simulated: true`.
 */

export type AITask =
  | "generate"
  | "rewrite"
  | "summary"
  | "jd_optimize"
  | "skills"
  | "cover_letter"
  | "suggest";

export interface RunAIOptions {
  /** Extra structured context (e.g. target job description, resume data). */
  context?: unknown;
  /** Language code for the response, e.g. "en" | "ar". */
  language?: string;
  /** Optional AbortSignal to cancel the request. */
  signal?: AbortSignal;
}

export interface RunAIResult {
  text: string;
  simulated: boolean;
}

/**
 * POSTs to /api/ai and returns the generated text.
 * Throws an Error (with a human-readable message) on failure.
 */
export async function runAI(
  task: AITask,
  input: string,
  opts: RunAIOptions = {}
): Promise<RunAIResult> {
  const res = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      task,
      input,
      context: opts.context,
      language: opts.language,
    }),
    signal: opts.signal,
  });

  let data: { result?: string; simulated?: boolean; error?: string } = {};
  try {
    data = await res.json();
  } catch {
    /* non-JSON response */
  }

  if (!res.ok) {
    throw new Error(data?.error || `AI request failed (${res.status})`);
  }

  return {
    text: data.result ?? "",
    simulated: Boolean(data.simulated),
  };
}
