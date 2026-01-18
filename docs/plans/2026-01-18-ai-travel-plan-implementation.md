# AI Travel Plan Generation - Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Generate a day-by-day travel itinerary using AI after the user completes the trip form.

**Architecture:** Supabase Edge Function calls OpenRouter API with trip data, returns markdown itinerary. Frontend hook manages the API call and states. New component displays the result.

**Tech Stack:** Supabase Edge Functions (Deno), OpenRouter API, React, TypeScript, Vitest

---

## Task 1: Create Edge Function Structure

**Files:**
- Create: `supabase/functions/generate-travel-plan/index.ts`
- Create: `supabase/functions/generate-travel-plan/deno.json`

**Step 1: Create the Edge Function directory and files**

```bash
mkdir -p supabase/functions/generate-travel-plan
```

**Step 2: Create deno.json configuration**

Create `supabase/functions/generate-travel-plan/deno.json`:
```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

**Step 3: Create the Edge Function with input validation**

Create `supabase/functions/generate-travel-plan/index.ts`:
```typescript
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

interface TripInput {
  destination: string;
  startDate: string;
  endDate: string;
  budget: string;
}

function validateInput(data: unknown): TripInput {
  if (!data || typeof data !== "object") {
    throw new Error("Invalid request body");
  }

  const { destination, startDate, endDate, budget } = data as Record<
    string,
    unknown
  >;

  if (typeof destination !== "string" || !destination.trim()) {
    throw new Error("destination is required");
  }
  if (typeof startDate !== "string" || !startDate.trim()) {
    throw new Error("startDate is required");
  }
  if (typeof endDate !== "string" || !endDate.trim()) {
    throw new Error("endDate is required");
  }
  if (typeof budget !== "string" || !budget.trim()) {
    throw new Error("budget is required");
  }

  return {
    destination: destination.trim(),
    startDate: startDate.trim(),
    endDate: endDate.trim(),
    budget: budget.trim(),
  };
}

function calculateDays(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
}

function buildPrompt(input: TripInput, days: number): string {
  return `Create a ${days}-day travel itinerary for ${input.destination}.

Trip details:
- Dates: ${input.startDate} to ${input.endDate}
- Budget level: ${input.budget}

Please provide a day-by-day itinerary with:
- Morning, afternoon, and evening activities
- Specific places to visit with brief descriptions
- Rough timing for each activity
- Tips relevant to the budget level

Format as markdown with clear day headers.`;
}

