# Cipher Lens

Cipher Lens is a premium desktop workspace for turning YouTube videos, pasted transcripts, and subtitle files into clear briefs, content plans, and channel research decks.

It is built as an Electron + React desktop app, with a Pages-ready static showcase site included in [`docs/`](docs/).

## Highlights

- Pull transcript lines from public YouTube videos
- Paste or import `.txt`, `.md`, `.srt`, `.vtt`, and `.json` transcript files
- Clean transcript noise before analysis
- Generate summaries, takeaways, action items, keywords, and chapter flows
- Build creator-focused export packs for descriptions, newsletters, threads, LinkedIn posts, and upload bundles
- Run channel deep dives and side-by-side channel comparisons
- Save briefs, reports, and presets locally for quick reuse
- Export client-ready text files and PDF decks

## Stack

- Electron
- React 19
- Vite
- TypeScript
- Tesseract.js
- `youtube-transcript`

## Local Development

```bash
npm install
npm start
```

Useful commands:

- `npm run lint`
- `npm run build`
- `npm run package:win`
- `npm run package:mac`

## Project Structure

- [`src/`](src/) contains the React app and analysis logic
- [`electron/`](electron/) contains the desktop shell and IPC bridge
- [`public/brand/`](public/brand/) contains brand assets and icons
- [`docs/`](docs/) contains the static project page for GitHub Pages

## Publish Checklist

1. Create a new GitHub repository for this project.
2. Push the full project, including `.github/workflows/pages.yml`.
3. In GitHub Pages settings, use the GitHub Actions source.
4. Create a GitHub Release and upload the Windows installer from `release/` after packaging.
5. If you want the project shown on `aboutsajid.github.io`, either:
   - link to the repo Pages site from your main website, or
   - copy/adapt the content from [`docs/index.html`](docs/index.html) into your main site.

## Mac Build

If you want to share Cipher Lens with a friend on macOS, use one of these paths:

- On a Mac machine: run `npm run package:mac`
- For Intel-only output: run `npm run package:mac:x64`
- For Apple Silicon output: run `npm run package:mac:arm64`
- From GitHub: use the `Build Mac App` workflow to generate Mac artifacts automatically

The new workflow builds both `x64` and `arm64` Mac packages and uploads them as workflow artifacts. When you push a tag like `v1.0.0`, it also uploads the `.dmg` and `.zip` files to that GitHub Release.

Because this project is not set up with Apple code signing or notarization yet, macOS may show a security warning the first time your friend opens it. In that case, they can right-click the app and choose `Open` once.

## Release Notes

- The Electron desktop window is now held with a persistent main-window reference so packaged builds do not exit immediately after launch.
- The repo now includes a Pages-ready static site and an automated Pages deployment workflow.

## License

No license file has been added yet. Choose the license you want before publishing publicly.
