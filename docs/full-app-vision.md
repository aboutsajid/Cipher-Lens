# Cipher Lens Full App Vision

This file is our project-memory reference for the next major evolution of Cipher Lens.

Use this document whenever we need to realign on:

- what the product should become
- how the interface should feel
- how the app should be structured
- what order we should build things in

If we lose context mid-build, restart from here.

## Why This Exists

Cipher Lens already has strong product logic:

- video transcript analysis
- YouTube video metadata pulling
- channel deep-dive analysis
- clone-first channel planning
- compare / benchmark workflows
- studio CSV merging
- export and PDF generation

The problem is not missing capability.
The problem is that the app is still organized more like a powerful tool than a full desktop product.

The next step is to evolve it into a structured, department-based creator intelligence app.

## Product Direction

Cipher Lens should become a Creator Intelligence OS for YouTube operators, strategists, and agencies.

It should feel like:

- a workspace
- a strategy desk
- a research system
- a premium desktop app

It should not feel like:

- one giant screen with many conditional views
- a temporary utility
- a pile of tabs

## Core Product Idea

We should reorganize the app into clear departments instead of keeping everything inside one mega workspace.

Recommended main sections:

- Home
- Video Intel
- Channel Clone
- Channel Compare
- Studio Analytics
- Library
- Exports
- Settings

These are not just menu items.
They are departments in the product.

## Department Model

### Home

Purpose:
The place users land when they open the app.

Should contain:

- recent projects
- recent clone plans
- recent reports
- quick actions
- last opened workspace
- pending exports

### Video Intel

Purpose:
Analyze a single YouTube video deeply.

Should contain:

- video URL input
- transcript pull
- metadata pull
- comments / audience signal pull
- summary
- hooks
- title ideas
- thumbnail text ideas
- clip moments
- exports

### Channel Clone

Purpose:
Turn a target channel into a clone-first operating system.

Should contain:

- target channel URL
- my channel URL
- niche
- stage
- presentation style
- goal
- video sample selection
- clone plan output

Result sections:

- Overview
- DNA
- Winning Videos
- Titles
- Thumbnails
- Hooks
- Audience
- Monetization
- Adapt To Me
- Action Plan

### Channel Compare

Purpose:
Compare channels and extract a strategic model.

Should contain:

- primary channel
- competitor channel
- benchmark channel optional support
- winner matrix
- overlap themes
- whitespace opportunities
- adaptation guidance
- niche model
- export deck

### Studio Analytics

Purpose:
Bring in YouTube Studio CSV data and layer real metrics onto strategy work.

Should contain:

- CSV import
- matching to videos
- CTR / retention / impressions overlays
- traffic source context
- performance reads
- packaging vs content insight

### Library

Purpose:
Store and reopen work.

Should contain:

- saved briefs
- saved channel reports
- saved presets
- saved projects
- search
- duplicate / delete / reopen actions

### Exports

Purpose:
A dedicated place for deliverables.

Should contain:

- markdown reports
- PDF exports
- copy decks
- upload packs
- channel plans

### Settings

Purpose:
Control application-level defaults.

Should contain:

- output language defaults
- summary defaults
- export defaults
- storage management
- future account / integration settings

## Interface Direction

The UI should move from a large tool screen to an application shell.

Recommended layout:

```text
┌──────────────── Top Bar ────────────────────────────────────────────────┐
│ Cipher Lens | Workspace | Search | New Project | Status | Profile      │
├───────────────┬───────────────────────────────────────┬─────────────────┤
│ Sidebar       │ Main Workspace                        │ Insight Rail    │
│               │                                       │                 │
│ Home          │ Page-specific flow                    │ quick stats     │
│ Video Intel   │ reports / forms / tables / actions    │ AI notes        │
│ Clone         │                                        │ recent actions  │
│ Compare       │                                        │ export status   │
│ Analytics     │                                        │                 │
│ Library       │                                        │                 │
│ Exports       │                                        │                 │
│ Settings      │                                        │                 │
└───────────────┴───────────────────────────────────────┴─────────────────┘
```

## Sidebar Information Architecture

Recommended grouping:

- Home
- Research
- Video Intel
- Channel Clone
- Channel Compare
- Performance
- Studio Analytics
- Assets
- Library
- Exports
- System
- Settings

This will make the app feel like a serious product instead of a set of modes.

