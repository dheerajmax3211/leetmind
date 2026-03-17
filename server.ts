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
        body: JSON.stringify(req.body)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        return res.status(response.status).json({ error: errorData?.error?.message || `API Error: ${response.status}` });
      }

      const data = await response.json();
      res.json(data);
    } catch (error: any) {
      console.error("Error in /api/claude:", error);
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

      const { systemPrompt, parts } = req.body;

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
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

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Error in /api/gemini:", error);
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
