# WaveAlert

A Bangla-first prototype for browsing district-level cold wave, flood and drought bulletins in Bangladesh. The three examples are fictional. Live feeds and notification delivery are outside this initial release.

## Run locally

Open `index.html` in a browser. No package installation, credentials or build step is required. The demo works offline.

## Project files

- `index.html` defines the filters, status region and bulletin template.
- `alerts.js` contains the sample bulletins and renders results when either filter changes.
- `styles.css` handles mobile and desktop layouts.

## Add a sample

Add an entry to `bulletins` in `alerts.js` with a hazard key (`cold`, `flood` or `drought`), district, title and summary. District options are derived from the data. Keep sample text clearly fictional.

## Quick check

Open the page and confirm three bulletins appear. Select বন্যা to see the কুড়িগ্রাম example. With that filter active, choose নওগাঁ to see the empty state. Select সব দেখুন to restore all three.
