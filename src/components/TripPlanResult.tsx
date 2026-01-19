import Button from './ui/Button'
import MarkdownRenderer from './ui/MarkdownRenderer'

interface TripPlanResultProps {
  plan: string
  onPlanAnother: () => void
}

function TripPlanResult({ plan, onPlanAnother }: TripPlanResultProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
        <MarkdownRenderer content={plan} />
      </div>
      <Button onClick={onPlanAnother} className="px-6">
        Plan another trip
      </Button>
    </div>
  )
}

export default TripPlanResult
