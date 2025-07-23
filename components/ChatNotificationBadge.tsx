// components/ChatNotificationBadge.tsx
import { useState, useEffect } from 'react';
import styles from './NotificationBadge.module.css';

interface ChatNotificationBadgeProps {
  children: React.ReactNode;
}

export default function ChatNotificationBadge({ children }: ChatNotificationBadgeProps) {
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        console.log('💬 ChatNotificationBadge: Fetching unread count...');
        const response = await fetch('/api/messages/unread-count', {
          credentials: 'include' // ważne dla cookies httpOnly
        });
        console.log('💬 ChatNotificationBadge: Response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('💬 ChatNotificationBadge: Received data:', data);
          setUnreadCount(data.unreadCount);
        } else {
          const errorData = await response.json();
          console.log('💬 ChatNotificationBadge: Error response:', errorData);
        }
      } catch (error) {
        console.error('💬 ChatNotificationBadge: Error fetching unread count:', error);
      }
    };

    fetchUnreadCount();

    // Odświeżaj co 30 sekund
    const interval = setInterval(fetchUnreadCount, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.notificationWrapper}>
      {children}
      {unreadCount > 0 && (
        <span className={styles.badge}>
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </div>
  );
}
