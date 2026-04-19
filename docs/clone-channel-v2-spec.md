# Clone Channel V2 Spec

## Summary

`Clone Channel` turns Cipher Lens from a transcript analyzer into a YouTube strategy system.

The feature should help a creator:

1. decode why a target channel works
2. extract the repeatable parts of its growth system
3. adapt those parts to their own niche, size, and style
4. leave with a usable 30/60/90-day execution plan

This is an expansion of the existing `Channel Lab` flow, not a replacement. The current deep-dive outputs in [`src/premium.ts`](../src/premium.ts) already cover `overview`, `scorecard`, `titlePatterns`, `styleDNA`, `opportunityFinder`, `cloneBrief`, and `takeoverSprint`. V2 packages that into a more deliberate, flagship workflow.

## Product Goal

Positioning line:

`Decode any YouTube channel's growth system and turn it into a custom blueprint for your own.`

## Primary User

A YouTube creator who wants to study another channel and answer:

- What niche and promise is this channel really built on?
- Which topics and formats are driving its growth?
- How does it package videos for clicks?
- How does it hold attention?
- What part of the system is safe to imitate?
- What exact plan should I follow on my own channel?

## Non-Goals

- Helping users plagiarize exact titles, thumbnails, scripts, or brand language
- Full YouTube analytics replacement
- Direct performance forecasting with false precision

## User Outcome

The user should finish a session with:

- a clear target-channel strategy snapshot
- reusable title, hook, and content patterns
- a shortlist of ideas worth testing
- a tailored plan for their own channel
- guardrails that prevent obvious copying

## Entry Points

### Primary Entry

- `Channel Lab -> Clone Channel`

### Secondary Entry

- From a completed `Deep Dive`, surface a CTA:
  `Convert This Deep Dive Into A Clone Plan`

## Workflow

1. User pastes a target channel URL.
2. Cipher Lens fetches recent videos and selected metadata.
3. User optionally adds:
   - their own channel URL
   - niche
   - channel size
   - `faceless` or `on-camera`
   - goal: `views`, `subs`, `authority`, or `sales`
4. App builds a strategic profile of the target channel.
5. App identifies repeatable growth patterns.
6. App compares those patterns against the user's context.
7. App generates an adaptation plan and exportable report.

## Information Architecture

V2 should become a dedicated result flow with these tabs:

- `Overview`
- `DNA`
- `Winning Videos`
- `Titles`
- `Thumbnails`
- `Hooks`
- `Audience`
- `Monetization`
- `Adapt To Me`
- `Action Plan`

### Phase 1 Compatibility

To reduce implementation cost, Phase 1 can ship inside the current tab model in [`src/App.tsx`](../src/App.tsx):

- `overview`
- `strategy`
- `opportunities`
- `deck`
- `breakdown`

That means V2 can launch without a full navigation redesign by adding new cards to existing tabs first.

## Screen Spec

### 1. Overview

Purpose:
Give the user a fast, high-confidence read on the target channel.

Cards:

- `Channel Summary`
  - one-paragraph explanation of the channel's real niche, promise, and edge
- `Cloneability Score`
  - how practical this strategy is to adapt
- `System Strength Score`
  - how repeatable the growth system appears
- `Packaging Dependence Score`
  - how much performance seems driven by titles/thumbnails
- `Personality Dependence Score`
  - how much the strategy relies on creator charisma or personal brand
- `Monetization Maturity Score`
  - how clearly the channel converts attention into business outcomes
- `Top Lessons`
  - 3-5 bullets
- `Top Risks`
  - 3-5 bullets

Primary CTA:

- `Build My Clone Plan`

### 2. DNA

Purpose:
Show what the channel fundamentally is.

Cards:

- `Audience`
- `Core Promise`
- `Content Pillars`
- `Brand Tone`
- `Creator Edge`
- `Format Mix`

Output fields:

- target audience
- channel promise
- emotional angle
- dominant topic pillars
- dominant formats
- tone descriptors
- channel edge

