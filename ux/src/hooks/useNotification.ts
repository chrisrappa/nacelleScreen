// src/hooks/useNotification.ts
import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid'; 
import { useAppDispatch } from '../redux/store';
import { addNotification, removeNotification } from '../redux/notificationsSlice';

export const useNotification = () => {
  const dispatch = useAppDispatch();

  const showNotification = useCallback(
    (message: string, type: 'success' | 'error' | 'info' = 'info') => {
      const id = uuidv4(); // Generate ID here if needed for timeout
      dispatch(addNotification({ message, type }));

      // Auto-dismiss after 3 seconds
      setTimeout(() => {
        dispatch(removeNotification(id));
      }, 3000);
    },
    [dispatch]
  );

  return { showNotification };
};