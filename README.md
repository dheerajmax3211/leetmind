# LeetMind 🧠

An interactive, gamified LeetCode problem tutor — paste a problem, choose your language, pick a vibe, and get a step-by-step creative explanation powered by Claude or Gemini.

## Features

- 🎮 **Three vibes**: Gamer Mode, Story Mode, Speed Mode
- 🤖 **Two AI engines**: Claude (Anthropic) + Gemini (Google) — toggle from the UI
- 🖼️ **Image support**: paste problem screenshots directly
- 📊 **Complexity breakdown** + Pro Tips + Fun Facts
- 🎉 **Gamified reveal**: unlock steps one at a time

## Prerequisites

- Node.js 18+
- An Anthropic API key (`sk-ant-...`)
- A Google Gemini API key

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure API keys** — create a `.env.local` file:
   ```
   ANTHROPIC_API_KEY=sk-ant-...
   GEMINI_API_KEY=AIza...
   ```

3. **Run locally**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- React 19 + TypeScript
- Vite + Tailwind CSS v4
- Express (API proxy server)
- Framer Motion
- Anthropic Claude API
- Google Gemini API
