# Gridergy Protocol Rebuild (2026) - Go-Live Roadmap

This document outlines the strategic roadmap for transitioning Gridergy to its highly scalable, decentralized 2026 protocol architecture. The stack relies heavily on Cloudflare's edge compute (Workers, Durable Objects, D1, KV, Vectorize, and Containers) and a strictly non-Tailwind React PWA.

## Phase 1: Frontend Overhaul (React PWA + GSAP)
*Can happen in parallel with Backend updates.*
- [ ] **Aesthetic Rewrite:** Fully adopt the dark-mode node topology aesthetic from the provided 2026 design screenshots.
- [ ] **CSS Architecture:** Remove all utility classes (e.g., Tailwind). Strictly enforce vanilla CSS using CSS Grid.
- [ ] **Animation Engine:** Integrate GSAP 3 for all topology and metric animations (dotted lines, node pulsing, data flow visualizations).
- [ ] **Dashboard Layout:** Implement custom headers (FAQ, PAPER, Synced status, Guest/User profile) and core metrics (Energy Credits in kWh, Total Volume in SATS).
- [ ] **PWA Configuration:** Ensure offline capabilities, service workers, and app manifest for a true Progressive Web App experience.

## Phase 2: Cloudflare Backend Evolution (Workers & Services)
- [ ] **Wrangler Bindings Update:**
  - Ensure `D1` (`DB`) and `Durable Objects` (`ISO_STREAMER`) remain robust.
  - Integrate `Workers KV` (`RATE_LIMIT`) for edge-based DDoS protection and API rate limiting.
  - Bind the Cloudflare `Email Service` (`SEND_EMAIL`) for automated notifications, alerts, and user comms.
- [ ] **WebSocket & State Management:** Solidify the `IsoStreamer` Durable Object to handle thousands of concurrent WSS connections securely without state desync.

## Phase 3: ERCOT Data Ingestion & Scraping
- [ ] **FastAPI Scraper Development:** Build a dedicated Python FastAPI service to scrape and normalize live ERCOT data (LMP, congestion).
- [ ] **Cloudflare Containers:** Deploy the FastAPI scraper to Cloudflare Containers.
- [ ] **Internal Routing:** Set up secure, private communication between the FastAPI Container and the primary Cloudflare Worker/Durable Object to feed real-time grid ticks.

## Phase 4: Vectorize & AI Integration
- [ ] **Vector Indexing (`tutorial-index`):** Utilize Cloudflare Vectorize to store embedded ERCOT historical data, node pricing, and grid events.
- [ ] **Predictive Modeling:** Leverage vector similarity search to predict grid congestion events and price spikes.
- [ ] **AI Search:** Implement a semantic search feature (perhaps in the FAQ or node explorer) utilizing the vectorized data.

## Phase 5: Non-Custodial Lightning Payments
- [ ] **Pivot from Custodial LNBits:** Transition away from central accounting to maintain a strictly non-custodial protocol.
- [ ] **Evaluate Non-Custodial Tech:** Research and integrate solutions like Blockstream Greenlight, Mutiny Node, or Phoenixd.
- [ ] **Direct Settlement:** Ensure energy-credit-to-SATS swaps settle directly to user-controlled keys.
- [ ] **LNURL-auth:** Implement decentralized authentication using Lightning keys.

## Phase 6: Testing, Security & Production Launch
- [ ] **Load Testing:** Push concurrent limits on the Durable Object WebSocket implementation.
- [ ] **Smart Contract/Protocol Audit:** Ensure all logic handling credits and routing is sound.
- [ ] **Production DNS:** Go live on `gridergy.distorted.work` via Cloudflare Pages/Workers routing.

## Phase 7: User Profiles & R2 Storage
- [ ] **R2 Binding (`ASSETS`):** Ensure the `ASSETS` R2 bucket (visible in Cloudflare dashboard) is correctly bound in `wrangler.toml`.
- [ ] **Profile Avatars:** Implement frontend file upload functionality to allow users to set custom profile pictures.
- [ ] **Storage API:** Create backend Worker routes to handle pre-signed URLs for uploading and fetching images directly from the R2 bucket.
