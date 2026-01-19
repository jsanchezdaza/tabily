interface TripPlanResultProps {
  plan: string
  onPlanAnother: () => void
}

export function TripPlanResult({ plan }: TripPlanResultProps) {
  return <div className="whitespace-pre-wrap">{plan}</div>
}
