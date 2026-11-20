# Mobile app performance

How to measure a native or cross-platform mobile app without overclaiming. Tools and build settings change between releases; check the current documentation for the project's framework and platform versions.

## Conditions decide what a number means

- **Build:** debug builds are much slower and add checks. Take timings from a release build, or the framework's profiling build: React Native with development mode off, Flutter in profile mode (`flutter run --profile`), an Android profileable build, an iOS Release build run under Instruments. Use debug builds only to see what runs and why.
- **Device:** simulators and emulators run on the host's CPU and GPU and do not reproduce a phone's thermal limits, memory pressure or frame pacing. Report the device model, OS version and whether it was a simulator. Prefer a real device near the low end of what the product's users have.
- **Run state:** cold start (process not running) versus warm or hot start, first launch after install versus later launches, logged-in state and data volume.
- One run on one device is a sample. Repeat, and report the spread.

## Questions and where to look

- **Startup and first usable screen:** time from launch to the first screen the user can act on, not only the first frame. Split it into native initialization, JavaScript or Dart initialization, and the network and data work before that screen renders.
- **Navigation:** time from the tap to the destination being usable. Attribute it to work on the transition, data fetching, or rendering the new screen.
- **Frames and jank:** a frame budget is about 16 ms at 60 Hz and less on higher refresh-rate screens. Find which thread missed it. In React Native, the JavaScript thread and the UI thread drop frames for different reasons; a busy JavaScript thread can leave native scrolling smooth while touches and updates lag. In Flutter, the UI thread runs Dart and builds the frame, and the raster thread draws it; start with whichever exceeds the budget.
- **Memory:** compare memory across a repeated journey (open and close a screen several times) rather than reading one snapshot. Growth that never returns is a leak candidate; a high but stable level may be caching.
- **Network:** a slow screen is often a slow request. Time the request on the device, then follow it to the server with [server.md](server.md) before changing UI code.
- **Energy and resource use:** background work, wake locks, location and polling show up as battery drain and as platform warnings. Measure with the platform's energy tools, not by reading code.

## Tools

Use what the project already has. Do not install every profiler.

- **React Native and Expo:** React Native DevTools (React Profiler, Performance and Memory panels, depending on the version) for JavaScript and React work; the in-app performance monitor for JavaScript and UI frame rates. Some of these work only in development builds, so use them to locate work and the native profilers for release timings. Expo's bundle analysis shows what ships in the production bundle.
- **Flutter:** Flutter DevTools (performance view, CPU profiler, memory view) on a profile build on a real device; the performance overlay for UI and raster thread timing.
- **iOS:** Xcode Instruments (for example Time Profiler, App Launch, Hangs, Animation Hitches, Allocations, Leaks, Energy). Field data, where the app is shipped: Xcode Organizer metrics and MetricKit.
- **Android:** Android Studio profilers (system trace, CPU, memory) on a profileable build; Perfetto for traces; Macrobenchmark for repeatable startup and scrolling measurements. Field data, where the app is on Google Play: Android vitals.

Field data from the stores is aggregated over real devices and days; a lab run on one device is not that population.

## When there is no device

A measurement procedure for the user names the build type, the device, the steps of the journey, the tool and the metric to read, and how many runs.