### 3. Winning Videos

Purpose:
Separate winners from average uploads and explain the difference.

Cards:

- `Top Performer Snapshot`
- `Winner Patterns`
- `Underperformer Patterns`
- `Winner vs Baseline`
- `Steal These Structures`

Per-video breakdown:

- title
- view label
- publish label
- primary theme
- title score
- transcript coverage
- hook type
- format type
- CTA type

### 4. Titles

Purpose:
Explain packaging logic, not just list titles.

Cards:

- `Title Formula Mix`
- `High-Performing Title Patterns`
- `Recurring Trigger Words`
- `Curiosity vs Clarity`
- `Templates To Adapt`
- `Patterns To Avoid`

Categories:

- how-to
- warning
- comparison
- case study
- transformation
- contrarian
- mistake/failure
- framework/system
- list
- authority claim

### 5. Thumbnails

Purpose:
Explain thumbnail psychology.

Cards:

- `Visual Style Summary`
- `Text Density`
- `Face Usage`
- `Emotion Intensity`
- `Contrast And Simplicity`
- `Thumbnail Rules Worth Borrowing`

Inputs:

- thumbnail image
- OCR text
- simple visual heuristics

### 6. Hooks

Purpose:
Explain how the channel wins the first 30-60 seconds.

Cards:

- `Dominant Hook Style`
- `Time To First Payoff`
- `Common Retention Devices`
- `Rehook Moments`
- `Hook Templates To Adapt`

Hook categories:

- pain-first
- bold-claim
- proof-first
- story-first
- result-first
- conflict-first
- roadmap-first

### 7. Audience

Purpose:
Explain what viewers actually respond to.

Cards:

- `Audience Value Drivers`
- `Repeated Praise`
- `Repeated Requests`
- `Confusion Or Friction`
- `High-Signal Comments`
- `Content Gaps The Audience Is Asking For`

### 8. Monetization

Purpose:
Map the business system behind the channel.

Cards:

- `Primary Monetization Model`
- `CTA Mix`
- `Offer Types`
- `Pitch Timing`
- `Soft Sell vs Hard Sell`
- `Monetization Lessons`

### 9. Adapt To Me

Purpose:
Translate the target strategy to the user's actual situation.

Inputs:

- my channel URL
- my niche
- my current level
- faceless or on-camera
- primary goal

Cards:

- `What Fits`
- `What Needs Adapting`
- `What To Ignore`
- `Fastest Lift For My Channel`
- `Best Pillar To Start With`
- `Packaging I Can Borrow Safely`

### 10. Action Plan

Purpose:
Turn analysis into execution.

Cards:

- `Borrow / Adapt / Avoid`
- `First 5 Experiments`
- `30-Day Plan`
- `60-Day Plan`
- `90-Day Plan`
- `Next 12 Video Ideas`
- `Title Test Matrix`
- `Hook Test Matrix`

Exports:

- markdown clone report
- PDF strategy deck
- content sprint brief

## Data Inputs

### Already Available In Repo

From current code paths:

- channel URL
- video titles
- video URLs
- published labels
- view labels and parsed counts
- descriptions when available
- thumbnail URLs
- thumbnail OCR text
- transcript text when available
- optional YouTube Studio CSV metrics

Relevant code:

- [`electron/main.cjs`](../electron/main.cjs)
- [`src/App.tsx`](../src/App.tsx)
- [`src/premium.ts`](../src/premium.ts)
- [`src/youtube-studio.ts`](../src/youtube-studio.ts)

### New Inputs Needed For Full V2

- comment ingestion
- richer thumbnail image heuristics
- stronger publish-date normalization
- optional user-channel compare context
- optional monetization annotations

## Data Model

Recommended approach:
keep `ChannelDeepDiveBundle` for backwards compatibility, then layer a dedicated clone bundle on top.

