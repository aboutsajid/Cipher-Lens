# Channel Deep Dive Roadmap

## Purpose

This file stores the approved direction for the next major Pro feature so work can resume from the same point after any interruption.

The goal is to evolve Cipher Lens from a transcript/video analyzer into a channel intelligence product that can thoroughly read any YouTube channel for a new user.

## Product Direction

New Pro capability:

`Channel Deep Dive`

Core promise:

Reverse-engineer any channel's SEO, style, content system, and growth opportunities from its recent videos.

## Why This Matters

This feature upgrades the app from video-level analysis to channel-level strategic intelligence.

It should help users:

- study competitors
- understand a creator's style DNA
- inspect SEO patterns
- identify content gaps
- see publishing cadence and systems
- generate an actionable "copy this channel correctly" brief

## Proposed Deep Dive Sections

### 1. Channel SEO Audit

- recurring title formulas
- average title length
- number usage
- question usage
- how-to / curiosity / result-driven split
- keyword repetition
- description behavior if available
- hashtag / chapter usage if available

### 2. Style DNA

- hook style
- tone
- pacing
- tactical vs storytelling ratio
- CTA language
- intro pattern
- outro pattern
- thumbnail text style later if supported

### 3. Content Architecture

- recurring themes
- content buckets
- series patterns
- beginner vs advanced mix
- long-form vs short-form tendency
- educational vs commentary vs opinion balance

### 4. Publishing System

- recent upload cadence
- consistency
- batch behavior
- topic clustering
- content sequencing

### 5. Audience Positioning

- likely audience type
- beginner / intermediate / advanced
- creator / founder / student / general
- main promise to viewer

### 6. Opportunity Finder

- underused topics
- overused topics
- missing formats
- title pattern opportunities
- easy-win content gaps

### 7. Channel Clone Brief

- title templates
- hook templates
- upload rhythm
- content pillars
- scripting rules
- what to copy
- what to avoid

## Recommended Rollout Order

### Phase 1: Channel Deep Dive v1

Ship first:

- fetch recent channel videos
- build title pattern summary
- build topic cluster summary
- infer channel tone/style
- estimate posting cadence
- generate opportunity finder summary

### Phase 2: SEO + Title Formula Panel

- searchable vs curiosity split
- keyword recurrence
- title template extraction
- title formula examples

### Phase 3: Style DNA

- hook archetypes
- CTA archetypes
- pacing and structure notes
- audience positioning

### Phase 4: Channel Clone Brief

- reusable blueprint output
- "how to make content in this style" summary

### Phase 5: Competitor Compare

- channel A vs channel B
- stronger SEO
- clearer hook style
- better posting system
- whitespace opportunity

### Phase 6: Scorecard + Takeover Sprint

- add numeric channel scorecard
- surface signature moves
- generate a practical takeover sprint
- expose whitespace opportunities inside compare

## Data Requirements

Minimum useful input for v1:

- recent 10 to 30 channel videos
- video title
- video URL
- video ID
- upload date if available
- transcript where available

Nice-to-have later:

- description
- view count
- thumbnail text extraction
- shorts vs long-form labeling

## UX Recommendation

Create a dedicated Pro workspace module:

`Channel Deep Dive`

Suggested tabs or blocks:

- Overview
- SEO Audit
- Style DNA
- Content Map
- Publishing System
- Opportunities
- Clone Brief

Important:

Do not make this a raw dump of metadata. Every section should answer:

- what works here
- what repeats here
- what is weak here
- what should the user copy
- what should the user avoid

## Technical Implementation Idea

### Suggested app flow

1. User enters channel URL in Pro mode.
2. App fetches recent videos.
3. User selects all videos or a subset.
4. App builds channel analysis from aggregated metadata and transcripts.
5. UI renders channel-level insights and action outputs.

### Suggested code slices

- `electron/main.*`
  - expand channel fetch payload if needed
- `src/premium.ts`
  - add channel-level analysis builders and types
- `src/App.tsx`
  - add Channel Deep Dive state and Pro UI
- `src/App.css`
  - add audit/layout styling

## Immediate Next Build Scope

When implementation starts, begin with this exact scope:

### v1 scope

- add channel deep dive analysis types
- aggregate recent channel video titles/transcripts
- compute topic clusters
- compute title formula patterns
- compute cadence summary
- compute audience/style summary
- compute opportunity finder summary
- render a new Pro-only `Channel Deep Dive` section

### v1 outputs

- channel overview
- top themes
- title formula patterns
- style summary
- posting cadence summary
- opportunity finder

## Current Product Context

Already live before this roadmap starts:

- Basic / Pro mode split
- Batch Planner
- Content Calendar
- Repurposing Packs
- Quick Export Deck
- Idea Filters for clip scores and planner channel views

Shipped since roadmap creation:

- Channel Deep Dive v1
- Title Templates
- Next Video Ideas
- Clone Brief
- Competitor Compare
- Channel Scorecard
- Signature Moves
- Takeover Sprint
- Compare Whitespace Opportunities

This means Channel Deep Dive should be built as a Pro-first premium intelligence layer, not as a Basic feature.

## Resume Instruction

If work resumes later, start from:

`Immediate Next Build Scope -> v1 scope`

and implement `Channel Deep Dive v1` in Pro mode first.
