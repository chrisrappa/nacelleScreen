import { useEffect, useState } from "react";
import { LoadingSkeleton } from "./Loading";
import { GroupedGridProps } from "../interfaces/GridDataInterfaces";
import { useNotification } from "../hooks/useNotification";

export const GroupedGrid: React.FC<GroupedGridProps> = ({ stateData, loading }) => {
  
  const { showNotification } = useNotification();
  
  const [isExpanded, setIsExpanded] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  const handleError = () => {
    showNotification('Expand data!', 'error');
  };

  useEffect(() => {
    if(!isExpanded){
      handleError();
    };

    //eslint-disable-next-line
  }, [isExpanded]);

  useEffect(() => {
    setIsVisible(false);
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);
    return () => clearTimeout(timer);

    //eslint-disable-next-line
  }, [stateData]);

  if (loading) {
    return (
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <LoadingSkeleton />
      </div>
    );
  }
  
  if (!stateData) return null;

  return (
    <div className={`
      overflow-hidden rounded-lg border border-gray-200
      transition-opacity duration-500 ease-in-out
      ${isVisible ? 'opacity-100' : 'opacity-0'}
    `}>
      {/* Headers */}
      <div className="grid grid-cols-6 bg-gray-100 text-sm font-semibold text-gray-700">
        <div className="p-3">Name</div>
        <div className="p-3">Population</div>
        <div className="p-3">Capital/Mayor</div>
        <div className="p-3">Governor/Founded</div>
        <div className="p-3">GDP</div>
        <div className="p-3">Area/Income</div>
      </div>

      {/* State Row */}
      <div className="border-t border-gray-200">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full grid grid-cols-6 bg-blue-50 hover:bg-blue-100 transition-colors"
        >
          <div className="p-3 font-semibold flex items-center gap-2">
            <span className="text-blue-600">
              {isExpanded ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </span>
            {stateData.name} ({stateData.abbreviation})
          </div>
          <div className="p-3">{stateData.population.toLocaleString()}</div>
          <div className="p-3">{stateData.capital}</div>
          <div className="p-3">{stateData.governor}</div>
          <div className="p-3">${(stateData.gdp / 1e9).toFixed(1)}B</div>
          <div className="p-3">{stateData.totalArea.toLocaleString()} sq mi</div>
        </button>

        {/* Cities */}
        {isExpanded && (
          <div className="bg-white">
            {stateData.largestCities.map((city, index) => (
              <div
                key={city.name}
                className={`
                  grid grid-cols-6 
                  ${index !== stateData.largestCities.length - 1 ? 'border-b border-gray-100' : ''}
                  transition-all duration-300 ease-in-out
                  ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                `}
                style={{
                  transitionDelay: `${index * 100}ms`
                }}
              >
                <div className="p-3 pl-10">{city.name}</div>
                <div className="p-3">{city.population.toLocaleString()}</div>
                <div className="p-3">{city.mayorName}</div>
                <div className="p-3">{city.foundedYear}</div>
                <div className="p-3">-</div>
                <div className="p-3">-</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};