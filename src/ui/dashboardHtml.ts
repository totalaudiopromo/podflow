export const DASHBOARD_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Podflow | Podcast Intelligence Dashboard</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-dark: #020617;
      --panel-bg: rgba(15, 23, 42, 0.6);
      --panel-border: rgba(255, 255, 255, 0.08);
      --accent-primary: #0e7490;
      --accent-secondary: #2563EB;
      --accent-glow: rgba(14, 116, 144, 0.2);
      --text-main: #f1f5f9;
      --text-muted: #cbd5e1;
      --text-dark: #94a3b8;
      --green-glow: rgba(16, 185, 129, 0.15);
      --green-text: #34d399;
      --red-glow: rgba(239, 68, 68, 0.15);
      --red-text: #f87171;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    .logo-text, .page-title, .page-subtitle, .modal-title, .metric-value, h1, h2, h3, h4, .btn, .tab-btn {
      font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background-color: var(--bg-dark);
      background-image: 
        radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.12) 0px, transparent 50%),
        radial-gradient(at 100% 100%, rgba(139, 92, 246, 0.12) 0px, transparent 50%);
      background-attachment: fixed;
      color: var(--text-main);
      min-height: 100vh;
      overflow-x: hidden;
      display: flex;
    }

    /* Layout */
    .sidebar {
      width: 280px;
      border-right: 1px solid var(--panel-border);
      background: rgba(10, 15, 30, 0.85);
      backdrop-filter: blur(20px);
      padding: 32px 24px;
      display: flex;
      flex-direction: column;
      height: 100vh;
      position: fixed;
      left: 0;
      top: 0;
      z-index: 100;
    }

    .main-content {
      margin-left: 280px;
      flex: 1;
      padding: 40px;
      min-height: 100vh;
      max-width: calc(100% - 280px);
    }

    /* Sidebar Logo */
    .logo-container {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 48px;
    }

    .logo-icon {
      background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
      width: 40px;
      height: 40px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 20px;
      box-shadow: 0 4px 20px var(--accent-glow);
    }

    .logo-text {
      font-size: 24px;
      font-weight: 700;
      letter-spacing: -0.5px;
      background: linear-gradient(to right, #ffffff, #a5b4fc);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    /* Sidebar Menu */
    .menu-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .menu-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 14px 18px;
      border-radius: 12px;
      cursor: pointer;
      color: var(--text-muted);
      font-weight: 500;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border: 1px solid transparent;
    }

    .menu-item:hover {
      color: var(--text-main);
      background: rgba(255, 255, 255, 0.03);
    }

    .menu-item.active {
      color: var(--text-main);
      background: rgba(139, 92, 246, 0.1);
      border-color: rgba(139, 92, 246, 0.25);
      box-shadow: inset 0 0 12px rgba(139, 92, 246, 0.05);
    }

    .menu-item svg {
      width: 20px;
      height: 20px;
      transition: transform 0.3s;
    }

    .menu-item:hover svg {
      transform: scale(1.1);
    }

    .sidebar-footer {
      margin-top: auto;
      border-top: 1px solid var(--panel-border);
      padding-top: 24px;
      font-size: 13px;
      color: var(--text-dark);
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    /* Content Pages */
    .page {
      display: none;
      animation: fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .page.active {
      display: block;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .header-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
    }

    .page-title {
      font-size: 32px;
      font-weight: 700;
      letter-spacing: -0.5px;
    }

    .page-subtitle {
      font-size: 16px;
      color: var(--text-muted);
      margin-top: 4px;
    }

    /* Button styles */
    .btn {
      background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
      border: none;
      color: white;
      padding: 12px 24px;
      font-family: inherit;
      font-size: 15px;
      font-weight: 600;
      border-radius: 12px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      transition: all 0.3s;
      box-shadow: 0 4px 15px var(--accent-glow);
    }

    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(139, 92, 246, 0.3);
    }

    .btn:active {
      transform: translateY(0);
    }

    .btn-secondary {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--panel-border);
      color: var(--text-main);
      box-shadow: none;
    }

    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.08);
      box-shadow: none;
      transform: translateY(-1px);
    }

    .btn-danger {
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.2);
      color: var(--red-text);
      box-shadow: none;
    }

    .btn-danger:hover {
      background: rgba(239, 68, 68, 0.2);
      transform: translateY(-1px);
    }

    /* Glassmorphism Cards */
    .glass-panel {
      background: var(--panel-bg);
      border: 1px solid var(--panel-border);
      border-radius: 20px;
      padding: 28px;
      backdrop-filter: blur(20px);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
      margin-bottom: 28px;
    }

    /* Metrics Grid */
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 24px;
      margin-bottom: 32px;
    }

    .metric-card {
      background: var(--panel-bg);
      border: 1px solid var(--panel-border);
      border-radius: 20px;
      padding: 24px;
      backdrop-filter: blur(20px);
      display: flex;
      flex-direction: column;
    }

    .metric-label {
      font-size: 14px;
      font-weight: 500;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 8px;
    }

    .metric-value {
      font-size: 36px;
      font-weight: 700;
      background: linear-gradient(to right, #ffffff, #cbd5e1);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .metric-footer {
      font-size: 13px;
      color: var(--text-dark);
      margin-top: 8px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    /* Dashboard Layout */
    .dashboard-layout {
      display: grid;
      grid-template-columns: 3fr 2fr;
      gap: 28px;
    }

    /* Search & Filter bar */
    .filter-bar {
      display: flex;
      gap: 16px;
      margin-bottom: 24px;
    }

    .search-input-wrapper {
      flex: 1;
      position: relative;
    }

    .search-input {
      width: 100%;
      background: rgba(10, 15, 30, 0.5);
      border: 1px solid var(--panel-border);
      padding: 12px 16px 12px 44px;
      border-radius: 12px;
      font-family: inherit;
      color: var(--text-main);
      font-size: 15px;
      transition: all 0.3s;
    }

    .search-input:focus {
      outline: none;
      border-color: var(--accent-primary);
      box-shadow: 0 0 15px var(--accent-glow);
    }

    .search-icon {
      position: absolute;
      left: 14px;
      top: 50%;
      transform: translateY(-50%);
      width: 18px;
      height: 18px;
      color: var(--text-muted);
    }

    .checkbox-filter {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: var(--text-muted);
      cursor: pointer;
      user-select: none;
    }

    .checkbox-filter input {
      accent-color: var(--accent-primary);
      width: 16px;
      height: 16px;
    }

    /* Table styles */
    .table-container {
      overflow-x: auto;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }

    .data-table th {
      padding: 14px 18px;
      border-bottom: 1px solid var(--panel-border);
      color: var(--text-muted);
      font-weight: 500;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .data-table td {
      padding: 18px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.03);
      font-size: 15px;
      vertical-align: middle;
    }

    .data-table tr:last-child td {
      border-bottom: none;
    }

    .data-table tr {
      transition: background-color 0.2s;
    }

    .data-table tbody tr:hover {
      background-color: rgba(255, 255, 255, 0.015);
    }

    .text-semibold {
      font-weight: 600;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
    }

    .badge-primary {
      background: rgba(139, 92, 246, 0.15);
      color: #a78bfa;
      border: 1px solid rgba(139, 92, 246, 0.25);
    }

    .badge-success {
      background: var(--green-glow);
      color: var(--green-text);
      border: 1px solid rgba(34, 197, 94, 0.3);
    }

    .badge-warning {
      background: rgba(245, 158, 11, 0.15);
      color: #fbbf24;
      border: 1px solid rgba(245, 158, 11, 0.3);
    }

    /* Key Ideas Topic Tabs */
    .tabs-row {
      display: flex;
      gap: 8px;
      border-bottom: 1px solid var(--panel-border);
      padding-bottom: 14px;
      margin-bottom: 24px;
      overflow-x: auto;
    }

    .tab-btn {
      background: transparent;
      border: 1px solid transparent;
      color: var(--text-muted);
      padding: 10px 18px;
      font-family: inherit;
      font-weight: 500;
      font-size: 15px;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.3s;
      white-space: nowrap;
    }

    .tab-btn:hover {
      color: var(--text-main);
      background: rgba(255, 255, 255, 0.02);
    }

    .tab-btn.active {
      background: rgba(139, 92, 246, 0.1);
      border-color: rgba(139, 92, 246, 0.25);
      color: var(--text-main);
    }

    .ideas-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .idea-card {
      background: rgba(15, 23, 42, 0.3);
      border: 1px solid var(--panel-border);
      border-radius: 14px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      transition: border-color 0.3s;
    }

    .idea-card:hover {
      border-color: rgba(139, 92, 246, 0.3);
    }

    .idea-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 16px;
    }

    .idea-title {
      font-size: 16px;
      font-weight: 600;
      line-height: 1.5;
    }

    .idea-source {
      font-size: 13px;
      color: var(--text-dark);
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .idea-footer {
      display: flex;
      gap: 8px;
    }

    /* Terminal stream for runner */
    .terminal-container {
      background: #020617;
      border: 1px solid var(--panel-border);
      border-radius: 14px;
      padding: 20px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 14px;
      color: #94a3b8;
      height: 250px;
      overflow-y: auto;
      margin-bottom: 20px;
      display: none;
      box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.8);
    }

    .terminal-line {
      margin-bottom: 6px;
      line-height: 1.6;
      white-space: pre-wrap;
    }

    .terminal-line.success { color: #4ade80; }
    .terminal-line.error { color: #f87171; }
    .terminal-line.info { color: #818cf8; }

    /* Form Styles */
    .form-group {
      margin-bottom: 20px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .form-label {
      display: block;
      font-size: 14px;
      font-weight: 500;
      color: var(--text-muted);
      margin-bottom: 8px;
    }

    .form-input, .form-textarea, .form-select {
      width: 100%;
      background: rgba(10, 15, 30, 0.5);
      border: 1px solid var(--panel-border);
      padding: 12px 16px;
      border-radius: 10px;
      font-family: inherit;
      color: var(--text-main);
      font-size: 15px;
      transition: all 0.3s;
    }

    .form-input:focus, .form-textarea:focus, .form-select:focus {
      outline: none;
      border-color: var(--accent-primary);
      box-shadow: 0 0 12px var(--accent-glow);
    }

    .form-textarea {
      resize: vertical;
      min-height: 100px;
    }

    .form-select option {
      background: #0f172a;
      color: var(--text-main);
    }

    /* Interests List in Config */
    .config-interests-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 16px;
    }

    .interest-item {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid var(--panel-border);
      border-radius: 12px;
      padding: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
    }

    .interest-details h4 {
      font-size: 15px;
      font-weight: 600;
      margin-bottom: 4px;
    }

    .interest-details p {
      font-size: 13px;
      color: var(--text-muted);
      margin-bottom: 6px;
    }

    .interest-keywords {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .keyword-pill {
      background: rgba(255, 255, 255, 0.05);
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 11px;
      color: var(--text-muted);
    }

    .add-interest-box {
      border: 1px dashed var(--panel-border);
      border-radius: 12px;
      padding: 20px;
      background: rgba(255, 255, 255, 0.01);
    }

    /* Feeds list styles */
    .feed-list-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 14px 18px;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid var(--panel-border);
      border-radius: 12px;
      margin-bottom: 10px;
    }

    .feed-url {
      font-family: 'JetBrains Mono', monospace;
      font-size: 13px;
      color: var(--text-muted);
      word-break: break-all;
    }

    /* Modal styles */
    .modal {
      display: none;
      position: fixed;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 1000;
      background: rgba(2, 6, 17, 0.7);
      backdrop-filter: blur(8px);
      align-items: center;
      justify-content: center;
      animation: fadeIn 0.3s;
    }

    .modal-content {
      background: #0f172a;
      border: 1px solid var(--panel-border);
      width: 100%;
      max-width: 600px;
      border-radius: 20px;
      padding: 32px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
      animation: scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    @keyframes scaleUp {
      from { transform: scale(0.95); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .modal-title {
      font-size: 22px;
      font-weight: 700;
    }

    .modal-close {
      cursor: pointer;
      color: var(--text-muted);
      background: transparent;
      border: none;
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: background 0.2s;
    }

    .modal-close:hover {
      background: rgba(255, 255, 255, 0.05);
      color: var(--text-main);
    }

    /* Scrollbars */
    ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }

    ::-webkit-scrollbar-track {
      background: rgba(10, 15, 30, 0.3);
    }

    ::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.08);
      border-radius: 4px;
    }

    ::-webkit-scrollbar-thumb:hover {
      background: rgba(255, 255, 255, 0.15);
    }
  </style>
</head>
<body>

  <!-- Sidebar -->
  <div class="sidebar">
    <div class="logo-container">
      <div class="logo-icon" style="background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));">PF</div>
      <div class="logo-text">Podflow</div>
      <span class="preview-badge" style="background: rgba(14, 116, 144, 0.15); color: #06b6d4; border: 1px solid rgba(14, 116, 144, 0.3); font-size: 9px; font-weight: 700; padding: 2px 6px; border-radius: 4px; text-transform: uppercase; margin-left: 6px;">TAP Family</span>
    </div>
    <ul class="menu-list">
      <li class="menu-item active" data-page="dashboard">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
        </svg>
        Dashboard
      </li>
      <li class="menu-item" data-page="guests">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        Guest Index
      </li>
      <li class="menu-item" data-page="ideas">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        Key Ideas
      </li>
      <li class="menu-item" data-page="feeds">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 5c7.18 0 13 5.82 13 13M6 11a7 7 0 017 7m-6 0a1 1 0 11-2 0 1 1 0 012 0z" />
        </svg>
        Feeds & OPML
      </li>
      <li class="menu-item" data-page="config">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Settings
      </li>
    </ul>
    <div class="sidebar-footer" style="gap: 8px;">
      <div style="font-weight: 600; color: var(--text-main); display: flex; align-items: center; gap: 6px; font-family: 'Space Grotesk', sans-serif;">
        <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: #06b6d4;"></span>
        Total Audio Promo
      </div>
      <div style="font-size: 11px; line-height: 1.4; color: var(--text-dark);">
        <a href="https://totalaudiopromo.com" target="_blank" style="color: var(--text-dark); text-decoration: none; transition: color 0.2s;">totalaudiopromo.com</a><br>
        <a href="https://newsjack.cc" target="_blank" style="color: var(--text-dark); text-decoration: none; transition: color 0.2s;">newsjack.cc</a> | 
        <a href="https://spotcheck.cc" target="_blank" style="color: var(--text-dark); text-decoration: none; transition: color 0.2s;">spotcheck.cc</a>
      </div>
      <div style="border-top: 1px solid var(--panel-border); padding-top: 8px; margin-top: 4px; font-size: 11px;">
        <span id="db-status-badge">Apple Podcasts: Detecting...</span>
      </div>
    </div>
  </div>

  <!-- Main Content -->
  <div class="main-content">
    
    <!-- 1. DASHBOARD PAGE -->
    <div id="page-dashboard" class="page active">
      <div class="header-row">
        <div>
          <h1 class="page-title">Podcast Intelligence</h1>
          <p class="page-subtitle">Actionable insights from your podcast library</p>
        </div>
        <div>
          <button class="btn" id="run-digest-btn">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.253 8H18" />
            </svg>
            Trigger Digest Run
          </button>
        </div>
      </div>

      <!-- Metrics -->
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-label">Episodes Digest</div>
          <div class="metric-value" id="stat-processed">0</div>
          <div class="metric-footer" id="stat-last-run">No runs recorded</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Guests Tracked</div>
          <div class="metric-value" id="stat-guests">0</div>
          <div class="metric-footer" id="stat-followworthy-count">0 follow-worthy</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Tactical Ideas</div>
          <div class="metric-value" id="stat-ideas">0</div>
          <div class="metric-footer">Extracted across interests</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">AI Spend</div>
          <div class="metric-value" id="stat-cost">$0.00</div>
          <div class="metric-footer">Token usage estimation</div>
        </div>
      </div>

      <!-- Live Terminal Runner -->
      <div class="terminal-container" id="runner-terminal"></div>

      <!-- Dashboard Layout -->
      <div class="dashboard-layout">
        <!-- High Relevance Episodes -->
        <div class="glass-panel">
          <h2 style="font-size: 20px; margin-bottom: 20px;">Top Recommended Episodes</h2>
          <div class="ideas-list" id="dashboard-relevance-list">
            <!-- Dynamically populated -->
            <div style="color: var(--text-dark); text-align: center; padding: 20px;">No episodes processed yet. Trigger a digest to extract insights.</div>
          </div>
        </div>

        <!-- System Overview -->
        <div class="glass-panel">
          <h2 style="font-size: 20px; margin-bottom: 20px;">Interest Focus</h2>
          <div class="config-interests-list" id="dashboard-interests-list" style="margin-bottom: 0;">
            <!-- Dynamically populated -->
          </div>
        </div>
      </div>
    </div>

    <!-- 2. GUESTS PAGE -->
    <div id="page-guests" class="page">
      <div class="header-row">
        <div>
          <h1 class="page-title">Guest Database</h1>
          <p class="page-subtitle">Track podcast appearances, roles, and networking options</p>
        </div>
      </div>

      <div class="glass-panel">
        <div class="filter-bar">
          <div class="search-input-wrapper">
            <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" class="search-input" id="guest-search" placeholder="Search guests by name, role, company...">
          </div>
          <label class="checkbox-filter">
            <input type="checkbox" id="guest-followworthy-filter">
            Only Recommended
          </label>
        </div>

        <div class="table-container">
          <table class="data-table" id="guests-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role & Company</th>
                <th>Appearances</th>
                <th>Follow Advice</th>
              </tr>
            </thead>
            <tbody id="guests-table-body">
              <!-- Dynamically populated -->
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 3. KEY IDEAS PAGE -->
    <div id="page-ideas" class="page">
      <div class="header-row">
        <div>
          <h1 class="page-title">Extracted Insights</h1>
          <p class="page-subtitle">Actionable tactics categorized by your interest topics</p>
        </div>
      </div>

      <div class="glass-panel">
        <div class="filter-bar" style="margin-bottom: 16px;">
          <div class="search-input-wrapper">
            <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" class="search-input" id="ideas-search" placeholder="Search tactical insights...">
          </div>
          <label class="checkbox-filter">
            <input type="checkbox" id="ideas-actionable-filter">
            Only Actionable
          </label>
        </div>

        <!-- Topic Tabs -->
        <div class="tabs-row" id="topic-tabs-container">
          <!-- Dynamically populated -->
        </div>

        <div class="ideas-list" id="ideas-container">
          <!-- Dynamically populated -->
        </div>
      </div>
    </div>

    <!-- 4. FEEDS & OPML PAGE -->
    <div id="page-feeds" class="page">
      <div class="header-row">
        <div>
          <h1 class="page-title">Podcast Feeds</h1>
          <p class="page-subtitle">Configure podcast RSS feeds to process digests on any OS</p>
        </div>
      </div>

      <div class="dashboard-layout">
        <!-- Active Feeds -->
        <div class="glass-panel">
          <h2 style="font-size: 20px; margin-bottom: 20px;">Active RSS Subscriptions</h2>
          <div id="feeds-list">
            <!-- Dynamically populated -->
          </div>
          <form id="add-feed-form" style="margin-top: 24px; display: flex; gap: 12px;">
            <input type="url" class="form-input" id="new-feed-url" placeholder="Paste podcast RSS feed URL..." required>
            <button type="submit" class="btn">Add Feed</button>
          </form>
        </div>

        <!-- OPML Import -->
        <div class="glass-panel">
          <h2 style="font-size: 20px; margin-bottom: 8px;">OPML Ingestion</h2>
          <p style="font-size: 14px; color: var(--text-muted); margin-bottom: 20px;">
            Import subscriptions in bulk by pasting your OPML XML (exported from Overcast, Pocket Casts, etc.) below.
          </p>
          <div class="form-group">
            <textarea class="form-textarea" id="opml-textarea" placeholder="Paste OPML content here..." style="height: 180px; font-family: monospace; font-size: 12px;"></textarea>
          </div>
          <button class="btn btn-secondary" id="import-opml-btn" style="width: 100%; justify-content: center;">
            Parse & Merge Feeds
          </button>
        </div>
      </div>
    </div>

    <!-- 5. CONFIG PAGE -->
    <div id="page-config" class="page">
      <div class="header-row">
        <div>
          <h1 class="page-title">System Settings</h1>
          <p class="page-subtitle">Personalise your interests, AI parameters, and context</p>
        </div>
      </div>

      <form id="config-form">
        <div class="glass-panel">
          <h2 style="font-size: 20px; margin-bottom: 24px;">AI Extraction Options</h2>
          <div class="form-group">
            <label class="form-label" for="config-about">About Me (Listener Bio)</label>
            <textarea class="form-textarea" id="config-about" placeholder="Describe your background and role so the AI scores episode relevance for you..."></textarea>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="config-provider">AI Provider</label>
              <select class="form-select" id="config-provider">
                <option value="anthropic">Anthropic (Claude)</option>
                <option value="openai">OpenAI (GPT)</option>
                <option value="google">Google (Gemini)</option>
                <option value="ollama">Ollama (Local)</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label" for="config-model">AI Model Name</label>
              <input type="text" class="form-input" id="config-model" placeholder="Model identifier, e.g. claude-haiku-4-5-20251001">
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="config-output">Output Markdown Path</label>
            <input type="text" class="form-input" id="config-output" placeholder="./podflow-digest.md">
          </div>
        </div>

        <div class="glass-panel">
          <div class="header-row" style="margin-bottom: 20px;">
            <h2 style="font-size: 20px;">Topic Categories</h2>
            <button type="button" class="btn btn-secondary" id="add-interest-btn">Add Category</button>
          </div>
          <div class="config-interests-list" id="interests-form-list">
            <!-- Dynamically populated -->
          </div>
        </div>

        <div style="display: flex; gap: 16px; margin-bottom: 40px;">
          <button type="submit" class="btn">Save Configuration</button>
          <button type="button" class="btn btn-secondary" id="reset-config-btn">Reset Defaults</button>
        </div>
      </form>
    </div>
  </div>

  <!-- Interest Edit Modal -->
  <div class="modal" id="interest-modal">
    <div class="modal-content">
      <div class="modal-header">
        <h3 class="modal-title" id="modal-title">Edit Interest Topic</h3>
        <button class="modal-close" id="modal-close">&times;</button>
      </div>
      <form id="interest-modal-form">
        <input type="hidden" id="interest-index">
        <div class="form-group">
          <label class="form-label" for="interest-name">Topic Name</label>
          <input type="text" class="form-input" id="interest-name" placeholder="e.g. Artificial Intelligence" required>
        </div>
        <div class="form-group">
          <label class="form-label" for="interest-why">Why it matters (Goal)</label>
          <input type="text" class="form-input" id="interest-why" placeholder="e.g. Building AI agents for workflow automation" required>
        </div>
        <div class="form-group">
          <label class="form-label" for="interest-keywords">Keywords (Comma separated)</label>
          <input type="text" class="form-input" id="interest-keywords" placeholder="e.g. LLM, RAG, agents, automation" required>
        </div>
        <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px;">
          <button type="button" class="btn btn-secondary" id="modal-cancel">Cancel</button>
          <button type="submit" class="btn">Save Topic</button>
        </div>
      </form>
    </div>
  </div>

  <!-- Client-Side Logic -->
  <script>
    // State management
    let state = {
      cache: {
        lastRun: '',
        lastRunCost: 0,
        processedEpisodes: {},
        guestIndex: {},
        stats: { totalProcessed: 0, totalGuests: 0, totalIdeas: 0, totalCost: 0 }
      },
      config: {
        about: '',
        interests: [],
        podcasts: { podcasts: {}, defaults: { tier: 3, extractGuests: true, extractIdeas: true } },
        provider: 'anthropic',
        model: '',
        outputPath: '',
        feeds: []
      },
      isApplePodcastsAvailable: false,
      activeTopicTab: 'All'
    };

    // DOM Elements
    const menuItems = document.querySelectorAll('.menu-item');
    const pages = document.querySelectorAll('.page');
    const dbStatusBadge = document.getElementById('db-status-badge');

    // Navigation logic
    menuItems.forEach(item => {
      item.addEventListener('click', () => {
        const pageId = item.getAttribute('data-page');
        menuItems.forEach(i => i.classList.remove('active'));
        pages.forEach(p => p.classList.remove('active'));
        
        item.classList.add('active');
        document.getElementById('page-' + pageId).classList.add('active');
      });
    });

    // Fetch initial data
    async function fetchData() {
      try {
        const res = await fetch('/api/data');
        const data = await res.json();
        state.cache = data.cache || state.cache;
        state.config = data.config || state.config;
        state.isApplePodcastsAvailable = data.isApplePodcastsAvailable;

        // Ensure feeds is an array
        if (!state.config.feeds) state.config.feeds = [];

        updateUI();
      } catch (err) {
        console.error('Error loading API data:', err);
      }
    }

    // Refresh UI with state data
    function updateUI() {
      // DB Status
      if (state.isApplePodcastsAvailable) {
        dbStatusBadge.textContent = 'Apple Podcasts: Synced';
        dbStatusBadge.style.color = 'var(--green-text)';
      } else {
        dbStatusBadge.textContent = 'Apple Podcasts: Unavailable';
        dbStatusBadge.style.color = 'var(--text-dark)';
      }

      // Metrics
      document.getElementById('stat-processed').textContent = state.cache.stats.totalProcessed;
      document.getElementById('stat-guests').textContent = state.cache.stats.totalGuests;
      document.getElementById('stat-ideas').textContent = state.cache.stats.totalIdeas;
      document.getElementById('stat-cost').textContent = '$' + state.cache.stats.totalCost.toFixed(2);
      
      const lastRunStr = state.cache.lastRun 
        ? 'Last: ' + state.cache.lastRun.split('T')[0] + ' (+$' + state.cache.lastRunCost.toFixed(2) + ')'
        : 'No runs recorded';
      document.getElementById('stat-last-run').textContent = lastRunStr;

      const guests = Object.values(state.cache.guestIndex);
      const followworthyCount = guests.filter(g => g.followWorthy).length;
      document.getElementById('stat-followworthy-count').textContent = followworthyCount + ' follow-worthy';

      // Config Fields
      document.getElementById('config-about').value = state.config.about || '';
      document.getElementById('config-provider').value = state.config.provider || 'anthropic';
      document.getElementById('config-model').value = state.config.model || '';
      document.getElementById('config-output').value = state.config.outputPath || './podflow-digest.md';

      // Render Subsections
      renderDashboardRelevance();
      renderDashboardInterests();
      renderGuestsTable();
      renderTopicTabs();
      renderIdeas();
      renderFeedsList();
      renderConfigInterests();
    }

    // Render dashboard high relevance episodes
    function renderDashboardRelevance() {
      const list = document.getElementById('dashboard-relevance-list');
      list.innerHTML = '';
      
      const episodes = Object.values(state.cache.processedEpisodes);
      const highRel = episodes
        .filter(ep => ep.relevanceScore >= 6)
        .sort((a, b) => b.relevanceScore - a.relevanceScore)
        .slice(0, 5);

      if (highRel.length === 0) {
        list.innerHTML = '<div style="color: var(--text-dark); text-align: center; padding: 20px;">No high-relevance episodes. Trigger a digest.</div>';
        return;
      }

      highRel.forEach(ep => {
        const card = document.createElement('div');
        card.className = 'idea-card';
        card.innerHTML = \`
          <div class="idea-header">
            <div>
              <div class="idea-title" style="color: var(--text-main); font-weight: 700;">\${ep.title}</div>
              <div class="idea-source">\${ep.podcast} | \${ep.lastPlayed}</div>
            </div>
            <span class="badge \${ep.relevanceScore >= 8 ? 'badge-success' : 'badge-primary'}">Relevance: \${ep.relevanceScore}/10</span>
          </div>
          <p style="font-size: 14px; color: var(--text-muted); line-height: 1.5;">\${ep.relevanceNote || 'No summary note provided.'}</p>
        \`;
        list.appendChild(card);
      });
    }

    // Render dashboard interests list
    function renderDashboardInterests() {
      const container = document.getElementById('dashboard-interests-list');
      container.innerHTML = '';
      
      if (!state.config.interests || state.config.interests.length === 0) {
        container.innerHTML = '<div style="color: var(--text-dark);">No configured interests. Add some in settings.</div>';
        return;
      }

      state.config.interests.forEach(interest => {
        const item = document.createElement('div');
        item.className = 'interest-item';
        item.style.padding = '12px 16px';
        item.innerHTML = \`
          <div class="interest-details">
            <h4 style="margin: 0;">\${interest.name}</h4>
            <p style="margin: 0; font-size: 12px; color: var(--text-muted);">\${interest.why}</p>
          </div>
        \`;
        container.appendChild(item);
      });
    }

    // Render Guests Table
    function renderGuestsTable() {
      const body = document.getElementById('guests-table-body');
      body.innerHTML = '';
      
      const search = document.getElementById('guest-search').value.toLowerCase();
      const followOnly = document.getElementById('guest-followworthy-filter').checked;
      
      const guests = Object.values(state.cache.guestIndex);
      
      const filtered = guests.filter(g => {
        const matchesSearch = g.name.toLowerCase().includes(search) || 
                              (g.role || '').toLowerCase().includes(search) || 
                              (g.company || '').toLowerCase().includes(search);
        const matchesFollow = !followOnly || g.followWorthy;
        return matchesSearch && matchesFollow;
      });

      if (filtered.length === 0) {
        body.innerHTML = '<tr><td colspan="4" style="text-align: center; color: var(--text-dark); padding: 40px;">No guests found matching filters.</td></tr>';
        return;
      }

      filtered.sort((a,b) => b.episodeCount - a.episodeCount).forEach(g => {
        const socialsList = Array.isArray(g.socials) ? g.socials : [];
        const socials = socialsList.length > 0 
          ? '<br><span style="font-size: 11px; color: var(--accent-secondary);">' + socialsList.join(', ') + '</span>'
          : '';

        const badgeHtml = g.followWorthy 
          ? '<span class="badge badge-success" style="margin-left: 6px;">Recommended</span>' 
          : '';

        const tr = document.createElement('tr');
        tr.innerHTML = \`
          <td>
            <div class="text-semibold">\${g.name}\${badgeHtml}</div>
            \${socials}
          </td>
          <td>
            <div style="font-weight: 500;">\${g.role || '-'}</div>
            <div style="font-size: 13px; color: var(--text-muted);">\${g.company || '-'}</div>
          </td>
          <td>
            <span class="badge badge-primary">\${g.episodeCount} \${g.episodeCount === 1 ? 'ep' : 'eps'}</span>
          </td>
          <td style="color: var(--text-muted); font-size: 14px;">
            \${g.whyFollow || (g.followWorthy ? 'Highly relevant guest appearance.' : '-')}
          </td>
        \`;
        body.appendChild(tr);
      });
    }

    // Render Topic Tabs in Key Ideas
    function renderTopicTabs() {
      const container = document.getElementById('topic-tabs-container');
      container.innerHTML = '';

      // All Tab
      const allBtn = document.createElement('button');
      allBtn.className = 'tab-btn' + (state.activeTopicTab === 'All' ? ' active' : '');
      allBtn.textContent = 'All Insights';
      allBtn.addEventListener('click', () => {
        state.activeTopicTab = 'All';
        renderTopicTabs();
        renderIdeas();
      });
      container.appendChild(allBtn);

      if (!state.config.interests) return;

      state.config.interests.forEach(interest => {
        const btn = document.createElement('button');
        btn.className = 'tab-btn' + (state.activeTopicTab === interest.name ? ' active' : '');
        btn.textContent = interest.name;
        btn.addEventListener('click', () => {
          state.activeTopicTab = interest.name;
          renderTopicTabs();
          renderIdeas();
        });
        container.appendChild(btn);
      });
    }

    // Render Key Ideas list
    function renderIdeas() {
      const container = document.getElementById('ideas-container');
      container.innerHTML = '';

      const search = document.getElementById('ideas-search').value.toLowerCase();
      const actionableOnly = document.getElementById('ideas-actionable-filter').checked;

      // Extract all ideas from episodes
      const episodes = Object.values(state.cache.processedEpisodes);
      const allIdeas = [];

      episodes.forEach(ep => {
        if (!ep.keyIdeas) return;
        ep.keyIdeas.forEach(idea => {
          allIdeas.push({
            ...idea,
            episodeTitle: ep.title,
            podcast: ep.podcast,
            pubDate: ep.lastPlayed
          });
        });
      });

      // Filter ideas
      const filtered = allIdeas.filter(idea => {
        const matchesSearch = idea.idea.toLowerCase().includes(search) || 
                              (idea.category || '').toLowerCase().includes(search) || 
                              idea.episodeTitle.toLowerCase().includes(search);
        
        const matchesActionable = !actionableOnly || idea.actionable;
        
        let matchesTab = true;
        if (state.activeTopicTab !== 'All') {
          // Score matches similar to the backend
          const topicWords = state.activeTopicTab.toLowerCase().split(/\s+/);
          const ideaCatLower = (idea.category || '').toLowerCase();
          const score = topicWords.filter(w => ideaCatLower.includes(w)).length;
          matchesTab = score > 0 || ideaCatLower.includes(state.activeTopicTab.toLowerCase());
        }

        return matchesSearch && matchesActionable && matchesTab;
      });

      if (filtered.length === 0) {
        container.innerHTML = '<div style="color: var(--text-dark); text-align: center; padding: 40px;">No insights found matching filters.</div>';
        return;
      }

      // Sort by relevance score
      filtered.sort((a, b) => b.relevance - a.relevance);

      filtered.forEach(item => {
        const card = document.createElement('div');
        card.className = 'idea-card';
        
        const relevanceBadge = item.relevance >= 7 
          ? '<span class="badge badge-success">Score: ' + item.relevance + '</span>'
          : '<span class="badge badge-primary">Score: ' + item.relevance + '</span>';

        const actionableBadge = item.actionable
          ? '<span class="badge badge-warning" style="margin-left: 6px;">Actionable</span>'
          : '';

        card.innerHTML = \`
          <div class="idea-header">
            <div class="idea-title">\${item.idea}</div>
            <div style="display: flex; gap: 6px; align-items: center;">
              \${relevanceBadge}
              \${actionableBadge}
            </div>
          </div>
          <div class="idea-footer">
            <span class="idea-source">\${item.podcast} | \${item.episodeTitle}</span>
            <span class="badge badge-primary" style="background: rgba(255,255,255,0.03); font-size: 10px; border-color: transparent;">Category: \${item.category || 'General'}</span>
          </div>
        \`;
        container.appendChild(card);
      });
    }

    // Render Feeds List
    function renderFeedsList() {
      const container = document.getElementById('feeds-list');
      container.innerHTML = '';

      if (!state.config.feeds || state.config.feeds.length === 0) {
        container.innerHTML = '<div style="color: var(--text-dark); padding: 10px 0;">No active RSS feeds configured. Currently relying entirely on Apple Podcasts library.</div>';
        return;
      }

      state.config.feeds.forEach((url, index) => {
        const item = document.createElement('div');
        item.className = 'feed-list-item';
        item.innerHTML = \`
          <span class="feed-url">\${url}</span>
          <button class="btn btn-danger" style="padding: 6px 12px; font-size: 13px;" onclick="removeFeed(\${index})">Remove</button>
        \`;
        container.appendChild(item);
      });
    }

    // Remove feed from config
    async function removeFeed(index) {
      if (!confirm('Are you sure you want to remove this podcast feed?')) return;
      state.config.feeds.splice(index, 1);
      await saveConfig();
    }

    // Add feed form submission
    document.getElementById('add-feed-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const urlInput = document.getElementById('new-feed-url');
      const url = urlInput.value.trim();
      
      if (!url) return;
      if (!state.config.feeds) state.config.feeds = [];
      
      if (state.config.feeds.includes(url)) {
        alert('This RSS feed is already configured.');
        return;
      }

      state.config.feeds.push(url);
      urlInput.value = '';
      await saveConfig();
    });

    // Parse OPML pasting
    document.getElementById('import-opml-btn').addEventListener('click', async () => {
      const opmlText = document.getElementById('opml-textarea').value.trim();
      if (!opmlText) {
        alert('Please paste some OPML XML structure first.');
        return;
      }

      try {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(opmlText, 'text/xml');
        
        // Find all outlines with xmlUrl
        const outlines = xmlDoc.getElementsByTagName('outline');
        let count = 0;
        
        if (!state.config.feeds) state.config.feeds = [];

        for (let i = 0; i < outlines.length; i++) {
          const xmlUrl = outlines[i].getAttribute('xmlUrl');
          if (xmlUrl && !state.config.feeds.includes(xmlUrl)) {
            state.config.feeds.push(xmlUrl);
            count++;
          }
        }

        if (count > 0) {
          document.getElementById('opml-textarea').value = '';
          alert('Successfully parsed and imported ' + count + ' new RSS feeds!');
          await saveConfig();
        } else {
          alert('No new RSS feed URLs (xmlUrl attributes) were found in the pasted content.');
        }
      } catch (err) {
        alert('Failed to parse XML content. Ensure it is valid OPML/XML.');
        console.error(err);
      }
    });

    // Save config back to local server
    async function saveConfig() {
      try {
        const res = await fetch('/api/config', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(state.config)
        });
        if (res.ok) {
          fetchData();
        } else {
          alert('Failed to save configuration settings.');
        }
      } catch (err) {
        console.error(err);
        alert('API error saving configuration.');
      }
    }

    // Render config interests list
    function renderConfigInterests() {
      const container = document.getElementById('interests-form-list');
      container.innerHTML = '';

      if (!state.config.interests) return;

      state.config.interests.forEach((interest, index) => {
        const item = document.createElement('div');
        item.className = 'interest-item';
        
        const keywordsHtml = interest.keywords.map(kw => '<span class="keyword-pill">' + kw + '</span>').join('');

        item.innerHTML = \`
          <div class="interest-details">
            <h4>\${interest.name}</h4>
            <p>\${interest.why}</p>
            <div class="interest-keywords">\${keywordsHtml}</div>
          </div>
          <div style="display: flex; gap: 8px;">
            <button type="button" class="btn btn-secondary" style="padding: 6px 12px; font-size: 13px;" onclick="openInterestModal(\${index})">Edit</button>
            <button type="button" class="btn btn-danger" style="padding: 6px 12px; font-size: 13px;" onclick="deleteInterest(\${index})">Delete</button>
          </div>
        \`;
        container.appendChild(item);
      });
    }

    // Modal Operations
    const modal = document.getElementById('interest-modal');
    const modalForm = document.getElementById('interest-modal-form');
    
    window.openInterestModal = function(index) {
      document.getElementById('interest-index').value = index;
      
      if (index === -1) {
        document.getElementById('modal-title').textContent = 'Add Interest Topic';
        document.getElementById('interest-name').value = '';
        document.getElementById('interest-why').value = '';
        document.getElementById('interest-keywords').value = '';
      } else {
        const interest = state.config.interests[index];
        document.getElementById('modal-title').textContent = 'Edit Interest Topic';
        document.getElementById('interest-name').value = interest.name;
        document.getElementById('interest-why').value = interest.why;
        document.getElementById('interest-keywords').value = interest.keywords.join(', ');
      }
      
      modal.style.display = 'flex';
    };

    document.getElementById('modal-close').addEventListener('click', closeModal);
    document.getElementById('modal-cancel').addEventListener('click', closeModal);
    
    function closeModal() {
      modal.style.display = 'none';
    }

    modalForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const index = parseInt(document.getElementById('interest-index').value, 10);
      const name = document.getElementById('interest-name').value.trim();
      const why = document.getElementById('interest-why').value.trim();
      const keywordsRaw = document.getElementById('interest-keywords').value;
      
      const keywords = keywordsRaw.split(',')
        .map(kw => kw.trim())
        .filter(kw => kw.length > 0);

      const interestObj = { name, why, keywords };

      if (index === -1) {
        if (!state.config.interests) state.config.interests = [];
        state.config.interests.push(interestObj);
      } else {
        state.config.interests[index] = interestObj;
      }

      closeModal();
      await saveConfig();
    });

    window.deleteInterest = async function(index) {
      if (!confirm('Are you sure you want to delete this topic category?')) return;
      state.config.interests.splice(index, 1);
      await saveConfig();
    };

    document.getElementById('add-interest-btn').addEventListener('click', () => {
      openInterestModal(-1);
    });

    // Config form saving
    document.getElementById('config-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      state.config.about = document.getElementById('config-about').value.trim();
      state.config.provider = document.getElementById('config-provider').value;
      state.config.model = document.getElementById('config-model').value.trim();
      state.config.outputPath = document.getElementById('config-output').value.trim();
      
      await saveConfig();
      alert('Configuration saved successfully!');
    });

    // Reset Defaults
    document.getElementById('reset-config-btn').addEventListener('click', async () => {
      if (!confirm('Reset configuration parameters to defaults? Your active feeds and topics will be cleared.')) return;
      
      state.config.about = 'A professional building software products.';
      state.config.provider = 'anthropic';
      state.config.model = 'claude-haiku-4-5-20251001';
      state.config.outputPath = './podflow-digest.md';
      state.config.feeds = [];
      state.config.interests = [
        {
          name: 'Business & Strategy',
          keywords: ['customer acquisition', 'pricing', 'churn', 'retention', 'revenue', 'growth', 'marketing', 'sales', 'GTM', 'PLG'],
          why: 'Core business insights for growing a product or service.'
        },
        {
          name: 'Technology & AI',
          keywords: ['AI', 'LLM', 'agent', 'automation', 'SaaS', 'API', 'software', 'engineering', 'developer'],
          why: 'Technical trends and tools that shape how products are built.'
        }
      ];

      await saveConfig();
    });

    // Trigger digest runner
    const runDigestBtn = document.getElementById('run-digest-btn');
    const terminal = document.getElementById('runner-terminal');

    runDigestBtn.addEventListener('click', async () => {
      if (runDigestBtn.disabled) return;
      
      runDigestBtn.disabled = true;
      runDigestBtn.textContent = 'Running Digest...';
      terminal.style.display = 'block';
      terminal.innerHTML = '<div class="terminal-line info">Starting Podflow intelligence extraction pipeline...</div>';
      
      try {
        const response = await fetch('/api/run-digest', { method: 'POST' });
        
        if (!response.body) {
          throw new Error('ReadableStream not supported by server response.');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let done = false;

        while (!done) {
          const { value, done: readerDone } = await reader.read();
          done = readerDone;
          if (value) {
            const chunk = decoder.decode(value, { stream: true });
            
            // Format log lines
            const lines = chunk.split('\\n');
            lines.forEach(line => {
              if (!line.trim()) return;
              
              const div = document.createElement('div');
              div.className = 'terminal-line';
              
              if (line.includes('✔') || line.includes('succeed') || line.includes('complete') || line.includes('written')) {
                div.className += ' success';
              } else if (line.includes('✖') || line.includes('fail') || line.includes('failed') || line.includes('Error') || line.includes('error')) {
                div.className += ' error';
              } else if (line.includes('ℹ') || line.includes('Processing') || line.includes('Reading')) {
                div.className += ' info';
              }
              
              div.textContent = line;
              terminal.appendChild(div);
              terminal.scrollTop = terminal.scrollHeight;
            });
          }
        }
        
        // Reload data after completion
        await fetchData();
        
      } catch (err) {
        const div = document.createElement('div');
        div.className = 'terminal-line error';
        div.textContent = 'Pipeline execution failed: ' + err.message;
        terminal.appendChild(div);
      } finally {
        runDigestBtn.disabled = false;
        runDigestBtn.innerHTML = \`
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.253 8H18" />
          </svg>
          Trigger Digest Run
        \`;
      }
    });

    // Search and Filter Listeners
    document.getElementById('guest-search').addEventListener('input', renderGuestsTable);
    document.getElementById('guest-followworthy-filter').addEventListener('change', renderGuestsTable);
    document.getElementById('ideas-search').addEventListener('input', renderIdeas);
    document.getElementById('ideas-actionable-filter').addEventListener('change', renderIdeas);

    // Initial load
    fetchData();
  </script>
</body>
</html>
`;