```ts
type CloneChannelInput = {
  targetChannelUrl: string;
  sampleSize: number;
  targetVideos: ChannelVideo[];
  myChannelUrl?: string;
  myNiche?: string;
  myChannelStage?: "new" | "small" | "growing" | "established";
  myPresentationStyle?: "faceless" | "on-camera";
  myGoal?: "views" | "subs" | "authority" | "sales";
};

type CloneChannelScores = {
  cloneability: number;
  systemStrength: number;
  packagingDependence: number;
  personalityDependence: number;
  monetizationMaturity: number;
  nicheSaturationRisk: number;
};

type ChannelDNA = {
  audience: string[];
  promise: string;
  pillars: string[];
  formats: string[];
  tone: string[];
  creatorEdge: string[];
};

type WinnerPattern = {
  label: string;
  note: string;
  evidence: string[];
};

type TitleIntel = {
  formulas: string[];
  triggerWords: string[];
  clarityVsCuriosity: string;
  templates: string[];
  avoidPatterns: string[];
};

type HookIntel = {
  dominantStyles: string[];
  averageSecondsToPayoff: number | null;
  retentionDevices: string[];
  reusableTemplates: string[];
};

type AudienceIntel = {
  praise: string[];
  requests: string[];
  confusion: string[];
  valueDrivers: string[];
};

type MonetizationIntel = {
  primaryModel: string[];
  ctaTypes: string[];
  offerTypes: string[];
  pitchTiming: string[];
  lessons: string[];
};

type AdaptationPlan = {
  fits: string[];
  adapt: string[];
  avoid: string[];
  firstExperiments: string[];
  day30: string[];
  day60: string[];
  day90: string[];
  nextVideoIdeas: string[];
};

type CloneChannelBundle = {
  targetLabel: string;
  targetUrl: string;
  overview: string;
  scores: CloneChannelScores;
  dna: ChannelDNA;
  winnerPatterns: WinnerPattern[];
  titleIntel: TitleIntel;
  thumbnailIntel: string[];
  hookIntel: HookIntel;
  audienceIntel: AudienceIntel;
  monetizationIntel: MonetizationIntel;
  adaptationPlan: AdaptationPlan;
  exportDeck: string;
};
```

## Scoring Logic

These scores should stay heuristic and directional, not pretend to be ground truth.

### Cloneability Score

High when:

- titles and formats are repeatable
- channel is not too personality-dependent
- themes are structurally reusable
- results do not rely on celebrity access or unique life story

### System Strength Score

High when:

- topic pillars are consistent
- titles show repeatable patterns
- series logic is visible
- upload cadence is deliberate

### Packaging Dependence Score

High when:

- title formulas are strong and repeated
- thumbnails follow clear, reusable patterns
- imported CTR data is strong when available

### Personality Dependence Score

High when:

- identity and charisma appear central
- thumbnails heavily rely on face/emotion/persona
- scripts are deeply autobiographical or fame-driven

### Monetization Maturity Score

High when:

- descriptions contain conversion links
- calls-to-action are intentional
- offers are visible and repeated
- sponsor or product strategy is coherent

### Niche Saturation Risk

High when:

- topic space is crowded
- title shapes are generic
- positioning overlap is heavy
- differentiation opportunities are weak

## Prompt And Heuristic Logic

Cipher Lens already leans on deterministic heuristics in [`src/premium.ts`](../src/premium.ts). V2 should preserve that approach where possible, then optionally layer model-generated summaries on top.

### Heuristic Pass

The first pass should compute:

- topic clusters
- title formula categories
- transcript coverage
- format guesses
- hook types
- thumbnail OCR summaries
- cadence patterns
- CTA markers in descriptions/transcripts

### Synthesis Pass

Then build higher-level outputs:

- channel DNA
- winner patterns
- adaptation guidance
- 30/60/90-day plan

### Suggested Prompt Shape For Future AI Summaries

System intent:

`You are a YouTube growth strategist. Extract repeatable strategy patterns from channel data. Prioritize structural insights over stylistic imitation. Never encourage direct copying of identity, wording, or branding.`

