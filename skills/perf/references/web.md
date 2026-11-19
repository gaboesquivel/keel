# Web and rendering performance

How to read browser and rendering evidence without overclaiming. Techniques for a specific framework belong to its documentation for the installed version; this file is about interpreting what you measure.

## Field, lab and journeys

- Core Web Vitals (LCP, INP, CLS) are defined over real page visits and usually reported at the 75th percentile of field data. A single lab run is one sample on one device and network, not that percentile.
- Field data comes from real-user monitoring the project already has, such as the hosting platform's speed insights or the Chrome UX Report for public pages with enough traffic. If there is none, say the user-facing impact is unmeasured.
- A page-load trace measures loading. It does not measure a longer journey (search, filter, open a detail, go back) or a single-page navigation; record and measure those interactions directly.
- Lab conditions need stating: device class or CPU throttling, network profile, cache state, and whether extensions or a logged-in session were present.

## Largest Contentful Paint

Before proposing a fix, split LCP into its parts, because each has a different cause:

- **Time to first byte:** server and network before any HTML arrives. Look on the server side.
- **Resource load delay:** time from first byte until the browser starts fetching the LCP resource. Large when the resource is discovered late: injected by script, set as a CSS background, lazy-loaded, or behind client-side data fetching.
- **Resource load duration:** transfer time. Size, format, compression, CDN distance, contention with other requests.
- **Element render delay:** the resource has arrived but the element is not painted yet. Render-blocking CSS or script, hydration, fonts, or the element waiting on client state.

Identify the LCP element first (a trace or a `largest-contentful-paint` PerformanceObserver), and confirm it is the same element across runs and viewports.

## Interactions and main-thread work

- INP needs a real interaction. A load trace with no input says nothing about it. Record the specific interaction and look at input delay (main thread busy when the input arrived), processing time (event handlers and the work they trigger), and presentation delay (rendering and paint after).
- Long tasks during load or after an interaction are a lead, not a cause; attribute them to the script, component or handler responsible.
- For memory, compare heap snapshots or allocation timelines across a repeated journey, rather than reading one snapshot.

## React and Next.js

- Static rules (memoise this, avoid that pattern) are hypotheses. Confirm with the React Profiler or the React Performance Tracks in the browser's Performance panel that the component actually re-renders often or expensively in the interaction in question.
- React development builds are much slower and add checks. Use them to see what renders and why; take timings from a production or profiling build.
- For Next.js, measure `next build` and `next start` (or a preview deployment), never `next dev`. Server and client component boundaries, data fetching, streaming and caching behaviour change between major versions; read the documentation for the installed version before recommending an API.
- Bundle size matters when the trace shows script download, parse or hydration on the critical path. A large bundle that is not on the critical path is a lower priority.

## Tool caveats

- Check what a tool measures before trusting its output. For example, a Lighthouse tool exposed through an MCP server may report only some categories; check that performance is among them before relying on it.
- Automated scores summarise lab conditions. Report the underlying metrics and the trace evidence, not only a score.
- One tool is enough. Do not install several browser or profiling tools to cross-check each other unless a result is in genuine doubt.
