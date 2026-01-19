import Button from '../ui/Button'
import BudgetOptions from '../form/BudgetOptions'

interface BudgetStepProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  onBack: () => void
  isLoading: boolean
}

function BudgetStep({ value, onChange, onSubmit, onBack, isLoading }: BudgetStepProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">What's your budget?</h2>
      <BudgetOptions value={value} onChange={onChange} />
      <div className="flex gap-4">
        <Button onClick={onBack} disabled={isLoading} variant="secondary" className="flex-1">
          Back
        </Button>
        <Button onClick={onSubmit} disabled={!value || isLoading} className="flex-1">
          {isLoading ? 'Planning...' : 'Plan my trip'}
        </Button>
      </div>
    </div>
  )
}

export default BudgetStep