async function callOpenRouter(prompt: string): Promise<string> {
  const apiKey = Deno.env.get("OPENROUTER_API_KEY");
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY not configured");
  }

  const model = Deno.env.get("OPENROUTER_MODEL") || "openai/gpt-4o-mini";

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || "No plan generated";
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json();
    const input = validateInput(body);
    const days = calculateDays(input.startDate, input.endDate);
    const prompt = buildPrompt(input, days);
    const plan = await callOpenRouter(prompt);

    return new Response(JSON.stringify({ plan }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const status = message.includes("required") ? 400 : 502;

    return new Response(JSON.stringify({ error: message }), {
      status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
});
```

**Step 4: Commit**

```bash
git add supabase/functions/generate-travel-plan/
git commit -m "feat: add generate-travel-plan edge function"
```

---

## Task 2: Create useGeneratePlan Hook - Test First

**Files:**
- Create: `src/hooks/__tests__/useGeneratePlan.test.ts`
- Create: `src/hooks/useGeneratePlan.ts`

**Step 1: Write the failing test for initial state**

Create `src/hooks/__tests__/useGeneratePlan.test.ts`:
```typescript
import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useGeneratePlan } from "../useGeneratePlan";

describe("useGeneratePlan", () => {
  it("returns initial state", () => {
    const { result } = renderHook(() => useGeneratePlan());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.plan).toBeNull();
    expect(typeof result.current.generate).toBe("function");
  });
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm test:unit src/hooks/__tests__/useGeneratePlan.test.ts`

Expected: FAIL - module not found

**Step 3: Write minimal implementation**

Create `src/hooks/useGeneratePlan.ts`:
```typescript
import { useState } from "react";

interface GeneratePlanResult {
  isLoading: boolean;
  error: string | null;
  plan: string | null;
  generate: (tripData: TripData) => Promise<void>;
}

interface TripData {
  destination: string;
  startDate: string;
  endDate: string;
  budget: string;
}

export function useGeneratePlan(): GeneratePlanResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState<string | null>(null);

  const generate = async (_tripData: TripData): Promise<void> => {
    setIsLoading(true);
    setError(null);
    setPlan(null);
  };

  return { isLoading, error, plan, generate };
}
```

**Step 4: Run test to verify it passes**

Run: `pnpm test:unit src/hooks/__tests__/useGeneratePlan.test.ts`

Expected: PASS

**Step 5: Commit**

```bash
git add src/hooks/useGeneratePlan.ts src/hooks/__tests__/useGeneratePlan.test.ts
git commit -m "feat: add useGeneratePlan hook with initial state"
```

---

## Task 3: Add Loading State Test to useGeneratePlan

**Files:**
- Modify: `src/hooks/__tests__/useGeneratePlan.test.ts`
- Modify: `src/hooks/useGeneratePlan.ts`

**Step 1: Write failing test for loading state**

Add to `src/hooks/__tests__/useGeneratePlan.test.ts`:
```typescript
import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { useGeneratePlan } from "../useGeneratePlan";
import * as supabaseModule from "../../lib/supabase";

vi.mock("../../lib/supabase", () => ({
  supabase: {
    functions: {
      invoke: vi.fn(),
    },
  },
}));

describe("useGeneratePlan", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns initial state", () => {
    const { result } = renderHook(() => useGeneratePlan());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.plan).toBeNull();
    expect(typeof result.current.generate).toBe("function");
  });

  it("sets loading state when generate is called", async () => {
    vi.spyOn(supabaseModule.supabase.functions, "invoke").mockImplementation(
      () => new Promise(() => {})
    );

    const { result } = renderHook(() => useGeneratePlan());

    act(() => {
      result.current.generate({
        destination: "Tokyo",
        startDate: "2024-03-01",
        endDate: "2024-03-05",
        budget: "moderate",
      });
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(true);
    });
  });
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm test:unit src/hooks/__tests__/useGeneratePlan.test.ts`

Expected: FAIL - supabase.functions.invoke not called

**Step 3: Update implementation to call Supabase**

Update `src/hooks/useGeneratePlan.ts`:
```typescript
import { useState } from "react";
import { supabase } from "../lib/supabase";

interface GeneratePlanResult {
  isLoading: boolean;
  error: string | null;
  plan: string | null;
  generate: (tripData: TripData) => Promise<void>;
}

interface TripData {
  destination: string;
  startDate: string;
  endDate: string;
  budget: string;
}

export function useGeneratePlan(): GeneratePlanResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState<string | null>(null);

  const generate = async (tripData: TripData): Promise<void> => {
    setIsLoading(true);
    setError(null);
    setPlan(null);

    await supabase.functions.invoke("generate-travel-plan", {
      body: tripData,
    });
  };

  return { isLoading, error, plan, generate };
}
```

**Step 4: Run test to verify it passes**

Run: `pnpm test:unit src/hooks/__tests__/useGeneratePlan.test.ts`

Expected: PASS

**Step 5: Commit**

```bash
git add src/hooks/useGeneratePlan.ts src/hooks/__tests__/useGeneratePlan.test.ts
git commit -m "feat: add loading state to useGeneratePlan"
```

---

## Task 4: Add Success State Test to useGeneratePlan

**Files:**
- Modify: `src/hooks/__tests__/useGeneratePlan.test.ts`
- Modify: `src/hooks/useGeneratePlan.ts`

**Step 1: Write failing test for success state**

Add to `src/hooks/__tests__/useGeneratePlan.test.ts`:
```typescript
  it("sets plan on successful generation", async () => {
    const mockPlan = "# Day 1\nVisit Tokyo Tower";
    vi.spyOn(supabaseModule.supabase.functions, "invoke").mockResolvedValue({
      data: { plan: mockPlan },
      error: null,
    });

    const { result } = renderHook(() => useGeneratePlan());

    await act(async () => {
      await result.current.generate({
        destination: "Tokyo",
        startDate: "2024-03-01",
        endDate: "2024-03-05",
        budget: "moderate",
      });
    });

    expect(result.current.plan).toBe(mockPlan);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });
