# I.G.N.I.S. — Monitoring web application

> **See the fire before it spreads...**
> This repository is the monitoring frontend for **IGNIS** — an edge AI fire-detection system that forwards Pico (Raspberry Pico W / Pico 2W) inference results to a small JSON edge server. The monitoring app provides a compact, real-time dashboard, history view, and components you can drop into your own Next.js site to observe detections and get audible alerts.

---

## What this repo contains

- A Next.js + React + TypeScript UI that consumes the IGNIS JSON edge server.
- Reusable components (`PicoViewer` and children) that:
  - fetch and expose latest / historical Pico data,
  - play an alert sound when new detections arrive,
  - display detection class, confidence, and scores.

- MDX-based post system for research / documentation pages.

---

## Quick start (local)

> You can use **bun**, **npm**, or **yarn** depending on your environment.

1. Install dependencies

```bash
bun install
# or
npm install
# or
yarn
```

2. Run dev server

```bash
bun run dev
# or
npm run dev
# or
yarn dev
```

3. Open `http://localhost:3001` (or the port configured in your Next app).

---

## MDX-based posts / docs

This project includes an MDX post system (see `utils/mdProcessor.ts`):

- Put `.md` or `.mdx` files into `/posts`.
- Frontmatter currently supports:
  - `topic` (string)
  - `title` (string)

- Files are compiled via `next-mdx-remote/rsc` and rendered with custom MDX components.

Example frontmatter:

```md
---
title: "IGNIS: evaluation notes"
topic: "research"
---

Content here...
```

---

## Usage — Components & API

The main exported UI building block is `PicoViewer` (`src/components/pico/PicoViewer.tsx`) which provides a React context and several presentational children.

**Example usage (simple dashboard):**

```tsx
import PicoViewer, {
	Header,
	ViewerDashboard,
	DetectionResult,
	DetectionConfidence,
	DetectionTimestamp,
	HistoryTable,
} from "@/components/pico/PicoViewer";

export default function DashboardPage() {
	return (
		<PicoViewer baseUrl={process.env.NEXT_PUBLIC_IGNIS_BASE_URL}>
			<Header>IGNIS — Live detection</Header>

			<ViewerDashboard>
				<div>
					<h3>
						Status: <DetectionResult ifFire="🔥 FIRE" ifNoFire="— no fire" />
					</h3>
					<p>
						Confidence: <DetectionConfidence />
					</p>
					<p>
						Time: <DetectionTimestamp />
					</p>
				</div>

				{/* optional history */}
				<HistoryTable />
			</ViewerDashboard>
		</PicoViewer>
	);
}
```

### Components exported by `PicoViewer.tsx`

- `PicoViewer` — context provider & data fetcher.
- `usePico()` — hook exposing `{ latest, history, loading, error, refreshMs, showHistory, refetch }`.
- `Header` — small title wrapper.
- `ViewerDashboard` — fallback UI while loading or error; displays child content when available.
- `DashboardHeader` — small title wraper for dashboard.
- `DetectionResult` — shows `"Fire"` / `"Nofire"` / unknown.
- `DetectionConfidence` — shows numeric confidence from inference.
- `DetectionFireScore`, `DetectionNoFireScore` — show model score floats.
- `DetectionTimestamp` — renders timestamp in locale.
- `HistoryTable` — simple table of recent readings.

All components are intentionally small and composable so you can drop them into your own layout.

---

## Example interactive post (in `/posts`)

This repository includes an example MDX post that demonstrates how to use `PicoViewer` directly inside a post page. You can find it in the `posts` folder.

```md
---
topic: "Teste do Sevidor"
title: "Resultados da Comunicação"
---

<PicoViewer showHistory={true} baseUrl="http://localhost:3000" refreshMs={12000}>
  <Header>Pico 2W — Painel</Header>

  <ViewerDashboard>
    <DashboardHeader>Última Detecção</DashboardHeader>

    <strong>Classe Detectada: </strong> <DetectionResult ifFire="FOGO!!!" ifNoFire="Sem fogo" />
    <br></br>
    <strong>Confiança: </strong> <DetectionConfidence />
    <br></br>
    <strong>Pontuação Fogo: </strong> <DetectionFireScore />
    <br></br>
    <strong>Pontuação Sem Fogo: </strong> <DetectionNoFireScore />
    <br></br>
    <strong>Marcação: </strong> <DetectionTimestamp />

  </ViewerDashboard>

  <HistoryTable />
</PicoViewer>
```

---

## Data shape

Each reading the frontend expects has this structure:

```json
{
	"timestamp": 1690000000000, // ms since epoch
	"class": "Fire", // "Fire", "Nofire" (case-sensitive)
	"confidence": 0.92, // 0..1
	"fire_score": 0.95, // model score
	"nofire_score": 0.05 // model score
}
```

`timestamp` is required (numeric), other fields may be missing.

---

### Example: local testing with the edge server

If you run the companion JSON server locally (default port `3000`):

```bash
curl "http://localhost:3000/pico_data?class=Fire&confidence=0.87&fire_score=0.90&nofire_score=0.10"
```

Then the frontend (pointing to `http://localhost:3000`) will pick it up on the next refresh.

---

## Known limitations

- Audio autoplay depends on browser policies.
- The `PicoViewer` fetcher is simple (polling). For many clients or higher throughput, use SSE/WebSocket.
- No built-in authentication for connecting to the edge JSON server — add middleware if needed.

---

## Troubleshooting

- **No detections appearing**: verify `NEXT_PUBLIC_IGNIS_BASE_URL` / `baseUrl` and check browser console network requests for `/pico_data/latest`.
- **Audio not playing**: ensure `public/alert.wav` exists (import one if not) and that the user has interacted with the page (browsers often require interaction to allow playback).
- **CORS errors**: if the edge server is remote, enable CORS there or host the frontend and server on same origin.

---

## Contributing

Contributions welcome! Typical workflow:

1. Fork the repo
2. Create a feature branch
3. Open a PR with a description and tests (where applicable)

Please keep API compatibility in mind when changing `PicoViewer` public behavior.

---

## Please note

This platform is part of **I.G.N.I.S.** (Inteligência para Gerenciamento e Neutralização de Incêndios Sistematizada): an AI project to detect early-stage fires in remote areas using computer vision on edge devices (ESP32 / optical cameras) so that authorities can respond faster. The platform is intended to be easy to use, supporting that mission.
