import Button from '../ui/Button'
import DateRangePicker from '../form/DateRangePicker'

interface DatesStepProps {
  startDate: string
  endDate: string
  onChange: (dates: { start_date?: string; end_date?: string }) => void
  onNext: () => void
  onBack: () => void
  errors?: {
    start_date?: string
    end_date?: string
  }
}

function DatesStep({ startDate, endDate, onChange, onNext, onBack, errors }: DatesStepProps) {
  const isEndDateBeforeStart = !!(startDate && endDate && endDate < startDate)

  const handleNext = () => {
    if (startDate && endDate) {
      onNext()
    }
  }

  const dateErrors = isEndDateBeforeStart
    ? { ...errors, end_date: 'End date must be after start date' }
    : errors

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">When are you traveling?</h2>
      <DateRangePicker
        startDate={startDate}
        endDate={endDate}
        onChange={onChange}
        errors={dateErrors}
      />
      <div className="flex gap-4">
        <Button onClick={onBack} variant="secondary" className="flex-1">
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={!startDate || !endDate || isEndDateBeforeStart}
          className="flex-1"
        >
          Next
        </Button>
      </div>
    </div>
  )
}

export default DatesStep
