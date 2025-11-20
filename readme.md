# PolyMirror - Polymarket Dashboard

A high-fidelity, read-only mirror of Polymarket with community voting features. This project is designed to bypass geo-restrictions using a local proxy agent and adds a layer of "social sentiment" voting on top of real-time market data.

## 🛠 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Data Fetching**: Axios + HttpsProxyAgent (Server-side)
- **Persistence**: Local JSON file (`data/votes.json`)

## ✨ Features

- **Real-time Data**: Fetches top 50 markets from Polymarket API via a local proxy.
- **Proxy Bypass**: Solves `ECONNRESET` issues in restricted regions (e.g., GFW) where standard `fetch` fails.
- **UI Replica**: High-fidelity UI mimicking the original Polymarket dark mode cards.
- **Community Voting**:
  - Users can log in (username only, no password required).
  - Users can "Vote/Like" specific outcomes (Yes/No).
  - Votes are stored locally and displayed alongside real market probabilities.
- **Filtering**: Search by keyword or filter by categories (Politics, Crypto, Sports, etc.).

## 🚀 Getting Started

### 1. Prerequisites
- Node.js installed.
- **CRITICAL**: You must have a VPN/Proxy software running (e.g., ClashX, Clash Verge, V2Ray).

### 2. Installation

```bash
npm install
```

### 3. Configure Proxy Port (Important!)

You need to tell the app which port your VPN is listening on.

1. Check your VPN software settings for **HTTP Port** or **Mixed Port** (Common defaults: `7890`, `7897`).
2. Open `src/app/api/markets/route.ts`.
3. Update the `PROXY_URL` constant:

```typescript
// Example: If your Clash Verge uses port 7897
const PROXY_URL = "http://127.0.0.1:7897";
```

### 4. Run Development Server

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

## 📂 Project Structure

- `src/app/api/markets`: Proxy route (Axios + Proxy Agent).
- `src/app/api/vote`: Read/Write local voting data.
- `src/lib/store.ts`: Local JSON DB handler for votes.
- `src/components/MarketCard.tsx`: Main UI component.

## 📝 Notes

- **Images**: Uses `<img>` instead of `next/image` to avoid hostname whitelisting issues.
- **Database**: Voting data saved to `data/votes.json` automatically on first vote.

---

# Project Context Summary

**Project Name:** PolyMirror (Polymarket Dashboard)  
**Current Status:** MVP Completed (UI + Data + Local Voting)

## Tech Stack
- **Frontend:** Next.js 16, TypeScript, Tailwind CSS
- **Networking:** `axios` + `https-proxy-agent`
  - Standard Next.js `fetch` abandoned due to failure to proxy correctly under blocked network
- **Database:** Local JSON (`data/votes.json`)

## Current Features

### 1. Data Fetching (Proxy-Enabled)
- Backend route `/api/markets` proxies to `gamma-api.polymarket.com`
- Proxy must match local VPN port (`127.0.0.1:7890` / `7897`)
- Returns top 50 markets sorted by volume

### 2. UI/UX
- High-fidelity Polymarket dark-style UI
- Client-side search + category filter

### 3. Community Voting System
- Lightweight LocalStorage login
- Users vote YES/NO on outcomes
- Votes stored & displayed in UI
- Clicking card (not buttons) opens official Polymarket page

## Known Constraints
- Developer in geo-blocked region
- Proxy port must be configured manually
- `<img>` used instead of `next/image` for flexibility

## Immediate Goal for Next Session
(Ready for new requirements)

