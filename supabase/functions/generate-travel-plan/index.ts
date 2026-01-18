import 'jsr:@supabase/functions-js/edge-runtime.d.ts'

interface TripInput {
  destination: string
  startDate: string
  endDate: string
  budget: string
}

function validateInput(data: unknown): TripInput {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid request body')
  }

  const { destination, startDate, endDate, budget } = data as Record<string, unknown>

  if (typeof destination !== 'string' || !destination.trim()) {
    throw new Error('destination is required')
  }
  if (typeof startDate !== 'string' || !startDate.trim()) {
    throw new Error('startDate is required')
  }
  if (typeof endDate !== 'string' || !endDate.trim()) {
    throw new Error('endDate is required')
  }
  if (typeof budget !== 'string' || !budget.trim()) {
    throw new Error('budget is required')
  }

  return {
    destination: destination.trim(),
    startDate: startDate.trim(),
    endDate: endDate.trim(),
    budget: budget.trim(),
  }
}

function calculateDays(startDate: string, endDate: string): number {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diffTime = Math.abs(end.getTime() - start.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
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

Format as markdown with clear day headers.`
}

async function callOpenRouter(prompt: string): Promise<string> {
  const apiKey = Deno.env.get('OPENROUTER_API_KEY')
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY not configured')
  }

  const model = Deno.env.get('OPENROUTER_MODEL') || 'openai/gpt-4o-mini'

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`)
  }

  const data = await response.json()
  return data.choices[0]?.message?.content || 'No plan generated'
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const body = await req.json()
    const input = validateInput(body)
    const days = calculateDays(input.startDate, input.endDate)
    const prompt = buildPrompt(input, days)
    const plan = await callOpenRouter(prompt)

    return new Response(JSON.stringify({ plan }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    const status = message.includes('required') ? 400 : 502

    return new Response(JSON.stringify({ error: message }), {
      status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })
  }
})
