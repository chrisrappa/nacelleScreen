// GroupedGrid.test.tsx
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { GroupedGrid } from './../GroupedGrid';
import { useNotification } from '../../hooks/useNotification';

// Mock the useNotification hook
jest.mock('../hooks/useNotification');
const mockShowNotification = jest.fn();
(useNotification as jest.Mock).mockReturnValue({ showNotification: mockShowNotification });

// Mock sample data
const mockStateData = {
  name: 'California',
  abbreviation: 'CA',
  population: 39538223,
  capital: 'Sacramento',
  governor: 'Gavin Newsom',
  gdp: 3.37e12,
  totalArea: 163696,
  dateAdmittedToUnion: new Date('1787-12-07'),
  medianIncome: 40000,
  largestCities: [
    {
      name: 'Los Angeles',
      population: 3898747,
      mayorName: 'Karen Bass',
      foundedYear: 1781,
    },
    {
      name: 'San Francisco',
      population: 873965,
      mayorName: 'London Breed',
      foundedYear: 1776,
    },
  ],
};

describe('GroupedGrid', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('renders loading skeleton when loading is true', () => {
    render(<GroupedGrid stateData={mockStateData} loading={true} />);
    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
  });

  test('returns null when stateData is not provided', () => {
    const { container } = render(<GroupedGrid stateData={null} loading={false} />);
    expect(container.firstChild).toBeNull();
  });

  test('renders state data correctly', () => {
    render(<GroupedGrid stateData={mockStateData} loading={false} />);
    
    expect(screen.getByText('California (CA)')).toBeInTheDocument();
    expect(screen.getByText('39,538,223')).toBeInTheDocument();
    expect(screen.getByText('Sacramento')).toBeInTheDocument();
    expect(screen.getByText('Gavin Newsom')).toBeInTheDocument();
    expect(screen.getByText('$3.4B')).toBeInTheDocument();
    expect(screen.getByText('163,696 sq mi')).toBeInTheDocument();
  });

  test('expands and collapses cities list when clicking state row', async () => {
    render(<GroupedGrid stateData={mockStateData} loading={false} />);
    
    // Initially expanded
    expect(screen.getByText('Los Angeles')).toBeInTheDocument();
    
    // Click to collapse
    fireEvent.click(screen.getByText('California (CA)'));
    expect(screen.queryByText('Los Angeles')).not.toBeInTheDocument();
    
    // Verify error notification was shown
    expect(mockShowNotification).toHaveBeenCalledWith('Expand data!', 'error');
    
    // Click to expand again
    fireEvent.click(screen.getByText('California (CA)'));
    expect(screen.getByText('Los Angeles')).toBeInTheDocument();
  });

  test('shows animation when data changes', async () => {
    const { rerender } = render(<GroupedGrid stateData={mockStateData} loading={false} />);
    
    // Initial render
    const gridContainer = screen.getByRole('button').parentElement?.parentElement;
    expect(gridContainer).toHaveClass('opacity-0');
    
    // Wait for animation
    act(() => {
      jest.advanceTimersByTime(500);
    });
    
    await waitFor(() => {
      expect(gridContainer).toHaveClass('opacity-100');
    });
    
    // Rerender with new data
    const newStateData = { ...mockStateData, name: 'Texas' };
    rerender(<GroupedGrid stateData={newStateData} loading={false} />);
    
    expect(gridContainer).toHaveClass('opacity-0');
    
    act(() => {
      jest.advanceTimersByTime(500);
    });
    
    await waitFor(() => {
      expect(gridContainer).toHaveClass('opacity-100');
    });
  });

  test('cleans up timeout on unmount', () => {
    const { unmount } = render(<GroupedGrid stateData={mockStateData} loading={false} />);
    
    const clearTimeoutSpy = jest.spyOn(window, 'clearTimeout');
    unmount();
    
    expect(clearTimeoutSpy).toHaveBeenCalled();
  });

  test('renders city data correctly when expanded', () => {
    render(<GroupedGrid stateData={mockStateData} loading={false} />);
    
    mockStateData.largestCities.forEach(city => {
      expect(screen.getByText(city.name)).toBeInTheDocument();
      expect(screen.getByText(city.population.toLocaleString())).toBeInTheDocument();
      expect(screen.getByText(city.mayorName)).toBeInTheDocument();
      expect(screen.getByText(city.foundedYear.toString())).toBeInTheDocument();
    });
  });

  test('applies correct transition styles to city rows', () => {
    render(<GroupedGrid stateData={mockStateData} loading={false} />);
    
    const cityRows = screen.getAllByText(/Los Angeles|San Francisco/);
    cityRows.forEach((row) => {
      const parentDiv = row.closest('div');
      expect(parentDiv).toHaveClass('transition-all', 'duration-300', 'ease-in-out');
    });
  });
});