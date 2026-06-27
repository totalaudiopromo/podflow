import { useState } from 'react';

interface Feature {
  title: string;
  description: string;
  icon: string;
}

interface DemoEpisode {
  title: string;
  podcast: string;
  duration: string;
  guest: {
    name: string;
    role: string;
    topics: string[];
    bio: string;
  };
  insights: string[];
}

export function App() {
  const [activeTab, setActiveTab] = useState<'insights' | 'guest'>('insights');

  const demoEpisode: DemoEpisode = {
    title: "Navigating AI & Open Source in 2026",
    podcast: "Tech Frontiers Podcast",
    duration: "42 mins",
    guest: {
      name: "Dr. Aris Vance",
      role: "Lead Architect at CoreOS",
      topics: ["Decentralized Models", "Safety Alignments", "GPU Orchestration"],
      bio: "Dr. Vance is a veteran AI research scientist specializing in decentralized model fine-tuning and resource-constrained edge computing architectures."
    },
    insights: [
      "Edge intelligence will grow 400% as local model size decreases below 3B parameters with similar logic capacity.",
      "Custom optimization pipelines like DeepSpeed and llama.cpp are democratizing model execution for everyday users.",
      "The 'Bring Your Own Key' model is shifting the cost of API computation from developers to power users."
    ]
  };

  const features: Feature[] = [
    {
      title: "Apple Podcasts Integration",
      description: "Directly syncs with your local macOS Apple Podcasts SQLite library or parses any public RSS feed instantly.",
      icon: "🎙️"
    },
    {
      title: "Guest Profile Miner",
      description: "Auto-extracts bios, roles, social links, and key topics mentioned by speakers across multiple episodes.",
      icon: "👤"
    },
    {
      title: "Actionable Key Insights",
      description: "Uses advanced Gemini/Claude AI adapters to extract concrete takeaways and summaries from audio transcripts.",
      icon: "💡"
    },
    {
      title: "Open Source CLI Core",
      description: "Completely open-source, runs natively on your machine, and puts you in control of your own data and API keys.",
      icon: "🛠️"
    }
  ];

  return (
    <>
      {/* Background Blobs */}
      <div className="bg-blob blob-1"></div>
      <div className="bg-blob blob-2"></div>
      <div className="bg-blob blob-3"></div>

      {/* Main Container */}
      <div className="container" style={{ position: 'relative', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        
        {/* Header */}
        <header>
          <a href="#" className="logo">
            <div className="logo-dot">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#fff' }}>
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                <path d="M19 10v1a7 7 0 0 1-14 0v-1"></path>
                <line x1="12" x2="12" y1="19" y2="22"></line>
              </svg>
            </div>
            <span>podflow</span>
          </a>
          <nav className="nav-links">
            <a href="#features">Features</a>
            <a href="#cli">CLI Guide</a>
            <a href="https://github.com/totalaudiopromo/podflow" target="_blank" rel="noreferrer" className="btn-github">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
              </svg>
              GitHub
            </a>
          </nav>
        </header>

        {/* Hero Section */}
        <section className="hero">
          <h1>
            Your Podcast Library, <br />
            <span>Working for You.</span>
          </h1>
          <p>
            Extract guest profiles, core ideas, and key insights from your Apple Podcasts library using local AI and your own keys.
          </p>
          <div className="hero-cta">
            <a href="#cli" className="btn-primary">Get Started</a>
            <a href="https://github.com/totalaudiopromo/podflow" target="_blank" rel="noreferrer" className="btn-secondary">View Repository</a>
          </div>
        </section>

        {/* Interactive App Preview */}
        <section style={{ marginBottom: '80px' }}>
          <div style={{
            background: 'hsl(var(--bg-card))',
            border: '1px solid hsl(var(--border-color))',
            borderRadius: '20px',
            padding: '24px',
            maxWidth: '850px',
            margin: '0 auto',
            textAlign: 'left',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid hsl(var(--border-color))', paddingBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '12px', color: 'hsl(var(--color-indigo))', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Active Digest</span>
                <h4 style={{ margin: '4px 0 0', fontSize: '18px', fontWeight: '700' }}>{demoEpisode.title}</h4>
                <span style={{ fontSize: '14px', color: 'hsl(var(--text-secondary))' }}>{demoEpisode.podcast} • {demoEpisode.duration}</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setActiveTab('insights')}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    background: activeTab === 'insights' ? 'linear-gradient(135deg, hsl(var(--color-indigo)), hsl(var(--color-violet)))' : 'transparent',
                    color: 'white',
                    fontWeight: '600',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  Key Insights
                </button>
                <button
                  onClick={() => setActiveTab('guest')}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    background: activeTab === 'guest' ? 'linear-gradient(135deg, hsl(var(--color-indigo)), hsl(var(--color-violet)))' : 'transparent',
                    color: 'white',
                    fontWeight: '600',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  Guest Info
                </button>
              </div>
            </div>

            {activeTab === 'insights' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {demoEpisode.insights.map((insight, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: 'rgba(99, 102, 241, 0.1)',
                      color: 'hsl(var(--color-indigo))',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '700',
                      fontSize: '14px',
                      flexShrink: 0
                    }}>
                      {idx + 1}
                    </div>
                    <p style={{ margin: 0, fontSize: '15px', color: 'hsl(var(--text-secondary))', lineHeight: '1.6' }}>
                      {insight}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                <h5 style={{ margin: '0 0 8px', fontSize: '16px', fontWeight: '700' }}>{demoEpisode.guest.name}</h5>
                <span style={{ fontSize: '14px', color: 'hsl(var(--color-pink))', fontWeight: '600' }}>{demoEpisode.guest.role}</span>
                <p style={{ margin: '12px 0 20px', fontSize: '14px', color: 'hsl(var(--text-secondary))', lineHeight: '1.6' }}>
                  {demoEpisode.guest.bio}
                </p>
                <h6 style={{ margin: '0 0 8px', fontSize: '12px', color: 'hsl(var(--text-primary))', textTransform: 'uppercase', letterSpacing: '1px' }}>Key Topics Addressed</h6>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {demoEpisode.guest.topics.map((topic, idx) => (
                    <span key={idx} style={{
                      fontSize: '12px',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      background: 'rgba(236, 72, 153, 0.1)',
                      color: 'hsl(var(--color-pink))',
                      fontWeight: '600'
                    }}>
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="features">
          <h2>Core Intelligence Features</h2>
          <div className="features-grid">
            {features.map((feature, idx) => (
              <div className="feature-card" key={idx}>
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CLI Section */}
        <section id="cli" className="cli-section">
          <h2>Command Line Interface</h2>
          <p>Run the analysis pipeline locally on your machine.</p>

          <div className="code-container">
            <div className="code-header">
              <div className="dot"></div>
              <div className="dot dot-y"></div>
              <div className="dot dot-g"></div>
              <span style={{ fontSize: '12px', color: 'hsl(var(--text-muted))', marginLeft: '12px', fontFamily: 'var(--font-mono)' }}>Terminal</span>
            </div>
            <div className="code-body">
              <pre>
                <span className="code-comment"># Install podflow globally via npm</span><br />
                <span className="code-prompt">$</span> <span className="code-cmd">npm install -g @totalaudiopromo/podflow</span><br /><br />
                <span className="code-comment"># Configure your OpenAI/Gemini/Anthropic API keys</span><br />
                <span className="code-prompt">$</span> <span className="code-cmd">podflow config set ANTHROPIC_API_KEY="your-key"</span><br /><br />
                <span className="code-comment"># Sync your Apple Podcasts library and generate digests</span><br />
                <span className="code-prompt">$</span> <span className="code-cmd">podflow sync --limit 5</span><br /><br />
                <span className="code-comment"># Output is generated locally as Markdown digests</span><br />
                <span className="code-comment"># saved directly to ~/podflow-digests/</span>
              </pre>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer>
          <div className="container">
            <p>© {new Date().getFullYear()} Total Audio Promo Ltd. Open source under MIT License.</p>
            <p style={{ marginTop: '8px' }}>
              Built as part of the <a href="https://totalaudiopromo.com" target="_blank" rel="noreferrer">Total Audio Promo</a> ecosystem.
            </p>
          </div>
        </footer>

      </div>
    </>
  );
}

export default App;
