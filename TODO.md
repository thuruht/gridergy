# Gridergy 2026 - Go-Live To-Do List

This document lists the concrete, actionable tasks required to execute the [ROADMAP](ROADMAP.md).

## Phase 1: Frontend Overhaul (React PWA + GSAP)
- [ ] Initialize/Review React project setup (`src/App.tsx`, `src/App.css`).
- [ ] Remove all Tailwind CSS dependencies and configurations.
- [ ] Define the CSS Grid layout for the dark-mode dashboard (Header, Metrics, Topology Map).
- [ ] Implement the Header Component:
  - [ ] Add `FAQ / TERMS` link.
  - [ ] Add `PAPER` toggle switch.
  - [ ] Add `SYNCED` indicator dot.
  - [ ] Add User/Guest profile indicator.
- [ ] Implement Metrics Component:
  - [ ] Display `ENERGY CREDITS (kWh)`.
  - [ ] Display `TOTAL VOLUME (SATS)`.
- [ ] Implement Node Topology Map:
  - [ ] Lay out the node topology in the CSS Grid dynamically (mutable based on data granularity).
  - [ ] Render connecting dotted lines between nodes.
- [ ] Integrate GSAP 3:
  - [ ] Animate node data updates (color changes, pulses).
  - [ ] Animate dotted lines to show "data flow" or congestion.
- [ ] Configure PWA Manifest and Service Worker for offline capabilities.

## Phase 2: Cloudflare Backend Evolution
- [ ] Review `wrangler.toml` and ensure `D1`, `Durable Objects`, and `Vectorize` are configured.
- [ ] Add `Workers KV` binding for `RATE_LIMIT` to `wrangler.toml` and implement basic rate-limiting logic in `src/worker.ts`.
- [ ] Add `Email Service` binding for `SEND_EMAIL` to `wrangler.toml`.
- [ ] Refactor `IsoStreamer` Durable Object (`src/worker.ts`):
  - [ ] Improve WebSocket connection management.
  - [ ] Implement server-side validation for any incoming messages to prevent spoofing.

## Phase 3: ERCOT Data Ingestion & Scraping
- [ ] Create a new directory `scraper/` for the Python FastAPI service.
- [ ] Write Python script to fetch LMP data from ERCOT (or a provider like GridStatus).
- [ ] Create `Dockerfile` for the FastAPI scraper.
- [ ] Set up Cloudflare Container deployment pipeline for the scraper.
- [ ] Write the integration code in the Cloudflare Worker to securely receive data from the scraper and broadcast it via the Durable Object.

## Phase 4: Vectorize & AI Integration
- [ ] Define the embedding schema for ERCOT node data.
- [ ] Implement logic in the backend to generate embeddings and insert them into the `tutorial-index` Vectorize database.
- [ ] Implement a REST endpoint in the worker to query Vectorize for similar historical grid conditions.

## Phase 5: Non-Custodial Lightning Payments
- [ ] Research Mutiny Node or Blockstream Greenlight integration.
- [ ] Replace existing LNBits API calls with the chosen non-custodial solution.
- [ ] Implement LNURL-auth in the frontend and backend.

## Phase 6: Testing & Launch
- [ ] Write a load testing script to open 100+ WebSocket connections to the local dev server.
- [ ] Conduct a final review of the React PWA UI against the design screenshots.
- [ ] Deploy to Cloudflare Pages (`gridergy.distorted.work`).

## Phase 7: User Profiles & R2 Storage
- [ ] Add `R2` binding for `ASSETS` to `wrangler.toml`.
- [ ] Create API route in `src/worker.ts` to generate pre-signed R2 upload URLs.
- [ ] Implement avatar upload UI in the React frontend (User Profile section).
- [ ] Store R2 avatar object keys in the `gridergy-db` D1 database linked to the user's profile.
  - [ ] **Crucial:** Ensure the entire frontend is completely functional and properly hooked into the backend WebSocket and API routes.
