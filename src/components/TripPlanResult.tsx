import Button from './ui/Button'

interface TripPlanResultProps {
  plan: string
  onPlanAnother: () => void
}

export function TripPlanResult({ plan, onPlanAnother }: TripPlanResultProps) {
  return (
    <div className="space-y-6">
      <div className="whitespace-pre-wrap rounded-lg bg-white p-6 shadow">{plan}</div>
      <Button onClick={onPlanAnother}>Plan another trip</Button>
    </div>
  )
}
