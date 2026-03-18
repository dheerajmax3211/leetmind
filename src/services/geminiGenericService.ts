export async function fetchGeminiJson<T>(
  systemPrompt: string,
  prompt: string,
  model: string = 'gemini-3-flash-preview'
): Promise<T> {
  const response = await fetch('/api/gemini-json', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ systemPrompt, prompt, model }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => null);
    throw new Error(err?.error || `API Error: ${response.status}`);
  }

  return response.json();
}

export async function fetchGeminiStream(
  systemPrompt: string,
  prompt: string,
  model: string = 'gemini-3-flash-preview',
  onProgress: (chunk: string) => void
): Promise<void> {
  const response = await fetch('/api/gemini-markdown', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ systemPrompt, prompt, model }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => null);
    throw new Error(err?.error || `API Error: ${response.status}`);
  }

  if (!response.body) throw new Error("No response body");

  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split('\\n');

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const dataStr = line.slice(6);
        if (dataStr === '[DONE]') continue;
        try {
          const parsed = JSON.parse(dataStr);
          if (parsed.text) {
            onProgress(parsed.text);
          }
        } catch (e) {
          // ignore chunk parse error
        }
      }
    }
  }
}
