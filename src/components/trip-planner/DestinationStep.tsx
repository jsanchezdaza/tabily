import DestinationDropdown from '../form/DestinationDropdown'

interface DestinationStepProps {
  value: string
  onChange: (value: string) => void
  onNext: () => void
  error?: string
}

function DestinationStep({ value, onChange, onNext, error }: DestinationStepProps) {
  const handleNext = () => {
    if (value) {
      onNext()
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Where do you want to go?</h2>
      <DestinationDropdown value={value} onChange={onChange} error={error} />
      <button
        onClick={handleNext}
        disabled={!value}
        className="w-full bg-emerald-300 text-gray-900 py-3 rounded-lg font-medium hover:bg-emerald-400 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  )
}

export default DestinationStep
