import Button from '../ui/Button'
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
      <Button onClick={handleNext} disabled={!value} className="w-full">
        Next
      </Button>
    </div>
  )
}

export default DestinationStep
