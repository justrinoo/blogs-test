import React, { createContext, useContext, ReactNode } from 'react';
import { notification } from 'antd';

type NotificationType = 'success' | 'info' | 'warning' | 'error';

type NotificationContextType = {
  openNotificationWithIcon: (
    type: NotificationType,
    options: { message: string; description: string }
  ) => void;
};

const NotificationContext = createContext<NotificationContextType | null>(null);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [api, contextHolder] = notification.useNotification();

  const openNotificationWithIcon = (
    type: NotificationType,
    options: { message: string; description: string }
  ) => {
    api[type]({
      message: options.message,
      description: options.description,
    });
  };

  return (
    <NotificationContext.Provider value={{ openNotificationWithIcon }}>
      {contextHolder}
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      'useNotification must be used within a NotificationProvider'
    );
  }
  return context;
};
