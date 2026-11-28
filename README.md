# WaveAlert

Bengali-first local weather and disaster-response practice for Bangladesh. The home page retrieves current modelled conditions for the selected division, district or upazila. Open the home page, choose a district and submit a fictional SOS or community report. In the workspace, a coordinator verifies the case and assigns a volunteer alias, a volunteer records progress and assistance, and the coordinator closes the case.

## Run locally

Requires Node.js 24. From the repository root:

```sh
node scripts/build.mjs
node scripts/serve.mjs
```

Open http://localhost:8080/. The build uses Node's TypeScript stripping and bundles a fetch-based server and the public routes. No install or credentials are required.

## Competition status

Theme 02, Connect Communities. Categories, intended users and submission requirements are in [the project scope](docs/product-scope.md). OpenAI ChatGPT/Codex assisted planning, implementation and testing. WaveGuard informed the problem framing.

Implemented: three simulated district bulletins, BN/EN switching, district filtering, public reports, a browser-local case queue, five practice roles, assignment and case progression. After the first successful online cache, the drill pages also open offline. State is specific to this browser and origin. Use fictional details. Practice roles are selectable without sign-in and have no authority outside this drill.

Pending: validated hazard feeds, official warnings and monitoring, verified shelter inventory, authenticated multi-user access, secure shared storage, notifications, relief inventory, offline installation, analytics and reviewed AI assistance. Live rescue dispatch requires authorized response partners.

## Weather and locations

The server exposes `/api/locations` and `/api/weather?place=BD30`. Current temperature, humidity, wind and precipitation come from [Open-Meteo](https://open-meteo.com/). Readings refresh on location change, on demand and every 15 minutes while the page is visible. The server caches successful readings for five minutes. The browser retries the same provider directly if the server request fails. Offline or missing conditions are labelled unavailable.

The selector uses representative coordinates for each administrative area. Location data adapted from [Open Admin Data](https://github.com/open-admin-data/bangladesh-administrative-divisions), copyright 2026 jakkrapongt, [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). The directory retains bilingual names, identifiers, parent links and coordinates. Weather scenes respect reduced-motion preferences.
