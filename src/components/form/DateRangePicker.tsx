interface DateRangePickerProps {
  startDate: string
  endDate: string
  onChange: (dates: { start_date?: string; end_date?: string }) => void
  errors?: {
    start_date?: string
    end_date?: string
  }
}

function DateRangePicker({ startDate, endDate, onChange, errors }: DateRangePickerProps) {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-2">
          Start Date
        </label>
        <input
          id="start-date"
          type="date"
          value={startDate}
          onChange={e => onChange({ start_date: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-300 focus:border-transparent outline-none transition"
        />
        {errors?.start_date && <p className="mt-2 text-sm text-red-600">{errors.start_date}</p>}
      </div>

      <div>
        <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-2">
          End Date
        </label>
        <input
          id="end-date"
          type="date"
          value={endDate}
          onChange={e => onChange({ end_date: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-300 focus:border-transparent outline-none transition"
        />
        {errors?.end_date && <p className="mt-2 text-sm text-red-600">{errors.end_date}</p>}
      </div>
    </div>
  )
}

export default DateRangePicker
