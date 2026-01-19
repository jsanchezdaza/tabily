import { POPULAR_CITIES } from '../../constants/cities'
import { inputBaseClasses } from '../ui/Input'

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
        className={inputBaseClasses}
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