Input sections:

- channel overview
- top video sample
- title patterns
- thumbnail notes
- transcript-derived style notes
- audience/comment signals
- monetization signals
- user context

Requested outputs:

- one-paragraph strategy summary
- 5 repeatable patterns
- 5 unsafe-to-copy warnings
- 5 ideas to adapt now
- 30/60/90-day plan

## Detection Rules By Module

### Channel DNA

Signals:

- repeated nouns in titles/descriptions/transcripts
- repeated promises and outcomes
- creator-facing vocabulary
- content format patterns

### Winner Patterns

Signals:

- highest visible views
- strongest studio metrics when present
- strongest title scores
- repeated topics among top performers

### Titles

Signals:

- regex category matches
- length distribution
- use of numbers
- use of direct audience language
- use of high-consequence words

### Thumbnails

Signals:

- OCR text length
- repeated short phrases
- face usage detection in later phase
- simplicity and contrast heuristics in later phase

### Hooks

Signals:

- first 30-60 seconds of transcript
- claim, proof, pain, story, and roadmap patterns
- time-to-value estimation

### Audience

Signals:

- comments when available
- fallback to transcript intent and CTA echoes when comments are not available

### Monetization

Signals:

- links in descriptions
- sponsor phrases
- affiliate markers
- newsletter/course/community keywords
- CTA phrases in transcript

## Safe Clone Guardrail

The product should clearly distinguish:

- `Clone The System`
- `Do Not Clone The Surface`

Add a `Differentiate` section in the final report:

- change title wording even when keeping the title structure
- change thumbnail composition even when keeping the underlying psychology
- keep the lesson, not the catchphrase
- keep the format logic, not the brand persona

## Recommended MVP Scope

### MVP

Build on the current deep-dive pipeline and ship:

- channel DNA card set
- winner pattern detection
- title formula engine
- hook analyzer
- cloneability scoring
- adaptation plan
- clone report export

### Phase 2

- thumbnail board
- audience comment mining
- monetization mapper
- `Adapt To Me` compare panel

### Phase 3

- multi-channel clone compare
- saved clone workspaces
- richer visual thumbnail analysis
- experiment tracker

## Implementation Notes

### Existing Files To Extend

- [`src/premium.ts`](../src/premium.ts)
  - add clone bundle builder
  - add score helpers
  - add title/hook classification helpers
- [`src/App.tsx`](../src/App.tsx)
  - add Clone Channel entry point
  - add result cards/tabs
  - add adaptation inputs
- [`src/App.css`](../src/App.css)
  - add score cards, blueprint cards, and action-plan layouts
- [`electron/main.cjs`](../electron/main.cjs)
  - later: add comment ingestion or richer metadata fetches

### Recommended Build Order

1. extend `premium.ts` with `buildCloneChannel`
2. reuse current channel-loaded sample data
3. render V2 cards inside existing `overview`, `strategy`, and `opportunities` tabs
4. add export deck
5. add user-context adaptation form
6. only then consider full tab redesign

## Acceptance Criteria

The feature is ready for MVP when:

- a user can paste a channel URL and get a channel DNA summary
- the app identifies repeatable winner patterns from the current sample
- the app produces reusable title and hook patterns
- the app outputs a cloneability score with plain-language explanation
- the app generates `borrow`, `adapt`, and `avoid` guidance
- the app exports a markdown report with a 30/60/90-day plan

## Open Questions

- Do we want comment analysis in MVP, or hold it for Phase 2?
- Should `Clone Channel` be a tab inside `Channel Lab` or a named workflow card on the home surface?
- Should adaptation require the user's own channel URL, or allow niche-only input?
- How much of thumbnail analysis should be heuristic vs image-model-assisted later?

## Suggested Copy

Feature name:

`Clone Channel`

Subtitle:

`Turn any creator's strategy into your own growth blueprint.`

Primary CTA:

`Build My Clone Plan`
