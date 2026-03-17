import { LeetMindResponse } from '../types';

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function printSolution(data: LeetMindResponse, mode: 'color' | 'bw') {
  const isColor = mode === 'color';

  const accent        = isColor ? '#00915a' : '#1a1a1a';
  const accentLight   = isColor ? '#e6f7f1' : '#f0f0f0';
  const difficultyColor = (d: string) => {
    if (!isColor) return '#333';
    return d === 'Easy' ? '#16a34a' : d === 'Medium' ? '#d97706' : '#dc2626';
  };
  const difficultyBg = (d: string) => {
    if (!isColor) return '#eee';
    return d === 'Easy' ? '#dcfce7' : d === 'Medium' ? '#fef3c7' : '#fee2e2';
  };
  const codeBg       = isColor ? '#f4f6f8' : '#f0f0f0';
  const codeBorder   = isColor ? '#d0d7de' : '#999';
  const stepNumColor = accent;
  const tipBg        = isColor ? '#fff7ed' : '#f5f5f5';
  const tipBorder    = isColor ? '#fdba74' : '#bbb';
  const tipText      = isColor ? '#9a3412' : '#333';
  const factBg       = isColor ? '#f0fdfa' : '#f5f5f5';
  const factBorder   = isColor ? '#5eead4' : '#bbb';
  const factText     = isColor ? '#0f766e' : '#333';

  const stepsHtml = data.steps.map((step, idx) => `
    <div class="step">
      <div class="step-header">
        <span class="step-num" style="color:${stepNumColor}">${String(idx + 1).padStart(2, '0')}</span>
        <span class="step-emoji">${step.emoji}</span>
        <h3 class="step-title">${escapeHtml(step.title)}</h3>
      </div>
      <p class="step-explanation">${escapeHtml(step.explanation)}</p>
      <pre class="code-block" style="background:${codeBg};border-color:${codeBorder}"><code>${escapeHtml(step.code)}</code></pre>
    </div>
  `).join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>LeetMind — ${escapeHtml(data.problemTitle)}</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    @page {
      size: A4;
      margin: 1.8cm 1.5cm;
    }

    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      font-size: 10.5pt;
      line-height: 1.65;
      color: #1a1a1a;
      background: white;
    }

    /* ── Header ── */
    .header {
      border-bottom: 2px solid ${accent};
      padding-bottom: 10px;
      margin-bottom: 18px;
    }
    .header-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 8px;
    }
    .brand {
      font-size: 10pt;
      font-weight: 700;
      color: ${accent};
      letter-spacing: 1px;
      text-transform: uppercase;
    }
    .title {
      font-size: 18pt;
      font-weight: 800;
      color: #0f172a;
      margin: 6px 0 4px;
    }
    .badges {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }
    .badge {
      display: inline-block;
      padding: 2px 10px;
      border-radius: 20px;
      font-size: 8.5pt;
      font-weight: 700;
    }
    .badge-difficulty {
      background: ${difficultyBg(data.difficulty)};
      color: ${difficultyColor(data.difficulty)};
    }
    .badge-approach {
      background: ${accentLight};
      color: ${accent};
    }

    /* ── Overview ── */
    .overview {
      background: ${accentLight};
      border-left: 4px solid ${accent};
      padding: 10px 14px;
      margin-bottom: 22px;
      border-radius: 0 6px 6px 0;
      font-size: 10.5pt;
      color: #1e293b;
    }

    /* ── Section heading ── */
    .section-title {
      font-size: 11pt;
      font-weight: 700;
      color: ${accent};
      text-transform: uppercase;
      letter-spacing: 0.8px;
      margin: 22px 0 10px;
      border-bottom: 1px solid ${isColor ? '#d1fae5' : '#ccc'};
      padding-bottom: 4px;
    }

    /* ── Steps ── */
    .step {
      margin-bottom: 16px;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .step-header {
      display: flex;
      align-items: baseline;
      gap: 6px;
      margin-bottom: 4px;
    }
    .step-num {
      font-size: 8pt;
      font-weight: 800;
      font-family: monospace;
      min-width: 22px;
    }
    .step-emoji {
      font-size: 13pt;
    }
    .step-title {
      font-size: 11.5pt;
      font-weight: 700;
      color: #0f172a;
    }
    .step-explanation {
      margin: 4px 0 6px 28px;
      color: #374151;
      font-size: 10pt;
    }
    .code-block {
      margin-left: 28px;
      padding: 10px 12px;
      border-radius: 6px;
      border: 1px solid;
      font-family: 'Consolas', 'Courier New', monospace;
      font-size: 8.5pt;
      line-height: 1.5;
      white-space: pre-wrap;
      word-break: break-all;
      color: #1e293b;
      page-break-inside: avoid;
      break-inside: avoid;
    }

    /* ── Complexity ── */
    .complexity-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-bottom: 8px;
    }
    .complexity-card {
      border: 1px solid ${isColor ? '#d1fae5' : '#ccc'};
      border-radius: 6px;
      padding: 8px 12px;
      background: ${accentLight};
    }
    .complexity-label {
      font-size: 8pt;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #6b7280;
      margin-bottom: 2px;
    }
    .complexity-value {
      font-family: monospace;
      font-size: 14pt;
      font-weight: 800;
      color: ${accent};
    }
    .complexity-explanation {
      font-size: 9.5pt;
      color: #4b5563;
      font-style: italic;
    }

    /* ── Tip & Fact ── */
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-top: 4px;
    }
    .info-card {
      padding: 10px 12px;
      border-radius: 6px;
      border: 1px solid;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .info-card-label {
      font-size: 8.5pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }
    .info-card-body {
      font-size: 9.5pt;
      line-height: 1.6;
    }
    .tip-card  { background: ${tipBg};  border-color: ${tipBorder}; }
    .tip-label { color: ${tipText}; }
    .tip-body  { color: ${tipText}; }
    .fact-card  { background: ${factBg};  border-color: ${factBorder}; }
    .fact-label { color: ${factText}; }
    .fact-body  { color: ${factText}; }

    /* ── Full Solution ── */
    .full-solution {
      margin-top: 6px;
      page-break-inside: avoid;
      break-inside: avoid;
    }

    /* ── Footer ── */
    .footer {
      margin-top: 24px;
      padding-top: 8px;
      border-top: 1px solid #e2e8f0;
      font-size: 8pt;
      color: #9ca3af;
      display: flex;
      justify-content: space-between;
    }

    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>

  <!-- Header -->
  <div class="header">
    <div class="header-top">
      <span class="brand">LeetMind</span>
      <span style="font-size:8pt;color:#9ca3af;">${new Date().toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' })}</span>
    </div>
    <h1 class="title">${escapeHtml(data.problemTitle)}</h1>
    <div class="badges">
      <span class="badge badge-difficulty">${escapeHtml(data.difficulty)}</span>
      <span class="badge badge-approach">⚡ ${escapeHtml(data.approach)}</span>
    </div>
  </div>

  <!-- Problem Overview -->
  <div class="overview">${escapeHtml(data.storyIntro)}</div>

  <!-- Steps -->
  <div class="section-title">Solution Walkthrough (${data.steps.length} steps)</div>
  ${stepsHtml}

  <!-- Complexity -->
  <div class="section-title">Complexity Analysis</div>
  <div class="complexity-grid">
    <div class="complexity-card">
      <div class="complexity-label">Time Complexity</div>
      <div class="complexity-value">${escapeHtml(data.complexityBreakdown.time)}</div>
    </div>
    <div class="complexity-card">
      <div class="complexity-label">Space Complexity</div>
      <div class="complexity-value">${escapeHtml(data.complexityBreakdown.space)}</div>
    </div>
  </div>
  <p class="complexity-explanation">${escapeHtml(data.complexityBreakdown.explanation)}</p>

  <!-- Pro Tip + Fun Fact -->
  <div class="section-title">Insights</div>
  <div class="info-grid">
    <div class="info-card tip-card">
      <div class="info-card-label tip-label">💡 Pro Tip</div>
      <div class="info-card-body tip-body">${escapeHtml(data.proTip)}</div>
    </div>
    <div class="info-card fact-card">
      <div class="info-card-label fact-label">🏆 Fun Fact</div>
      <div class="info-card-body fact-body">${escapeHtml(data.funFact)}</div>
    </div>
  </div>

  <!-- Full Solution -->
  <div class="section-title">Complete Solution</div>
  <div class="full-solution">
    <pre class="code-block" style="background:${codeBg};border-color:${codeBorder};margin-left:0"><code>${escapeHtml(data.fullSolution)}</code></pre>
  </div>

  <!-- Footer -->
  <div class="footer">
    <span>LeetMind — Algorithm Learning Tool</span>
    <span>${escapeHtml(data.problemTitle)} · ${escapeHtml(data.difficulty)} · ${escapeHtml(data.approach)}</span>
  </div>

  <script>
    window.onload = function() { window.print(); };
  </script>
</body>
</html>`;

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups for this site to enable PDF download.');
    return;
  }
  printWindow.document.write(html);
  printWindow.document.close();
}
