import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Select = ({
  type,
  placeholder,
  onChange,
  icon,
  error,
  title,
  options,
  value,
}) => {
  return (
    <div className="relative mb-6">
      {/* Modern label styling */}
      <label
        htmlFor={type}
        className="block text-sm font-semibold text-text-secondary mb-2 px-1 tracking-wide uppercase"
      >
        {title}
      </label>

      {/* Select container with icon */}
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
            <FontAwesomeIcon icon={icon} className="text-text-muted text-lg" />
          </div>
        )}

        <select
          id={type}
          value={value || ""}
          className={`
            w-full px-4 py-3.5 rounded-xl
            bg-background-tertiary/50 border border-white/10
            text-text-primary text-base
            transition-all duration-300
            focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50
            hover:border-white/20
            ${icon ? "pl-12" : "pl-4"}
            ${
              error
                ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/50"
                : ""
            }
            appearance-none
            cursor-pointer
          `}
          onChange={(event) => onChange(event.target.value)}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Custom dropdown arrow */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg
            className="w-5 h-5 text-text-muted"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {/* Error message with modern styling */}
      {error && (
        <div className="mt-2 px-2">
          <p className="text-sm text-red-400 font-medium flex items-center gap-1">
            <span>⚠</span>
            <span>{error}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default Select;
