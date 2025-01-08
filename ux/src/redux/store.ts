// src/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { globalSlice } from './globalSlice';
import { notificationsSlice } from './notificationsSlice';

// Configure the store
export const store = configureStore({
  reducer: {
    app: globalSlice.reducer,
    notifications: notificationsSlice.reducer
  },
});

// Export types and hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;