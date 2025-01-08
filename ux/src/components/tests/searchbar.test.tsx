import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StateOption } from '../../interfaces/GridDataInterfaces';
import { SearchStateBar } from '../Searchbar';

// Mock useNotification hook
const mockShowNotification = jest.fn();
jest.mock('../../hooks/useNotification', () => ({
  useNotification: () => ({
    showNotification: mockShowNotification,
  }),
}));

const mockStates: StateOption[] = [
  { value: 'CA', label: 'California' },
  { value: 'NY', label: 'New York' },
  { value: 'TX', label: 'Texas' },
];

describe('SearchStateBar', () => {
  const mockOnStateSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('renders search input with label', () => {
    render(
      <SearchStateBar
        states={mockStates} 
        onStateSelect={mockOnStateSelect} 
      />
    );
    
    expect(screen.getByLabelText('Select US State')).toBeInTheDocument();
    expect(screen.getByTestId('state-search-input')).toBeInTheDocument();
  });

  test('shows dropdown on input focus', () => {
    render(
      <SearchStateBar 
        states={mockStates} 
        onStateSelect={mockOnStateSelect} 
      />
    );
    
    const input = screen.getByTestId('state-search-input');
    fireEvent.focus(input);
    
    expect(screen.getByTestId('dropdown-menu')).toBeInTheDocument();
    mockStates.forEach(state => {
      expect(screen.getByText(`${state.label} (${state.value})`)).toBeInTheDocument();
    });
  });

  test('debounces search query and filters states', async () => {
    render(
      <SearchStateBar 
        states={mockStates} 
        onStateSelect={mockOnStateSelect} 
      />
    );
    
    const input = screen.getByTestId('state-search-input');
    fireEvent.focus(input);
    
    // Type "Cal" quickly
    await userEvent.type(input, 'Cal');
    
    // Initially, all states might still be visible due to debounce
    expect(screen.queryByText('New York (NY)')).toBeInTheDocument();
    
    // Advance timers by debounce delay
    act(() => {
      jest.advanceTimersByTime(300);
    });
    
    // After debounce, only California should be visible
    expect(screen.getByText('California (CA)')).toBeInTheDocument();
    expect(screen.queryByText('New York (NY)')).not.toBeInTheDocument();
    expect(screen.queryByText('Texas (TX)')).not.toBeInTheDocument();
  });

  test('selects state and calls onStateSelect', async () => {
    render(
      <SearchStateBar 
        states={mockStates} 
        onStateSelect={mockOnStateSelect} 
      />
    );
    
    const input = screen.getByTestId('state-search-input');
    fireEvent.focus(input);
    
    const californiaOption = screen.getByTestId('state-option-CA');
    fireEvent.click(californiaOption);
    
    expect(mockOnStateSelect).toHaveBeenCalledWith(mockStates[0]);
    expect(input).toHaveValue('California');
  });

  test('clears selection and shows notification', () => {
    render(
      <SearchStateBar 
        states={mockStates} 
        onStateSelect={mockOnStateSelect} 
      />
    );
    
    // First select a state
    const input = screen.getByTestId('state-search-input');
    fireEvent.focus(input);
    const californiaOption = screen.getByTestId('state-option-CA');
    fireEvent.click(californiaOption);
    
    // Then clear the selection
    const clearButton = screen.getByTestId('clear-button');
    fireEvent.click(clearButton);
    
    expect(input).toHaveValue('');
    expect(mockShowNotification).toHaveBeenCalledWith('Please search for a state!', 'info');
  });

  test('handles loading state', () => {
    render(
      <SearchStateBar 
        states={mockStates} 
        onStateSelect={mockOnStateSelect}
        loading={true}
      />
    );
    
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    expect(screen.getByTestId('state-search-input')).toBeDisabled();
  });

  test('updates filtered states when search query changes', async () => {
    render(
      <SearchStateBar 
        states={mockStates} 
        onStateSelect={mockOnStateSelect} 
      />
    );
    
    const input = screen.getByTestId('state-search-input');
    fireEvent.focus(input);
    
    // Type "new" and wait for debounce
    await userEvent.type(input, 'new');
    act(() => {
      jest.advanceTimersByTime(300);
    });
    
    expect(screen.getByText('New York (NY)')).toBeInTheDocument();
    expect(screen.queryByText('California (CA)')).not.toBeInTheDocument();
    
    // Change query to "tex" and wait for debounce
    await userEvent.clear(input);
    await userEvent.type(input, 'tex');
    act(() => {
      jest.advanceTimersByTime(300);
    });
    
    expect(screen.getByText('Texas (TX)')).toBeInTheDocument();
    expect(screen.queryByText('New York (NY)')).not.toBeInTheDocument();
  });

  test('handles empty search results', async () => {
    render(
      <SearchStateBar 
        states={mockStates} 
        onStateSelect={mockOnStateSelect} 
      />
    );
    
    const input = screen.getByTestId('state-search-input');
    fireEvent.focus(input);
    
    await userEvent.type(input, 'xyz');
    act(() => {
      jest.advanceTimersByTime(300);
    });
    
    expect(screen.queryByTestId('dropdown-menu')).not.toBeInTheDocument();
  });

  test('maintains dropdown state on input focus/blur', () => {
    render(
      <SearchStateBar 
        states={mockStates} 
        onStateSelect={mockOnStateSelect} 
      />
    );
    
    const input = screen.getByTestId('state-search-input');
    
    // Focus should show dropdown
    fireEvent.focus(input);
    expect(screen.getByTestId('dropdown-menu')).toBeInTheDocument();
    
    // Blur without selection should keep dropdown visible
    fireEvent.blur(input);
    expect(screen.getByTestId('dropdown-menu')).toBeInTheDocument();
  });
});