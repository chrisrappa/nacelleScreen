import React, { useState, useEffect } from 'react';
import { StateOption } from '../interfaces/GridDataInterfaces';
import { LoadingSpinner } from './Loading';
import { useNotification } from '../hooks/useNotification';
import { useDebounce } from '../hooks/useDebounce';

interface SearchStateBarProps {
  states: StateOption[];
  onStateSelect: (state: StateOption) => void;
  loading?: boolean;
};

export const SearchStateBar: React.FC<SearchStateBarProps> = ({ 
  states, 
  onStateSelect, 
  loading = false 
}) => {

  const { showNotification } = useNotification();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedState, setSelectedState] = useState<StateOption | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [filteredStates, setFilteredStates] = useState<StateOption[]>(states);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const handleInfo = () => {
    showNotification('Please search for a state!', 'info');
  };

  useEffect(() => {
    const filtered = states.filter(state =>
      state.label.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
    );
    setFilteredStates(filtered);
  }, [debouncedSearchQuery, states]);

  const handleStateSelect = (state: StateOption) => {
    setSelectedState(state);
    setSearchQuery(state.label);
    setIsOpen(false);
    onStateSelect(state);
  };

  const handleClear = () => {
    setSelectedState(null);
    setSearchQuery('');
    handleInfo();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="relative">
        <label htmlFor="state-search" className="block text-sm font-medium text-gray-700 mb-1">
          Select US State
        </label>
        <div className="relative">
          <input
            id="state-search"
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="Search states..."
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            data-testid="state-search-input"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
            {loading && (
              <div className="mr-2" data-testid="loading-spinner">
                <LoadingSpinner />
              </div>
            )}
            {selectedState && (
              <button
                onClick={handleClear}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Clear selection"
                data-testid="clear-button"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M6 18L18 6M6 6l12 12" 
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        {isOpen && filteredStates.length > 0 && (
          <div 
            className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-auto"
            data-testid="dropdown-menu"
          >
            {filteredStates.map((state) => (
              <button
                key={state.value}
                onClick={() => handleStateSelect(state)}
                className="w-full text-left px-4 py-2 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none"
                data-testid={`state-option-${state.value}`}
              >
                {state.label} ({state.value})
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};