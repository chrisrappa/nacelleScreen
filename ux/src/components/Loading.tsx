
export const LoadingSpinner: React.FC = () => (
  <div className="animate-spin h-5 w-5">
    <svg className="text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      />
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  </div>
);

export const LoadingSkeleton: React.FC = () => (
  <div className="animate-pulse">
    <div className="grid grid-cols-6 bg-gray-100 text-sm font-semibold text-gray-700">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="p-3">
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      ))}
    </div>

    <div className="border-t border-gray-200">
      <div className="grid grid-cols-6 bg-blue-50">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="p-3">
            <div className="h-4 bg-blue-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>

      {[...Array(5)].map((_, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-6 bg-white border-b border-gray-100">
          {[...Array(6)].map((_, colIndex) => (
            <div key={colIndex} className="p-3">
              <div 
                className="h-4 bg-gray-100 rounded" 
                style={{
                  width: `${Math.random() * 40 + 40}%`,
                  animationDelay: `${rowIndex * 100}ms`
                }}
              ></div>
            </div>
          ))}
        </div>
      ))}
    </div>
  </div>
);