```

**Step 2: Run test to verify it fails**

Run: `pnpm test:unit src/hooks/__tests__/useGeneratePlan.test.ts`

Expected: FAIL - plan is null

**Step 3: Update implementation to handle success**

Update `src/hooks/useGeneratePlan.ts`:
```typescript
import { useState } from "react";
import { supabase } from "../lib/supabase";

interface GeneratePlanResult {
  isLoading: boolean;
  error: string | null;
  plan: string | null;
  generate: (tripData: TripData) => Promise<void>;
}

interface TripData {
  destination: string;
  startDate: string;
  endDate: string;
  budget: string;
}

export function useGeneratePlan(): GeneratePlanResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState<string | null>(null);

  const generate = async (tripData: TripData): Promise<void> => {
    setIsLoading(true);
    setError(null);
    setPlan(null);

    try {
      const { data, error: invokeError } = await supabase.functions.invoke(
        "generate-travel-plan",
        { body: tripData }
      );

      if (invokeError) {
        setError(invokeError.message);
        return;
      }

      setPlan(data.plan);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, plan, generate };
}
```

**Step 4: Run test to verify it passes**

Run: `pnpm test:unit src/hooks/__tests__/useGeneratePlan.test.ts`

Expected: PASS

**Step 5: Commit**

```bash
git add src/hooks/useGeneratePlan.ts src/hooks/__tests__/useGeneratePlan.test.ts
git commit -m "feat: add success handling to useGeneratePlan"
```

---

## Task 5: Add Error State Test to useGeneratePlan

**Files:**
- Modify: `src/hooks/__tests__/useGeneratePlan.test.ts`
- Modify: `src/hooks/useGeneratePlan.ts`

**Step 1: Write failing test for error state**

Add to `src/hooks/__tests__/useGeneratePlan.test.ts`:
```typescript
  it("sets error on failed generation", async () => {
    vi.spyOn(supabaseModule.supabase.functions, "invoke").mockResolvedValue({
      data: null,
      error: { message: "API error" },
    });

    const { result } = renderHook(() => useGeneratePlan());

    await act(async () => {
      await result.current.generate({
        destination: "Tokyo",
        startDate: "2024-03-01",
        endDate: "2024-03-05",
        budget: "moderate",
      });
    });

    expect(result.current.error).toBe("API error");
    expect(result.current.isLoading).toBe(false);
    expect(result.current.plan).toBeNull();
  });

  it("sets error on exception", async () => {
    vi.spyOn(supabaseModule.supabase.functions, "invoke").mockRejectedValue(
      new Error("Network error")
    );

    const { result } = renderHook(() => useGeneratePlan());

    await act(async () => {
      await result.current.generate({
        destination: "Tokyo",
        startDate: "2024-03-01",
        endDate: "2024-03-05",
        budget: "moderate",
      });
    });

    expect(result.current.error).toBe("Network error");
    expect(result.current.isLoading).toBe(false);
  });
```

**Step 2: Run test to verify exception test fails**

Run: `pnpm test:unit src/hooks/__tests__/useGeneratePlan.test.ts`

Expected: FAIL - exception not caught

**Step 3: Update implementation to handle exceptions**

Update `src/hooks/useGeneratePlan.ts`:
```typescript
import { useState } from "react";
import { supabase } from "../lib/supabase";

