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
  const handleNext = () => {
    if (startDate && endDate) {
      onNext()
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">When are you traveling?</h2>
      <DateRangePicker
        startDate={startDate}
        endDate={endDate}
        onChange={onChange}
        errors={errors}
      />
      <div className="flex gap-4">
        <button
          onClick={onBack}
          className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition duration-200"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={!startDate || !endDate}
          className="flex-1 bg-emerald-300 text-gray-900 py-3 rounded-lg font-medium hover:bg-emerald-400 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default DatesStep
