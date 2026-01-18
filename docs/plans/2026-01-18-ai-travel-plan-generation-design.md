# AI Travel Plan Generation

## Overview

Generate a day-by-day travel itinerary using AI after the user completes the trip questionnaire. The AI model is accessed through OpenRouter, with the API key secured in a Supabase Edge Function.

## User Flow

1. User fills out trip form (destination, dates, budget)
2. User submits → data saved to Supabase
3. App shows loading state ("Creating your personalized travel plan...")
4. App calls Edge Function with trip data
5. Edge Function calls OpenRouter → returns generated itinerary
6. App displays the day-by-day itinerary

## Technical Design

### Edge Function: `generate-travel-plan`

**Input:**
```typescript
{
  destination: string;    // e.g., "Tokyo, Japan"
  startDate: string;      // e.g., "2024-02-15"
  endDate: string;        // e.g., "2024-02-20"
  budget: string;         // e.g., "moderate" | "budget" | "luxury"
}
```

**Output:**
```typescript
{
  plan: string;  // Generated itinerary as markdown
}
```

**Environment variables:**
- `OPENROUTER_API_KEY` - OpenRouter API key
- `OPENROUTER_MODEL` - Model ID (optional, defaults to `openai/gpt-4o-mini`)

**Error responses:**
- 400 Bad Request - Invalid input
- 502 Bad Gateway - OpenRouter API error
- 500 Internal Server Error - Missing configuration

### Frontend Components

**New hook: `useGeneratePlan.ts`**
- Calls the Edge Function
- Manages loading/error/success states
- Returns `{ generate, isLoading, error, plan }`

**New component: `TripPlanResult.tsx`**
- Renders the generated markdown itinerary
- "Plan another trip" button to return to form

**State machine:**
```typescript
type PlannerState =
  | { step: 'form' }
  | { step: 'generating' }
  | { step: 'result', plan: string }
  | { step: 'error', message: string }
```

### Files to Create/Modify

| File | Action |
|------|--------|
| `supabase/functions/generate-travel-plan/index.ts` | Create |
| `src/hooks/useGeneratePlan.ts` | Create |
| `src/components/TripPlanResult.tsx` | Create |
| Trip planner flow | Modify |

## Testing Strategy

**Unit tests (Vitest):**
- `useGeneratePlan` hook with mocked Supabase
- `TripPlanResult` component rendering
- State transitions

**Edge Function tests:**
- Input validation
- Prompt construction
- Error handling

**E2E tests (Playwright):**
- Full flow with mocked Edge Function response
- Error state handling

## Scope

**In scope (MVP):**
- Generate day-by-day itinerary
- Display the result
- Configurable AI model

**Out of scope:**
- Saving the generated plan
- Regeneration
- Streaming response
- User-provided API keys

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| API key location | Edge Function | Security - key not exposed to client |
| Response display | All at once | Simpler than streaming for MVP |
| Plan storage | None | YAGNI - display only for now |
| Default model | GPT-4o-mini | Cost efficient for MVP |
