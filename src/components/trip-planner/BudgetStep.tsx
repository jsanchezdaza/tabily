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
        <button
          onClick={onBack}
          disabled={isLoading}
          className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition duration-200 disabled:opacity-50"
        >
          Back
        </button>
        <button
          onClick={onSubmit}
          disabled={!value || isLoading}
          className="flex-1 bg-emerald-300 text-gray-900 py-3 rounded-lg font-medium hover:bg-emerald-400 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Planning...' : 'Plan my trip'}
        </button>
      </div>
    </div>
  )
}

export default BudgetStep
