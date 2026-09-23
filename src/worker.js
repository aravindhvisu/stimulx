// Cloudflare Worker Handler for Stimulx (stimulx.in)
// Mode: Pre-Launch / Professional Under Development & Calibration Shield

const COMING_SOON_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Stimulx.in — Indian Behavioural Science Infrastructure | Under Development</title>
  <meta name="description" content="Stimulx is the upcoming open behavioural science and experimental psychology platform for Indian research institutions. Currently in private calibration.">
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236366f1' stroke-width='2'><path d='M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5'/></svg>">
  <style>
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      background-color: #07090e;
      color: #e2e8f0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow-x: hidden;
      position: relative;
    }
    /* Subtle background grid and glow */
    body::before {
      content: "";
      position: fixed;
      inset: 0;
      background: radial-gradient(circle at 50% 20%, rgba(99, 102, 241, 0.15) 0%, rgba(6, 182, 212, 0.05) 45%, transparent 70%);
      pointer-events: none;
      z-index: 0;
    }
    .grid-lines {
      position: fixed;
      inset: 0;
      background-size: 40px 40px;
      background-image: 
        linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
      pointer-events: none;
      z-index: 0;
    }
    .wrapper {
      position: relative;
      z-index: 1;
      max-width: 1080px;
      margin: 0 auto;
      padding: 3rem 1.5rem;
      width: 100%;
    }
    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 3.5rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.07);
    }
    .logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      text-decoration: none;
    }
    .logo-icon {
      width: 36px;
      height: 36px;
      background: linear-gradient(135deg, #6366f1 0%, #06b6d4 100%);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 20px rgba(99, 102, 241, 0.35);
    }
    .logo-text {
      font-size: 1.35rem;
      font-weight: 800;
      letter-spacing: -0.02em;
      color: #ffffff;
    }
    .logo-text span {
      color: #38bdf8;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      background: rgba(99, 102, 241, 0.12);
      border: 1px solid rgba(99, 102, 241, 0.3);
      color: #a5b4fc;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      padding: 0.35rem 0.85rem;
      border-radius: 9999px;
    }
    .badge-dot {
      width: 7px;
      height: 7px;
      background: #38bdf8;
      border-radius: 50%;
      animation: pulse 2s infinite ease-in-out;
    }
    @keyframes pulse {
      0%, 100% { opacity: 0.3; transform: scale(0.9); }
      50% { opacity: 1; transform: scale(1.2); }
    }
    .hero {
      text-align: center;
      margin-bottom: 3.5rem;
    }
    .hero h1 {
      font-size: clamp(2.1rem, 5vw, 3.4rem);
      font-weight: 800;
      line-height: 1.15;
      letter-spacing: -0.03em;
      color: #ffffff;
      margin-bottom: 1.25rem;
    }
    .hero h1 span.gradient {
      background: linear-gradient(135deg, #a5b4fc 0%, #38bdf8 50%, #818cf8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .hero p {
      max-width: 680px;
      margin: 0 auto;
      font-size: 1.1rem;
      line-height: 1.65;
      color: #94a3b8;
    }
    /* Calibration Status Bar */
    .status-card {
      background: rgba(15, 23, 42, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.09);
      backdrop-filter: blur(12px);
      border-radius: 14px;
      padding: 1.5rem 2rem;
      margin-bottom: 3rem;
      box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
    }
    .status-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.85rem;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    .status-title {
      font-size: 0.85rem;
      font-weight: 700;
      color: #cbd5e1;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .status-phase {
      font-size: 0.85rem;
      color: #38bdf8;
      font-weight: 600;
    }
    .progress-bar-bg {
      width: 100%;
      height: 8px;
      background: rgba(255, 255, 255, 0.06);
      border-radius: 9999px;
      overflow: hidden;
      margin-bottom: 0.75rem;
    }
    .progress-bar-fill {
      width: 78%;
      height: 100%;
      background: linear-gradient(90deg, #6366f1 0%, #06b6d4 100%);
      border-radius: 9999px;
      animation: shimmer 2s infinite linear;
    }
    .status-meta {
      display: flex;
      justify-content: space-between;
      font-size: 0.8rem;
      color: #64748b;
    }
    /* Feature Grid */
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.25rem;
      margin-bottom: 3.5rem;
    }
    .card {
      background: rgba(15, 23, 42, 0.55);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 12px;
      padding: 1.35rem;
      transition: border-color 0.2s ease, transform 0.2s ease;
    }
    .card:hover {
      border-color: rgba(99, 102, 241, 0.35);
      transform: translateY(-2px);
    }
    .card-icon {
      font-size: 1.4rem;
      margin-bottom: 0.75rem;
      display: inline-block;
    }
    .card h3 {
      font-size: 0.95rem;
      font-weight: 700;
      color: #f1f5f9;
      margin-bottom: 0.4rem;
    }
    .card p {
      font-size: 0.825rem;
      color: #8da2bb;
      line-height: 1.5;
    }
    /* Action & Contact Section */
    .contact-box {
      background: linear-gradient(180deg, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.6) 100%);
      border: 1px solid rgba(99, 102, 241, 0.25);
      border-radius: 14px;
      padding: 2rem;
      text-align: center;
      margin-bottom: 2rem;
    }
    .contact-box h2 {
      font-size: 1.25rem;
      color: #ffffff;
      margin-bottom: 0.5rem;
    }
    .contact-box p {
      font-size: 0.9rem;
      color: #94a3b8;
      max-width: 580px;
      margin: 0 auto 1.5rem;
    }
    .buttons {
      display: flex;
      justify-content: center;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.65rem 1.4rem;
      border-radius: 8px;
      font-size: 0.875rem;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.2s ease;
    }
    .btn-primary {
      background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
      color: #ffffff;
      box-shadow: 0 4px 14px rgba(99, 102, 241, 0.35);
    }
    .btn-primary:hover {
      background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%);
      transform: translateY(-1px);
    }
    .btn-secondary {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.12);
      color: #cbd5e1;
    }
    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.09);
      color: #ffffff;
    }
    footer {
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      padding: 2rem 1.5rem;
      text-align: center;
      font-size: 0.8rem;
      color: #64748b;
      position: relative;
      z-index: 1;
    }
    footer a {
      color: #94a3b8;
      text-decoration: none;
    }
    footer a:hover {
      color: #38bdf8;
    }
  </style>
