import { AppState, State, StateOption } from "../interfaces/GridDataInterfaces";
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: AppState = {
  selectedState: null,
  stateData: null,
  isLoading: false,
  error: null,
};

export const globalSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setSelectedState: (state, action: PayloadAction<StateOption | null>) => {
      state.selectedState = action.payload;
    },
    setStateData: (state, action: PayloadAction<State | null>) => {
      state.stateData = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { 
  setSelectedState, 
  setStateData, 
  setLoading, 
  setError 
} = globalSlice.actions;