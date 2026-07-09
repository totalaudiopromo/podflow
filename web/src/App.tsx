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
  // Current local digest demo state
  const [digestTab, setDigestTab] = useState<'insights' | 'guest'>('insights');
  
  // Premium features preview state
  const [premiumTab, setPremiumTab] = useState<'wrapped' | 'mentions' | 'debates'>('wrapped');

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

  const coreFeatures: Feature[] = [
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
      <div className="bg-blob blob-1" />
      <div className="bg-blob blob-2" />
      <div className="bg-blob blob-3" />

      {/* Main Container */}
      <div className="container" style={{ position: 'relative', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        
        {/* Header */}
        <header>
          <a href="#" className="logo">
            <div className="logo-dot">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#fff' }}>
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
                <line x1="12" x2="12" y1="19" y2="22" />
              </svg>
            </div>
            <span>podflow</span>
          </a>
          <nav className="nav-links">
            <a href="#features">Features</a>
            <a href="#premium">SaaS Preview</a>
            <a href="#pricing">Pricing</a>
            <a href="#ecosystem">Ecosystem</a>
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
          <div className="announcement-badge">
            <span className="badge-pulse" />
            <span>Introducing Podflow Cloud & Ecosystem Sync</span>
          </div>
          <h1>
            Your Podcast Intelligence. <br />
            <span>Amplified by AI.</span>
          </h1>
          <p>
            Extract guest profiles, mention alerts, and actionable insights. Sync across your favorite listening directories, build your knowledge graph, and cross-promote campaigns instantly.
          </p>
          <div className="hero-cta">
            <a href="#pricing" className="btn-primary">Try Podflow Cloud</a>
            <a href="#features" className="btn-secondary">Explore Local CLI</a>
          </div>
        </section>

        {/* Interactive CLI Digest Preview */}
        <section style={{ marginBottom: '100px' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '24px', fontWeight: '700', margin: '0 0 8px' }}>Local CLI Intel Engine</h3>
            <p style={{ color: 'hsl(var(--text-secondary))', margin: 0 }}>Incremental markdown summaries generated on your macOS device.</p>
          </div>
          <div className="preview-container">
            <div className="preview-header">
              <div>
                <span className="preview-tag">Local Digest Preview</span>
                <h4 style={{ margin: '4px 0 0', fontSize: '18px', fontWeight: '700' }}>{demoEpisode.title}</h4>
                <span style={{ fontSize: '13px', color: 'hsl(var(--text-secondary))' }}>{demoEpisode.podcast} • {demoEpisode.duration}</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  id="btn-digest-insights"
                  onClick={() => setDigestTab('insights')}
                  className={`tab-button ${digestTab === 'insights' ? 'active' : ''}`}
                >
                  Key Insights
                </button>
                <button
                  id="btn-digest-guest"
                  onClick={() => setDigestTab('guest')}
                  className={`tab-button ${digestTab === 'guest' ? 'active' : ''}`}
                >
                  Guest Info
                </button>
              </div>
            </div>

            <div className="preview-body">
              {digestTab === 'insights' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {demoEpisode.insights.map((insight, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                      <div className="number-badge">{idx + 1}</div>
                      <p style={{ margin: 0, fontSize: '15px', color: 'hsl(var(--text-secondary))', lineHeight: '1.6' }}>
                        {insight}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div>
                  <h5 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: '700' }}>{demoEpisode.guest.name}</h5>
                  <span style={{ fontSize: '14px', color: 'hsl(var(--color-pink))', fontWeight: '600' }}>{demoEpisode.guest.role}</span>
                  <p style={{ margin: '12px 0 20px', fontSize: '14px', color: 'hsl(var(--text-secondary))', lineHeight: '1.6' }}>
                    {demoEpisode.guest.bio}
                  </p>
                  <h6 style={{ margin: '0 0 8px', fontSize: '12px', color: 'hsl(var(--text-primary))', textTransform: 'uppercase', letterSpacing: '1px' }}>Key Topics Addressed</h6>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {demoEpisode.guest.topics.map((topic, idx) => (
                      <span key={idx} className="topic-tag">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Core CLI Features */}
        <section id="features" className="features">
          <h2>CLI Engine Features</h2>
          <div className="features-grid">
            {coreFeatures.map((feature, idx) => (
              <div className="feature-card" key={idx}>
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Premium SaaS Features Showcase */}
        <section id="premium" className="premium-showcase">
          <div className="section-header">
            <h2>Insanely Good SaaS Features</h2>
            <p>Go beyond single file summaries. Harness the full power of podcast audio monitoring and semantic search.</p>
          </div>

          <div className="premium-tabs">
            <button 
              id="btn-prem-wrapped"
              onClick={() => setPremiumTab('wrapped')}
              className={`premium-tab-btn ${premiumTab === 'wrapped' ? 'active' : ''}`}
            >
              🧠 Knowledge Wrapped
            </button>
            <button 
              id="btn-prem-mentions"
              onClick={() => setPremiumTab('mentions')}
              className={`premium-tab-btn ${premiumTab === 'mentions' ? 'active' : ''}`}
            >
              🔔 PR Mention Monitor
            </button>
            <button 
              id="btn-prem-debates"
              onClick={() => setPremiumTab('debates')}
              className={`premium-tab-btn ${premiumTab === 'debates' ? 'active' : ''}`}
            >
              💬 AI Synthesized Debates
            </button>
          </div>

          <div className="premium-display">
            {premiumTab === 'wrapped' && (
              <div className="premium-pane fade-in">
                <div className="pane-content">
                  <h3>Your Personalized Knowledge Profile</h3>
                  <p>As you consume podcast episodes, Podflow extracts concepts and plots your cognitive roadmap. Share beautiful, custom status cards highlighting what you've learned.</p>
                  
                  <div className="wrapped-card">
                    <div className="wrapped-header">
                      <span className="wrapped-brand">podflow wrapped</span>
                      <span className="wrapped-date">July 2026</span>
                    </div>
                    <div className="wrapped-score">
                      <span className="score-num">98th</span>
                      <span className="score-label">Percentile Learner in SaaS PLG & AI Agent Architectures</span>
                    </div>
                    <div className="wrapped-stats">
                      <div className="stat-box">
                        <span className="stat-val">34</span>
                        <span className="stat-desc">Concepts Unlocked</span>
                      </div>
                      <div className="stat-box">
                        <span className="stat-val">12</span>
                        <span className="stat-desc">Hosts Analyzed</span>
                      </div>
                      <div className="stat-box">
                        <span className="stat-val">2.8k</span>
                        <span className="stat-desc">Minutes Synthesized</span>
                      </div>
                    </div>
                    <div className="wrapped-mentors">
                      <h6>Top Virtual Mentors:</h6>
                      <div className="mentors-list">
                        <span>🎙️ Dr. Aris Vance</span>
                        <span>🎙️ Paul Graham</span>
                        <span>🎙️ Lenny Rachitsky</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {premiumTab === 'mentions' && (
              <div className="premium-pane fade-in">
                <div className="pane-content">
                  <h3>Real-time Podcast Mention Tracking</h3>
                  <p>Monitor millions of audio minutes across thousands of podcasts. Perfect for tracking when your business, product, or keyword is mentioned in the wild.</p>
                  
                  <div className="mentions-feed">
                    <div className="mention-alert-card new-alert">
                      <div className="alert-badge">NEW MENTION</div>
                      <div className="mention-details">
                        <span className="mention-source">Indie Hackers Podcast • Episode #412</span>
                        <p className="mention-quote">"...we used a tool called <strong>Total Audio Promo</strong> to automate our release outreach, and it doubled our booking rate. We also used <strong>SpotCheck</strong> to validate..."</p>
                        <div className="mention-actions">
                          <button className="btn-action-primary" onClick={() => alert('Feature mock: Generating short video clip with transcripts.')}>🎥 Generate Social Clip</button>
                          <a href="https://totalaudiopromo.com" target="_blank" rel="noreferrer" className="btn-action-secondary">🚀 Open in Total Audio Promo</a>
                        </div>
                      </div>
                    </div>

                    <div className="mention-alert-card">
                      <div className="mention-details">
                        <span className="mention-source">The Creator Pitch • Episode #88</span>
                        <p className="mention-quote">"...if you want to do PR correctly, you need to check out <strong>Newsjack.cc</strong>. It finds trending hooks that journalists care about..."</p>
                        <div className="mention-actions">
                          <button className="btn-action-primary" onClick={() => alert('Feature mock: Generating short video clip.')}>🎥 Generate Social Clip</button>
                          <a href="https://newsjack.cc" target="_blank" rel="noreferrer" className="btn-action-secondary">💡 View Hook on Newsjack</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {premiumTab === 'debates' && (
              <div className="premium-pane fade-in">
                <div className="pane-content">
                  <h3>AI Synthesized Audio Debates</h3>
                  <p>Want to hear varying viewpoints on a subject? Choose topics and podcasters, and let Podflow's RAG compiler synthesize a cohesive conversation compiling their exact stated opinions.</p>
                  
                  <div className="debate-interface">
                    <div className="debate-query-bar">
                      <span className="query-label">Compare viewpoints on:</span>
                      <span className="query-val">"Decentralizing Edge LLMs"</span>
                    </div>
                    <div className="debate-chat">
                      <div className="debate-bubble bubble-a">
                        <span className="speaker-name">Dr. Aris Vance (Tech Frontiers)</span>
                        <p>"Edge computing is essential because local models can run with zero latency without sending confidential data to centralized cloud hosts."</p>
                      </div>
                      <div className="debate-bubble bubble-b">
                        <span className="speaker-name">Sam Altman (AI Inside)</span>
                        <p>"While local edge architectures are improving, the heavy logic capacity of giant frontier cluster servers will always outperform a phone's CPU."</p>
                      </div>
                      <div className="debate-bubble bubble-a">
                        <span className="speaker-name">Dr. Aris Vance (Tech Frontiers)</span>
                        <p>"But the marginal cost of centralized APIs is unsustainable. Edge intelligence will grow 400% as model quantization improves."</p>
                      </div>
                    </div>
                    <div className="debate-playback">
                      <button className="btn-playback" onClick={() => alert('Synthesizing speech from vector database source clips...')}>
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
                        </svg>
                        Listen to Synthesized Briefing (AI Voice)
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="pricing">
          <div className="section-header">
            <h2>Flexible Plans for Every Stage</h2>
            <p>From local hacker tools to high-throughput PR agency monitoring.</p>
          </div>

          <div className="pricing-grid">
            {/* Free CLI Tier */}
            <div className="price-card">
              <div className="price-title">Local CLI Core</div>
              <div className="price-subtitle">Perfect for developers</div>
              <div className="price-amount">$0<span>/forever</span></div>
              <ul className="price-features">
                <li><span>✓</span> macOS Apple Podcasts Local DB Sync</li>
                <li><span>✓</span> Bring Your Own API Key (OpenAI/Anthropic)</li>
                <li><span>✓</span> Output directly to Local Markdown</li>
                <li><span>✓</span> Open source MIT License</li>
              </ul>
              <a href="https://github.com/totalaudiopromo/podflow" target="_blank" rel="noreferrer" className="btn-price">Install via NPM</a>
            </div>

            {/* Pro Tier (Popular) */}
            <div className="price-card popular">
              <div className="popular-badge">POPULAR</div>
              <div className="price-title">Pro Listener</div>
              <div className="price-subtitle">For modern knowledge workers</div>
              <div className="price-amount">$15<span>/month</span></div>
              <ul className="price-features">
                <li><span>✓</span> Automated Cloud RSS Feed Subscriptions</li>
                <li><span>✓</span> Semantic Search across your entire catalog</li>
                <li><span>✓</span> Weekly Personal Newsletter & Summaries</li>
                <li><span>✓</span> Shareable Knowledge wrapped profiles</li>
                <li><span>✓</span> Hosted AI compute (No API key needed)</li>
              </ul>
              <button className="btn-price active" onClick={() => alert('SaaS registration coming soon! Under development.')}>Get Pro Now</button>
            </div>

            {/* Business/PR Tier */}
            <div className="price-card">
              <div className="price-title">PR & Creator Suite</div>
              <div className="price-subtitle">For brands, artists, & agencies</div>
              <div className="price-amount">$79<span>/month</span></div>
              <ul className="price-features">
                <li><span>✓</span> Daily/Weekly summary briefings for all feeds</li>
                <li><span>✓</span> Monitor <strong>10 keywords</strong> for real-time mentions</li>
                <li><span>✓</span> Generate video clips with captions in one-click</li>
                <li><span>✓</span> Automated Guest Booker Email extractor</li>
                <li><span>✓</span> Native <strong>Total Audio Promo</strong> Campaign export</li>
                <li><span>✓</span> API Access & CSV Exports</li>
              </ul>
              <button className="btn-price" onClick={() => alert('SaaS registration coming soon! Under development.')}>Start Free Trial</button>
            </div>
          </div>
        </section>

        {/* Total Audio Ecosystem Cross-Promotion */}
        <section id="ecosystem" className="ecosystem">
          <div className="section-header">
            <h2>The Total Audio Ecosystem</h2>
            <p>Our tools connect artists, creators, and PR managers to orchestrate campaigns, validate Spotify playlists, capture media attention, and monitor audio mentions.</p>
            <div className="network-flow-badge">Integrated Network Flywheel</div>
          </div>

          <div className="ecosystem-grid">
            {/* TAP */}
            <a href="https://totalaudiopromo.com" target="_blank" rel="noreferrer" className="eco-card">
              <div className="eco-header">
                <span className="eco-icon">🚀</span>
                <h4>totalaudiopromo.com</h4>
              </div>
              <p>PR campaign manager sending music and audio promos directly to global tastemakers, DJs, and radio hosts.</p>
              <span className="eco-link-arrow">Visit totalaudiopromo.com ➔</span>
            </a>

            {/* Newsjack */}
            <a href="https://newsjack.cc" target="_blank" rel="noreferrer" className="eco-card">
              <div className="eco-header">
                <span className="eco-icon">🔥</span>
                <h4>newsjack.cc</h4>
              </div>
              <p>Music industry newsjacking dashboard that finds trending hooks and matches them to active podcast outreach templates.</p>
              <span className="eco-link-arrow">Visit newsjack.cc ➔</span>
            </a>

            {/* SpotCheck */}
            <a href="https://spotcheck.cc" target="_blank" rel="noreferrer" className="eco-card">
              <div className="eco-header">
                <span className="eco-icon">🎵</span>
                <h4>spotcheck.cc</h4>
              </div>
              <p>Spotify playlist health validator. Avoid botted curator networks and make sure your songs land on high-retention feeds.</p>
              <span className="eco-link-arrow">Visit spotcheck.cc ➔</span>
            </a>

            {/* totalaud.io */}
            <a href="https://totalaud.io" target="_blank" rel="noreferrer" className="eco-card">
              <div className="eco-header">
                <span className="eco-icon">📅</span>
                <h4>totalaud.io</h4>
              </div>
              <p>Release planning and scheduling workspace for independent artists looking to manage timelines and promotional checklists.</p>
              <span className="eco-link-arrow">Visit totalaud.io ➔</span>
            </a>
          </div>

          <div className="ecosystem-banner">
            <h3>How It All Connects:</h3>
            <p>
              Find a trending hook on <strong>Newsjack.cc</strong>, draft a PR promo page on <strong>totalaud.io</strong>, validate target playlists on <strong>SpotCheck.cc</strong>, launch a mass email campaign using <strong>Total Audio Promo</strong>, and track the resulting audio coverage in real-time right here on <strong>Podflow</strong>.
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer>
          <div className="container">
            <p>© {new Date().getFullYear()} Total Audio Promo Ltd. Open source CLI engine under MIT License.</p>
            <p style={{ marginTop: '8px' }}>
              Built as part of the <a href="https://totalaudiopromo.com" target="_blank" rel="noreferrer">Total Audio Promo</a> suite of developer and marketing tools.
            </p>
          </div>
        </footer>

      </div>
    </>
  );
}

export default App;
