import { POPULAR_CITIES } from '../../constants/cities'

interface DestinationDropdownProps {
  value: string
  onChange: (value: string) => void
  error?: string
}

function DestinationDropdown({ value, onChange, error }: DestinationDropdownProps) {
  return (
    <div>
      <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-2">
        Destination
      </label>
      <select
        id="destination"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-300 focus:border-transparent outline-none transition"
      >
        <option value="">Select a destination</option>
        {POPULAR_CITIES.map(city => (
          <option key={city} value={city}>
            {city}
          </option>
        ))}
      </select>
      {error && (
        <p role="alert" className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}

export default DestinationDropdown
