# Gridergy - Go-Live Roadmap & To-Do List

This document outlines the required steps to transition Gridergy from its current beta/simulated state into a production-ready application.

## Phase 1: Authentication & User Profiles (Real Auth)
- [ ] **Remove "Guest" Access:** Phase out the current guest/paper mode as the default.
- [ ] **Implement Authentication System:**
  - *Recommendation:* Given the decentralized nature, consider **LNURL-auth** (Lightning Network authentication) alongside standard Email/Password + JWT.
- [ ] **User Sessions:** Ensure backend validates auth tokens for every WebSocket connection to prevent unauthorized access to user balances.
- [ ] **Database Integration:** Map users to their respective energy credits (`total_kwh`) and Lightning balances (`total_sats`).

## Phase 2: Live Grid Data Integration (Real ERCOT Data)
- [ ] **Data Sourcing:** Integrate with a live ERCOT API provider (e.g., GridStatus API, or direct ERCOT public API).
- [ ] **Replace Simulation:** Strip out the `SIM_NODE_X` logic and replace it with real Locational Marginal Pricing (LMP) and congestion maps.
- [ ] **Real-time Pipeline:** Update the backend WebSocket broadcaster to stream real LMP ticks instead of simulated intervals.

## Phase 3: Payments & Regulatory Compliance
- [ ] **LNBits Evaluation:**
  - Continue utilizing LNBits for V1 as an excellent accounting layer.
  - *Regulatory Note:* Using LNBits **does not** automatically remove regulatory burden if you are operating a custodial wallet (holding user SATS). If users deposit SATS into a central pool that you control, you may be considered a Money Services Business (MSB).
- [ ] **Legal Consultation:** Speak with a legal expert regarding KYC/AML requirements for energy-credit-to-sats swaps.
- [ ] **Non-Custodial Evaluation:** Investigate if non-custodial Lightning solutions (like Greenlight or Mutiny) could reduce the regulatory footprint in the future.
- [ ] **Production Node:** Ensure the backend LNBits instance is connected to a well-funded, well-routed Lightning Node for reliable invoice generation and payment routing.

## Phase 4: Security & Infrastructure
- [ ] **HTTPS / WSS:** Enforce SSL for all web traffic and Secure WebSockets (WSS) for the real-time data feed.
- [ ] **Rate Limiting:** Fine-tune the rate limiter (already visible in previous snippets) to protect against DDoS and abuse.
- [ ] **Audit WebSockets:** Ensure users cannot spoof `total_kwh` or `total_sats_spent` payloads over WebSockets. (All balance calculations *must* happen server-side).

## Phase 5: Testing & Launch
- [ ] **Load Testing:** Simulate 100+ concurrent WebSocket connections to ensure backend stability.
- [ ] **Beta Testing:** Invite a small group of users to test deposits, paper mode vs real mode, and real-time ERCOT tracking.
- [ ] **Go Live:** Point `gridergy.distorted.work` to the production environment and announce.
