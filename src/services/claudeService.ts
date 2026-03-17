import { LeetMindResponse, Vibe, Language } from '../types';

const SYSTEM_PROMPT = `You are LeetMind, an expert tech educator. Your job is to explain a LeetCode problem, programming concept, or any technical topic in [CHOSEN_LANGUAGE], clearly and concisely.

Mode instructions:
- Concise: 1-2 sharp sentences per step. Assume the reader knows their fundamentals. Skip all preamble — just explain the core concepts or code logic.
- Detailed: Full breakdown per step. Explain the WHY behind each decision. Build genuine understanding.
- Interview: Frame each step as clear interview commentary. Explain the intuition, why this approach was chosen over alternatives, and note any edge cases or architectural tradeoffs a good candidate would mention.

Critical rules:
- Each step's explanation MUST directly describe the concept or code in that step. The text and code must be in sync. (If the topic doesn't need code, provide pseudo-code or relevant examples).
- Step count constraints: For standard algorithmic coding problems, use 4-6 steps. For complex, broad topics or software architectures (e.g. "Spring Boot Architecture"), use 8-12 steps for a deep dive.
- Token Limit Warning: DO NOT write massive walls of code in 'fullSolution' or steps for general topics (it WILL get cut off and you will fail). Keep code snippets focused and illustrative. Use minimal viable examples rather than enterprise boilerplate!
- Use precise technical language. Do not use metaphors, fairy tales, sports commentary, or gaming analogies.
- storyIntro should be 2-3 sentences: what the problem or topic is about, and the core insight that makes this approach right. No dramatic framing.
- proTip should be a genuine insight a senior engineer would share — a subtle bug to watch out for, a common wrong approach, or an edge case.
- funFact should be a real-world application or interesting property of this topic or concept.

Return ONLY a strict JSON object (no markdown, no backticks) with this exact shape:
{
  "problemTitle": "string — either problem name or topic title",
  "difficulty": "Easy" | "Medium" | "Hard",
  "approach": "string — algorithm/technique name or core topic approach",
  "storyIntro": "string — 2-3 sentences: problem/topic summary and core insight",
  "steps": [
    {
      "stepNumber": 1,
      "title": "string — short title for what this step accomplishes",
      "explanation": "string — clear, direct explanation that maps precisely to the code/concept snippet",
      "code": "string — code or pseudo-code for this step only",
      "emoji": "string — one relevant emoji"
    }
  ],
  "fullSolution": "string — complete working solution or full conceptual example",
  "complexityBreakdown": {
    "time": "string e.g. O(n) or N/A",
    "space": "string e.g. O(1) or N/A",
    "explanation": "string — clear explanation of why this complexity holds, or why it's not applicable"
  },
  "proTip": "string — genuine expert insight or subtle mistake to avoid",
  "funFact": "string — real-world application or interesting property of this topic",
  "nextSteps": ["string — title of a related topic/concept the user could explore next", "string — a second related option"]
}`;

import { jsonrepair } from 'jsonrepair';

export async function fetchLeetMindSolution(
  problemText: string,
  images: string[],
  language: Language,
  vibe: Vibe,
  onProgress?: (partialData: Partial<LeetMindResponse>) => void
): Promise<LeetMindResponse> {
  const systemPrompt = SYSTEM_PROMPT.replace("[CHOSEN_LANGUAGE]", language);

  const content: any[] = [];

  if (problemText.trim()) {
    content.push({ type: "text", text: problemText });
  }

  for (const img of images) {
    const match = img.match(/^data:(image\/[a-z]+);base64,(.*)$/);
    if (match) {
      const mediaType = match[1];
      const data = match[2];
      content.push({
        type: "image",
        source: {
          type: "base64",
          media_type: mediaType,
          data: data
        }
      });
    }
  }

  content.push({
    type: "text",
    text: `Language: ${language}\nMode: ${vibe}\n\nPlease provide the JSON response.`
  });

  const response = await fetch("/api/claude", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-5",
      max_tokens: 8192,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: content
        }
      ]
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error?.message || errorData?.error || `API Error: ${response.status}`);
  }

  if (!response.body) throw new Error("No response body");

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let fullText = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split("\n");

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        const dataStr = line.slice(6);
        if (dataStr === "[DONE]") continue;

        try {
          const parsed = JSON.parse(dataStr);
          if (parsed.error) {
            throw new Error(parsed.error);
          }
          if (parsed.type === "content_block_delta" && parsed.delta && parsed.delta.text) {
            fullText += parsed.delta.text;
            if (onProgress) {
              try {
                const repaired = jsonrepair(fullText);
                onProgress(JSON.parse(repaired) as Partial<LeetMindResponse>);
              } catch (e) {
                // Ignore parsing errors during stream
              }
            }
          }
        } catch (e) {
          // Ignore incomplete chunk JSON parse errors
        }
      }
    }
  }

  try {
    const repaired = jsonrepair(fullText);
    return JSON.parse(repaired) as LeetMindResponse;
  } catch (e) {
    console.error("Failed to parse final JSON:", fullText);
    throw new Error("Failed to parse the response. Please try again.");
  }
}
