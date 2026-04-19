# Final Polish Checklist

## Current State

Completed and already live:

- [x] Channel Deep Dive
- [x] Title Templates
- [x] Next Video Ideas
- [x] Clone Brief
- [x] Competitor Compare
- [x] Channel Scorecard
- [x] Signature Moves
- [x] Takeover Sprint
- [x] Compare Whitespace Opportunities
- [x] Main channel sample-size control
- [x] Compare channel sample-size control
- [x] Main channel manual video selection
- [x] Compare channel manual video selection
- [x] Saved channel reports
- [x] Saved selection presets
- [x] Markdown export
- [x] Branded PDF export
- [x] Windows installer build

Latest technical verification:

- [x] `npm.cmd run lint`
- [x] `npm.cmd run build`
- [x] `npm.cmd run package:win`

Latest scripted QA:

- [x] `QA_CHANNEL_MATRIX.md` regenerated on `2026-04-16`

## Must-Do QA

Release-blocking checks before final sign-off:

- [x] Run Channel Deep Dive on at least 3 very different channels:
- [x] creator education channel
- [x] commentary/news style channel
- [x] niche tutorial/software channel
- [x] Run Compare on at least 3 channel pairs with clear overlap.
- [x] Confirm Deep Dive still works when some videos have no transcript.
- [x] Confirm Compare still works when competitor side has partial transcript coverage.
- [x] Confirm manual selection changes actually affect Deep Dive output.
- [x] Confirm manual selection changes actually affect Compare output.
- [ ] Confirm saved presets restore both main and compare selections correctly.
- [ ] Confirm saved channel reports reload without rerunning fetch.
- [ ] Confirm markdown export file contents match the on-screen report.
- [ ] Confirm PDF export opens cleanly in a normal PDF viewer.
- [ ] Confirm Windows packaged app can:
- [ ] load channel videos
- [ ] run deep dive
- [ ] run compare
- [ ] export markdown
- [ ] export PDF

## UX Polish

High-value polish that is not necessarily blocking:

- [x] Add empty-state guidance when no compare videos are loaded yet.
- [x] Add tiny helper copy clarifying that compare must load separately.
- [x] Add confirmation/status copy after preset load showing preset name.
- [x] Add a quick "Select Top 10" action beside "Top 5".
- [x] Consider a small badge showing whether a report came from full sample or filtered sample.
- [x] Consider surfacing average visible views directly inside Deep Dive overview text.
- [x] Consider showing selected video counts inside saved reports list.

## Data Quality Upgrades

Strong next-step improvements after current release:

- [ ] Thumbnail text extraction
- [ ] Better description scraping and description-based SEO read
- [ ] Shorts vs long-form labeling
- [ ] Stronger handling for channels where YouTube changes page markup
- [ ] Better parsing for edge-case localized view labels
- [ ] Use view data to identify top-performing title patterns more explicitly
- [ ] Add stronger topic-performance correlation using views + themes

## PDF Polish

Optional upgrades for more client-facing presentation:

- [ ] Add branded cover page variant
- [ ] Add page footer with channel/report title
- [ ] Add cleaner section dividers
- [ ] Add summary cards at top of PDF
- [ ] Add optional logo/image assets if brand team wants them

## Release Sign-Off

Mark this complete only when all must-do QA passes:

- [ ] Desktop dev app checked
- [ ] Packaged Windows app checked
- [ ] Export flows checked
- [ ] Save/load flows checked
- [ ] No blocker bugs found
- [ ] Ready for handoff/release

## Suggested Immediate Order

If we continue polishing from here, do this order:

1. Full manual QA on 3-5 real channels
2. Full packaged-app QA
3. Small UX copy cleanup
4. Optional PDF presentation improvements
5. Thumbnail/description enrichment as next feature wave