</head>
<body>
  <div class="grid-lines"></div>
  <div class="wrapper">
    <header>
      <a href="/" class="logo">
        <div class="logo-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
        </div>
        <div class="logo-text">Stimulx<span>.in</span></div>
      </a>
      <div class="badge">
        <span class="badge-dot"></span>
        Under Active Engineering
      </div>
    </header>

    <main>
      <div class="hero">
        <h1>
          Building India's Open Infrastructure for<br>
          <span class="gradient">Behavioural & Cognitive Science</span>
        </h1>
        <p>
          Stimulx is undergoing rigorous lab validation, sub-millisecond reaction-time calibration, and ICMR 2017 & DPDP 2023 ethics standardization with academic partners. The public platform will launch once all verification benchmarks are achieved.
        </p>
      </div>

      <div class="status-card">
        <div class="status-header">
          <div class="status-title">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            Deployment Status: Closed Pre-Launch Calibration
          </div>
          <div class="status-phase">Stage 7 / 11 Complete (78%)</div>
        </div>
        <div class="progress-bar-bg">
          <div class="progress-bar-fill"></div>
        </div>
        <div class="status-meta">
          <span>Target Audience: NIMHANS, IISc, AIIMS, IITs, Central Universities</span>
          <span>Public Release: Expected Q4 2026</span>
        </div>
      </div>

      <div class="grid">
        <div class="card">
          <div class="card-icon">⚡</div>
          <h3>Gorilla-Standard Task Studio</h3>
          <p>Visual canvas with multi-zone displays, spreadsheet variable binding ($$cue), and deterministic trial sequences.</p>
        </div>
        <div class="card">
          <div class="card-icon">⏱️</div>
          <h3>Sub-Millisecond Engine</h3>
          <p>Microsecond precision timing utilizing <code>performance.now()</code> and high-frequency trial logging.</p>
        </div>
        <div class="card">
          <div class="card-icon">🇮🇳</div>
          <h3>DPDP 2023 & ICMR Ethics</h3>
          <p>Built-in micro-consent schemas, zero-PII data pipelines, and cryptographic pre-registration certificates.</p>
        </div>
        <div class="card">
          <div class="card-icon">📊</div>
          <h3>Tidy Research Exports</h3>
          <p>Automated Long-format tidy CSV, SPSS, jamovi, and R syntax pipelines ready for academic peer review.</p>
        </div>
      </div>

      <div class="contact-box">
        <h2>Institutional Lab Access & Research Enquiries</h2>
        <p>
          Are you a Principal Investigator, PhD researcher, or academic laboratory seeking early protocol testing or multi-centre collaboration?
        </p>
        <div class="buttons">
          <a href="mailto:aravindhvisu@gmail.com?subject=Stimulx%20Early%20Lab%20Access%20Request" class="btn btn-primary">
            Request Early Access
          </a>
          <a href="https://github.com/aravindhvisu/stimulx" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">
            View GitHub Repository
          </a>
        </div>
      </div>
    </main>
  </div>

  <footer>
    <p>
      &copy; 2026 Stimulx (stimulx.in) &bull; Indian Behavioural Science Research Infrastructure &bull; Compliant with DPDP Act 2023 &amp; ICMR 2017 Guidelines
    </p>
  </footer>
</body>
</html>`;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 1. Check for preview bypass query parameter (?preview=stimulx2026) or existing cookie
    const hasPreviewParam = url.searchParams.get("preview") === "stimulx2026";
    const cookieHeader = request.headers.get("Cookie") || "";
    const hasPreviewCookie = cookieHeader.includes("stimulx_preview=active");

    if (hasPreviewParam || hasPreviewCookie) {
      // Allow access to the full application assets
      try {
        const response = await env.ASSETS.fetch(request);
        if (hasPreviewParam) {
          // Set cookie so navigation inside preview remains unlocked
          const headers = new Headers(response.headers);
          headers.append("Set-Cookie", "stimulx_preview=active; Path=/; HttpOnly; Max-Age=86400; SameSite=Lax");
          return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers,
          });
        }
        return response;
      } catch (err) {
        return new Response("Not Found", { status: 404 });
      }
    }

    // 2. Allow favicon or robots.txt if needed
    if (url.pathname === "/robots.txt") {
      return new Response("User-agent: *\nDisallow: /", {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }

    // 3. For all public visitors on stimulx.in, serve the professional Under Development / Calibration Shield
    return new Response(COMING_SOON_HTML, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "X-Robots-Tag": "noindex, nofollow",
      },
    });
  },
};
