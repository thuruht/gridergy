import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGridFlow } from './hooks/useGridFlow';
import './App.css';

// Declare WebLN for TS
declare global {
  interface Window {
    webln?: any;
  }
}

export const App: React.FC = () => {
  // Connect to the Cloudflare DO WebSocket
  const { zones, connected } = useGridFlow('wss://api.gridergy.distorted.work/stream/');
  const gridRef = useRef<HTMLDivElement>(null);

  // Example WebLN connection
  const handleConnectWallet = async () => {
    if (window.webln) {
      try {
        await window.webln.enable();
        console.log("WebLN Enabled!");
      } catch (err) {
        console.error("User denied WebLN", err);
      }
    } else {
      // Fallback for mobile PWA deep-linking
      window.location.href = "lightning:connect";
    }
  };

  // GSAP Animation for incoming price ticks
  useEffect(() => {
    if (zones.length > 0 && gridRef.current) {
      const cards = gridRef.current.querySelectorAll('.zone-card');
      gsap.fromTo(cards,
        { borderColor: 'var(--accent-green)', backgroundColor: 'rgba(0,255,136,0.05)' },
        { borderColor: 'var(--border-dim)', backgroundColor: '#111', duration: 1, stagger: 0.05 }
      );
    }
  }, [zones]);

  return (
    <div className="dashboard">
      <header className="header">
        <div>
          <h1>GRIDERGY .</h1>
          <span style={{ color: '#888', fontSize: '0.8rem' }}>RTC+B DECENTRALIZED SETTLEMENT</span>
        </div>
        <button className="webln-btn" onClick={handleConnectWallet}>
          {connected ? 'DO SYNCED' : 'CONNECT WALLET'}
        </button>
      </header>

      <div className="topology-grid" ref={gridRef}>
        {zones.length === 0 ? (
          <p style={{ color: '#888' }}>Waiting for IsoStreamer sync...</p>
        ) : (
          zones.map((z) => (
            <div key={z.zone} className="zone-card">
              <div className="zone-header">
                <span>{z.zone.replace('LZ_', '')}</span>
                <div className={`status-dot ${z.is_congested ? 'congested' : ''}`} />
              </div>
              <div className="zone-price">
                ${z.lmp.toFixed(2)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default App;