## UI Style Direction

The design should feel premium, intentional, and editor-strategist focused.

Recommended style language:

- deep slate shell
- warm light content panels
- teal accent
- amber signal color
- bold headings
- clean, quiet spacing
- report-first presentation

Suggested palette direction:

- shell: `#101418`
- panel: `#F4F1EA`
- text: `#182028`
- accent: `#0F766E`
- signal: `#C97A1A`

The app should feel closer to:

- a strategy desk
- a creator operating system

Not closer to:

- a generic SaaS dashboard
- a random AI tool

## Key UX Principles

- The sidebar should stay persistent.
- Each department should feel self-contained.
- Reports should feel like deliverables, not debug output.
- The app should feel project-based, not session-based.
- Important actions should stay visible.
- Outputs should be easy to copy, export, and reopen.

## What Makes The App Feel Premium

Three major things:

- a persistent shell
- project-based work
- report-first pages

If we get those three right, the whole product will immediately feel more mature.

## Architecture Direction

We should not keep scaling the app inside giant files.

Current heavy files:

- `src/App.tsx`
- `src/premium.ts`

These should be progressively broken into feature and domain modules.

Recommended structure:

```text
src/
  app/
    AppShell.tsx
    Sidebar.tsx
    Topbar.tsx
    navigation.ts
  features/
    dashboard/
      DashboardPage.tsx
    video-intel/
      VideoIntelPage.tsx
    channel-clone/
      ChannelClonePage.tsx
    channel-compare/
      ChannelComparePage.tsx
    studio-analytics/
      StudioAnalyticsPage.tsx
    library/
      LibraryPage.tsx
    exports/
      ExportsPage.tsx
    settings/
      SettingsPage.tsx
  services/
    desktop.ts
    storage.ts
  domain/
    video/
    channel/
    exports/
  shared/
    ui/
    hooks/
    types/
```

## Electron / Desktop Layer Direction

The Electron bridge is already useful.
We should preserve that model and cleanly wrap it.

Recommended renderer-side abstraction:

- `services/desktop.ts`

This service should wrap:

- transcript fetching
- video metadata fetching
- channel video fetching
- analytics import
- file export
- PDF export
- open external link

UI pages should call services, not `window.desktopRuntime` directly.

## Domain Logic Direction

The large analysis logic should be split by responsibility.

Recommended extraction targets:

- `domain/video/buildAnalysis.ts`
- `domain/channel/buildChannelDeepDive.ts`
- `domain/channel/buildCloneChannel.ts`
- `domain/channel/buildChannelCompare.ts`
- `domain/export/buildExportContent.ts`

This keeps the logic reusable while making the app easier to reason about.

## State Model Direction

Each department should own its own workspace state.

Examples:

- video intel workspace state
- clone channel workspace state
- compare workspace state
- library state

Recommended long-term idea:
move toward saved projects instead of only saved reports and presets.

Example project types:

- video project
- clone project
- compare project
- analytics project

## Suggested First Build Order

We should not rewrite everything at once.

Recommended rollout:

### Phase 1

Build the shell.

- add sidebar
- add topbar
- add section navigation
- keep existing logic alive underneath

### Phase 2

Split the current major workflows into page-level features.

- Video Intel page
- Channel Clone page
- Channel Compare page
- Library page

### Phase 3

Extract services and domain modules.

- desktop service wrapper
- storage wrapper
- analysis module splits

### Phase 4

Introduce a real project model.

- save workspace as project
- reopen by department
- unify reports, presets, and deliverables

## Best First UI Milestone

The first milestone should be:

- persistent app shell
- dashboard
- video intel page
- channel clone page
- library page

If we ship just that, the product will already feel much more complete.

## Important Constraint

Do not do a full rewrite from scratch.

We should preserve:

- existing channel clone logic
- compare logic
- export logic
- Electron bridge
- storage behavior where possible

This should be a controlled extraction and reorganization.

## Practical Definition Of Success

We know this direction is working when:

- the app opens into a real shell, not a mode stack
- the user can instantly understand where to go
- each major workflow has its own dedicated page
- saved work feels like projects, not temporary runs
- the app looks like a premium desktop product

## Recovery Note

If we ever lose track during implementation, restart from this sequence:

1. build the shell
2. separate departments
3. extract services
4. extract domain logic
5. move toward projects

That is the intended path.
