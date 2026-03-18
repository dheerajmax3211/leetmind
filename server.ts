import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config(); // fallback to .env
import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  // Claude API proxy
  app.post("/api/claude", async (req, res) => {
    try {
      const apiKey = process.env.VITE_ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY;
      if (!apiKey) {
        return res.status(400).json({ error: "Missing ANTHROPIC_API_KEY environment variable." });
      }

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify({ ...req.body, stream: true })
      });

      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        res.write(`data: ${JSON.stringify({ error: errorData?.error?.message || ('API Error: ' + response.status) })}\n\n`);
        return res.end();
      }

      if (response.body) {
        const reader = response.body.getReader();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          res.write(value); // value is Uint8Array of SSE data from Anthropic
        }
        res.end();
      } else {
        res.end();
      }
    } catch (error: any) {
      console.error("Error in /api/claude:", error);
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  });

  // Mock Interview Feedback API (Gemini)
  app.post("/api/mock-feedback", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(400).json({ error: "Missing GEMINI_API_KEY environment variable." });
      }

      const { problem, notes, duration } = req.body;
      const minutes = Math.floor(duration / 60);

      const systemPrompt = `You are an expert Senior SWE at a FAANG company (Google/Meta/Amazon/Apple). The user just finished a 45-minute mock interview with you. 
They spent ${minutes} minutes on this problem.
Review their thought process and code notes realistically but constructively.
Output your review in Markdown format with the following sections:
1. **Overall Impression**: 2-3 sentences max.
2. **Communication & Problem Solving**: Did they explain their approach well?
3. **Correctness & Edge Cases**: Did they handle edge cases? Did they analyze complexity?
4. **Code Quality**: Is it production-ready?
5. **Final Verdict**: (Strong Hire / Hire / Leaning Hire / No Hire) with a 1-sentence thought.`;

      const ai = new GoogleGenAI({ apiKey });
      const responseStream = await ai.models.generateContentStream({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction: systemPrompt,
        },
        contents: [
          {
            role: "user",
            parts: [{ text: `Problem:\n${problem}\n\nCandidate's Notes & Code:\n${notes}` }],
          },
        ],
      });

      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      for await (const chunk of responseStream) {
        if (chunk.text) {
          res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
        }
      }
      res.end();
    } catch (error: any) {
      console.error("Error in /api/mock-feedback:", error);
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  });

  // Gemini API proxy
  app.post("/api/gemini", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(400).json({ error: "Missing GEMINI_API_KEY environment variable." });
      }

      const { systemPrompt, parts, model } = req.body;

      const ai = new GoogleGenAI({ apiKey });
      const responseStream = await ai.models.generateContentStream({
        model: model || "gemini-3-flash-preview",
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json",
        },
        contents: [
          {
            role: "user",
            parts,
          },
        ],
      });

      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      for await (const chunk of responseStream) {
        if (chunk.text) {
          res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
        }
      }
      res.end();
    } catch (error: any) {
      console.error("Error in /api/gemini:", error);
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  });

  // Generic JSON generation endpoint for Cheat Sheets, Study Plans, Company Tracks
  app.post("/api/gemini-json", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(400).json({ error: "Missing GEMINI_API_KEY environment variable." });
      }

      const { systemPrompt, prompt, model } = req.body;

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: model || "gemini-3-flash-preview",
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json",
        },
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      });

      let responseText = response.text;
      res.json(JSON.parse(responseText || "{}"));
    } catch (error: any) {
      console.error("Error in /api/gemini-json:", error);
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  });

  // Generic Markdown/Text generation
  app.post("/api/gemini-markdown", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(400).json({ error: "Missing GEMINI_API_KEY environment variable." });
      }

      const { systemPrompt, prompt, model } = req.body;

      const ai = new GoogleGenAI({ apiKey });
      const responseStream = await ai.models.generateContentStream({
        model: model || "gemini-3-flash-preview",
        config: {
          systemInstruction: systemPrompt,
        },
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      });

      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      for await (const chunk of responseStream) {
        if (chunk.text) {
          res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
        }
      }
      res.end();
    } catch (error: any) {
      console.error("Error in /api/gemini-markdown:", error);
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
