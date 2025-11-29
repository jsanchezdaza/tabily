interface BudgetOption {
  value: string
  label: string
}

const BUDGET_OPTIONS: BudgetOption[] = [
  { value: 'free', label: 'Only show free activities' },
  { value: 'poor', label: 'My budget is poor (only show main paid activities)' },
  { value: 'moderate', label: 'I have budget for several activities' },
  { value: 'unlimited', label: "I don't care about money" },
]

interface BudgetOptionsProps {
  value: string
  onChange: (value: string) => void
}

function BudgetOptions({ value, onChange }: BudgetOptionsProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700 mb-3">Budget Preference</label>
      {BUDGET_OPTIONS.map(option => (
        <label
          key={option.value}
          className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition"
        >
          <input
            type="radio"
            name="budget"
            value={option.value}
            checked={value === option.value}
            onChange={e => onChange(e.target.value)}
            className="w-4 h-4 text-emerald-500 focus:ring-emerald-300"
          />
          <span className="ml-3 text-gray-900">{option.label}</span>
        </label>
      ))}
    </div>
  )
}

export default BudgetOptions
