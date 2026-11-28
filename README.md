# WaveAlert

A Bengali-first disaster-response rehearsal for Bangladesh. Open the home page, choose a district and submit a fictional SOS or community report. In the workspace, a coordinator verifies the case and assigns a volunteer alias, a volunteer records progress and assistance, and the coordinator closes the case.

## Run locally

Requires Node.js 24 and a static web server. From the repository root:

```sh
node scripts/build.mjs
python3 -m http.server 8080 --directory dist
```

Open http://localhost:8080/. The build uses Node's TypeScript stripping and generates independent URLs for each public route. No install or credentials are required.

## Competition status

Theme 02, Connect Communities. Categories, intended users and submission requirements are in [the project scope](docs/product-scope.md). OpenAI ChatGPT/Codex assisted planning, implementation and testing. WaveGuard informed the problem framing.

Implemented: three simulated district bulletins, BN/EN switching, district filtering, public reports, a browser-local case queue, five practice roles, assignment and case progression. After the first successful online cache, the drill pages also open offline. State is specific to this browser and origin. Use fictional details. Practice roles are selectable without sign-in and have no authority outside this drill.

Pending: validated feeds, real alerts and monitoring, verified shelter inventory, authenticated multi-user access, secure shared storage, notifications, relief inventory, offline installation, analytics and reviewed AI assistance. Live rescue dispatch requires authorized response partners.
