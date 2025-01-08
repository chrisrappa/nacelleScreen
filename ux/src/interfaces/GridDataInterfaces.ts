export interface City {
  name: string;
  population: number;
  mayorName: string;
  foundedYear: number;
};

export interface State {
  name: string;
  abbreviation: string;
  capital: string;
  population: number;
  totalArea: number;
  dateAdmittedToUnion: Date;
  governor: string;
  largestCities: City[];
  gdp: number;
  medianIncome: number;
};

export interface GroupedGridProps {
  stateData: State | null;
  loading: boolean | null;
};

export interface StateOption {
  label: string;
  value: string;
};

export interface AppState {
  selectedState: StateOption | null;
  stateData: State | null;
  isLoading: boolean;
  error: string | null;
};