interface GeneratePlanResult {
  isLoading: boolean;
  error: string | null;
  plan: string | null;
  generate: (tripData: TripData) => Promise<void>;
}

interface TripData {
  destination: string;
  startDate: string;
  endDate: string;
  budget: string;
}

export function useGeneratePlan(): GeneratePlanResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState<string | null>(null);

  const generate = async (tripData: TripData): Promise<void> => {
    setIsLoading(true);
    setError(null);
    setPlan(null);

    try {
      const { data, error: invokeError } = await supabase.functions.invoke(
        "generate-travel-plan",
        { body: tripData }
      );

      if (invokeError) {
        setError(invokeError.message);
        return;
      }

      setPlan(data.plan);
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, plan, generate };
}
```

**Step 4: Run test to verify it passes**

Run: `pnpm test:unit src/hooks/__tests__/useGeneratePlan.test.ts`

Expected: PASS

**Step 5: Commit**

```bash
git add src/hooks/useGeneratePlan.ts src/hooks/__tests__/useGeneratePlan.test.ts
git commit -m "feat: add error handling to useGeneratePlan"
```

---

## Task 6: Create TripPlanResult Component - Test First

**Files:**
- Create: `src/components/__tests__/TripPlanResult.test.tsx`
- Create: `src/components/TripPlanResult.tsx`

**Step 1: Write failing test for rendering plan**

Create `src/components/__tests__/TripPlanResult.test.tsx`:
```typescript
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TripPlanResult } from "../TripPlanResult";

