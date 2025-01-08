import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { Notifications } from '../Notifications';
import notificationsReducer from '../../redux/notificationsSlice';
import { Notification } from '../../interfaces/NotificationInterfaces';

// Mock notifications
const mockNotifications: Notification[] = [
  {
    id: '1',
    message: 'Success message',
    type: 'success'
  },
  {
    id: '2',
    message: 'Error message',
    type: 'error'
  },
  {
    id: '3',
    message: 'Info message',
    type: 'info'
  }
];

// Create a mock store
const createMockStore = () => {
  return configureStore({
    reducer: {
      notifications: notificationsReducer,
    }
  });
};

// Test wrapper component
const renderWithProvider = (ui: React.ReactElement, store = createMockStore()) => {
  return render(
    <Provider store={store}>
      {ui}
    </Provider>
  );
};

describe('Notifications', () => {
  test('renders without crashing', () => {
    renderWithProvider(<Notifications />);
    expect(screen.getByRole('complementary')).toBeInTheDocument();
  });

  test('renders all notifications', () => {
    renderWithProvider(<Notifications />);
    
    mockNotifications.forEach(notification => {
      expect(screen.getByText(notification.message)).toBeInTheDocument();
    });
  });

  test('applies correct styles for success notification', () => {
    renderWithProvider(<Notifications />);
    
    const successNotification = screen.getByText('Success message').closest('div');
    expect(successNotification).toHaveClass('bg-green-500', 'border-green-700');
  });

  test('applies correct styles for error notification', () => {
    renderWithProvider(<Notifications />);
    
    const errorNotification = screen.getByText('Error message').closest('div');
    expect(errorNotification).toHaveClass('bg-red-500', 'border-red-700');
  });

  test('applies correct styles for info notification', () => {
    renderWithProvider(<Notifications />);
    
    const infoNotification = screen.getByText('Info message').closest('div');
    expect(infoNotification).toHaveClass('bg-blue-500', 'border-blue-700');
  });

  test('removes notification when close button is clicked', () => {
    const store = createMockStore();
    renderWithProvider(<Notifications />, store);
    
    const closeButtons = screen.getAllByRole('button');
    fireEvent.click(closeButtons[0]);

    // Verify that removeNotification action was dispatched
    const actions = store.getState().notifications.notifications;
    expect(actions).toHaveLength(mockNotifications.length - 1);
  });

  test('renders empty state when no notifications exist', () => {
    const store = createMockStore();
    renderWithProvider(<Notifications />, store);
    
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  test('renders notifications with correct animation classes', () => {
    renderWithProvider(<Notifications />);
    
    const notifications = screen.getAllByRole('button').map(button => 
      button.closest('div[class*="animate-slide-in"]')
    );

    notifications.forEach(notification => {
      expect(notification).toHaveClass(
        'transform',
        'transition-all',
        'duration-500',
        'ease-in-out',
        'animate-slide-in'
      );
    });
  });

  test('getNotificationStyles returns correct classes for each type', () => {
    renderWithProvider(<Notifications />);
    
    const notifications = screen.getAllByRole('button').map(button => 
      button.closest('div[class*="bg-"]')
    );

    expect(notifications[0]).toHaveClass('bg-green-500', 'border-green-700'); // success
    expect(notifications[1]).toHaveClass('bg-red-500', 'border-red-700'); // error
    expect(notifications[2]).toHaveClass('bg-blue-500', 'border-blue-700'); // info
  });

  test('notifications have correct structure and accessibility', () => {
    renderWithProvider(<Notifications />);
    
    mockNotifications.forEach(notification => {
      const container = screen.getByText(notification.message).closest('div');
      
      // Check structure
      expect(container?.parentElement).toHaveClass('flex', 'justify-between', 'items-center');
      
      // Check close button accessibility
      const closeButton = container?.querySelector('button');
      expect(closeButton).toHaveClass('ml-4', 'text-white', 'hover:text-gray-200', 'focus:outline-none');
    });
  });
});