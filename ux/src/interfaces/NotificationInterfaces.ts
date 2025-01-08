export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
};

export interface NotificationsState {
  notifications: Notification[];
};

export type NotificationPayload = {
  message: string;
  type: 'success' | 'error' | 'info';
};