describe("TripPlanResult", () => {
  it("renders the plan content", () => {
    const plan = "# Day 1\nVisit Tokyo Tower";

    render(<TripPlanResult plan={plan} onPlanAnother={() => {}} />);

    expect(screen.getByText(/Day 1/)).toBeInTheDocument();
    expect(screen.getByText(/Visit Tokyo Tower/)).toBeInTheDocument();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm test:unit src/components/__tests__/TripPlanResult.test.tsx`

Expected: FAIL - module not found

**Step 3: Write minimal implementation**

Create `src/components/TripPlanResult.tsx`:
```typescript
interface TripPlanResultProps {
  plan: string;
  onPlanAnother: () => void;
}

export function TripPlanResult({ plan }: TripPlanResultProps) {
  return (
    <div className="whitespace-pre-wrap">
      {plan}
    </div>
  );
}
```

**Step 4: Run test to verify it passes**

Run: `pnpm test:unit src/components/__tests__/TripPlanResult.test.tsx`

Expected: PASS

**Step 5: Commit**

```bash
git add src/components/TripPlanResult.tsx src/components/__tests__/TripPlanResult.test.tsx
git commit -m "feat: add TripPlanResult component"
```

---

## Task 7: Add Button Test to TripPlanResult

**Files:**
- Modify: `src/components/__tests__/TripPlanResult.test.tsx`
- Modify: `src/components/TripPlanResult.tsx`

**Step 1: Write failing test for button**

Add to `src/components/__tests__/TripPlanResult.test.tsx`:
```typescript
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TripPlanResult } from "../TripPlanResult";

describe("TripPlanResult", () => {
  it("renders the plan content", () => {
    const plan = "# Day 1\nVisit Tokyo Tower";

    render(<TripPlanResult plan={plan} onPlanAnother={() => {}} />);

    expect(screen.getByText(/Day 1/)).toBeInTheDocument();
    expect(screen.getByText(/Visit Tokyo Tower/)).toBeInTheDocument();
  });

  it("calls onPlanAnother when button is clicked", async () => {
    const user = userEvent.setup();
    const onPlanAnother = vi.fn();

    render(<TripPlanResult plan="Test plan" onPlanAnother={onPlanAnother} />);

    await user.click(screen.getByRole("button", { name: /plan another trip/i }));

    expect(onPlanAnother).toHaveBeenCalledTimes(1);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm test:unit src/components/__tests__/TripPlanResult.test.tsx`

Expected: FAIL - button not found

**Step 3: Update implementation with button**

Update `src/components/TripPlanResult.tsx`:
```typescript
import { Button } from "./ui/Button";

interface TripPlanResultProps {
  plan: string;
  onPlanAnother: () => void;
}

export function TripPlanResult({ plan, onPlanAnother }: TripPlanResultProps) {
  return (
    <div className="space-y-6">
      <div className="whitespace-pre-wrap rounded-lg bg-white p-6 shadow">
        {plan}
      </div>
      <Button onClick={onPlanAnother}>Plan another trip</Button>
    </div>
  );
}
```

**Step 4: Run test to verify it passes**

Run: `pnpm test:unit src/components/__tests__/TripPlanResult.test.tsx`

Expected: PASS

**Step 5: Commit**

```bash
git add src/components/TripPlanResult.tsx src/components/__tests__/TripPlanResult.test.tsx
git commit -m "feat: add plan another button to TripPlanResult"
```

---

## Task 8: Integrate into TripPlannerContainer - Test First

**Files:**
- Modify: `src/components/trip-planner/__tests__/TripPlannerContainer.test.tsx`
- Modify: `src/components/trip-planner/TripPlannerContainer.tsx`

**Step 1: Write failing test for showing generation state**

First, read the existing test file to understand the current test patterns, then add a new test.

Add to `src/components/trip-planner/__tests__/TripPlannerContainer.test.tsx`:
```typescript
  it("shows generating state after form submission", async () => {
    const user = userEvent.setup();
    mockCreateTrip.mockResolvedValue("trip-123");
    mockGenerate.mockImplementation(() => new Promise(() => {}));

    render(<TripPlannerContainer />);

    // Complete step 1 - destination
    await user.selectOptions(screen.getByRole("combobox"), "Tokyo, Japan");
    await user.click(screen.getByRole("button", { name: /next/i }));

    // Complete step 2 - dates
    const [startInput, endInput] = screen.getAllByRole("textbox");
    await user.type(startInput, "2024-03-01");
    await user.type(endInput, "2024-03-05");
    await user.click(screen.getByRole("button", { name: /next/i }));

    // Complete step 3 - budget and submit
    await user.click(screen.getByLabelText(/moderate/i));
    await user.click(screen.getByRole("button", { name: /plan my trip/i }));

    await waitFor(() => {
      expect(screen.getByText(/creating your personalized travel plan/i)).toBeInTheDocument();
    });
  });
```

Note: This test will require mocking the useGeneratePlan hook. The exact implementation will depend on the existing test structure. Read the existing test file first.

**Step 2: Run test to verify it fails**

Run: `pnpm test:unit src/components/trip-planner/__tests__/TripPlannerContainer.test.tsx`

Expected: FAIL - generating state not shown

**Step 3: Update TripPlannerContainer to call generate after save**

This step requires reading the existing TripPlannerContainer.tsx to understand its structure, then modifying the submit handler to:
1. Save the trip (existing behavior)
2. Call generate with trip data
3. Show generating state while loading
4. Show result when done

The implementation will need to:
- Import and use `useGeneratePlan` hook
- Add state to track if we're in generating/result phase
- Conditionally render loading state or TripPlanResult

**Step 4: Run test to verify it passes**

Run: `pnpm test:unit src/components/trip-planner/__tests__/TripPlannerContainer.test.tsx`

Expected: PASS

**Step 5: Commit**

```bash
git add src/components/trip-planner/TripPlannerContainer.tsx src/components/trip-planner/__tests__/TripPlannerContainer.test.tsx
git commit -m "feat: integrate plan generation into trip planner"
```

---

## Task 9: Add Result Display Test

**Files:**
- Modify: `src/components/trip-planner/__tests__/TripPlannerContainer.test.tsx`

**Step 1: Write test for showing generated plan**

Add to test file:
```typescript
  it("shows generated plan after successful generation", async () => {
    const user = userEvent.setup();
    const mockPlan = "# Day 1\nVisit Tokyo Tower";
    mockCreateTrip.mockResolvedValue("trip-123");
    mockGenerate.mockResolvedValue(undefined);
    // Set up hook to return the plan after generate is called

    render(<TripPlannerContainer />);

    // Complete form submission...

    await waitFor(() => {
      expect(screen.getByText(/Day 1/)).toBeInTheDocument();
      expect(screen.getByText(/Visit Tokyo Tower/)).toBeInTheDocument();
    });
  });
```

**Step 2: Run test and implement as needed**

**Step 3: Commit**

```bash
git add src/components/trip-planner/__tests__/TripPlannerContainer.test.tsx
git commit -m "test: add result display test for trip planner"
```

---

## Task 10: Add Error Handling Test

**Files:**
- Modify: `src/components/trip-planner/__tests__/TripPlannerContainer.test.tsx`

**Step 1: Write test for error state**

Add to test file:
```typescript
  it("shows error message when generation fails", async () => {
    const user = userEvent.setup();
    mockCreateTrip.mockResolvedValue("trip-123");
    // Set up hook to return an error

    render(<TripPlannerContainer />);

    // Complete form submission...

    await waitFor(() => {
      expect(screen.getByText(/failed to generate/i)).toBeInTheDocument();
    });
  });
```

**Step 2: Implement error display in component**

**Step 3: Commit**

```bash
git add src/components/trip-planner/TripPlannerContainer.tsx src/components/trip-planner/__tests__/TripPlannerContainer.test.tsx
git commit -m "feat: add error handling to trip plan generation"
```

---

## Task 11: Run Full Validation

**Step 1: Run pnpm validate**

```bash
pnpm run validate
```

Expected: All checks pass (tests, lint, type-check, build)

**Step 2: Fix any issues**

If any errors, fix them and re-run validation.

**Step 3: Final commit if needed**

```bash
git add -A
git commit -m "fix: address validation issues"
```

---

## Task 12: Deploy Edge Function

**Step 1: Set environment variables in Supabase**

In Supabase dashboard:
- Go to Project Settings > Edge Functions
- Add `OPENROUTER_API_KEY` with your OpenRouter API key
- Optionally add `OPENROUTER_MODEL` (defaults to `openai/gpt-4o-mini`)

**Step 2: Deploy the edge function**

```bash
supabase functions deploy generate-travel-plan
```

Note: This requires Supabase CLI to be installed and linked to the project.

**Step 3: Test the deployment**

Test via curl or the app to verify the function works with real API calls.

---

## Summary

| Task | Description | Files |
|------|-------------|-------|
| 1 | Create Edge Function | `supabase/functions/generate-travel-plan/*` |
| 2 | useGeneratePlan - initial state | `src/hooks/useGeneratePlan.ts` |
| 3 | useGeneratePlan - loading state | `src/hooks/useGeneratePlan.ts` |
| 4 | useGeneratePlan - success state | `src/hooks/useGeneratePlan.ts` |
| 5 | useGeneratePlan - error state | `src/hooks/useGeneratePlan.ts` |
| 6 | TripPlanResult - render plan | `src/components/TripPlanResult.tsx` |
| 7 | TripPlanResult - button | `src/components/TripPlanResult.tsx` |
| 8 | Integrate - generating state | `src/components/trip-planner/TripPlannerContainer.tsx` |
| 9 | Integrate - result display | `src/components/trip-planner/TripPlannerContainer.tsx` |
| 10 | Integrate - error handling | `src/components/trip-planner/TripPlannerContainer.tsx` |
| 11 | Full validation | - |
| 12 | Deploy edge function | - |
