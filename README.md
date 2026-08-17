# YouTube Nav Hider

A lightweight Firefox extension that auto-hides the YouTube top header and reveals it when you mouse over the top of the page. Works on all YouTube pages and in fullscreen.

## Features

- Auto-hides the top bar after 5 seconds of inactivity (2s on fullscreen).
- Shows the bar when the mouse reaches the top ~50px of the window.
- Works on all YouTube pages: home feed, watch, search, playlists, and more.
- Keeps the playlist filter bar pinned to the top when the header is hidden, with the first video staying clear of it.
- Disable/enable from the toolbar icon (persists across sessions).
- Smooth transitions and no layout snapping.

## Install

1. **Temporary (development):** open `about:debugging#/runtime/this-firefox`, click *Load Temporary Add-on*, and select `manifest.json`.
2. **Permanent:** add the link to mozilla website when it gets approved

## Build

Package the add-on into an `.xpi`:

```sh
cd yt-nachider && zip -r -X yt-navhider.xpi .
```

## Files

| File             | Purpose                                        |
| ---------------- | ---------------------------------------------- |
| `manifest.json`  | Manifest V3 extension definition (Firefox).    |
| `content.js`     | Hover/fullscreen detection and class toggling. |
| `styles.css`     | Hide/show transitions and layout adjustments.  |
| `background.js`  | Toolbar toggle and icon switching.             |
| `icons/`         | Toolbar icons.                                 |
