// components/ProfileNotificationBadge.tsx
import { useState, useEffect } from 'react';
import styles from './NotificationBadge.module.css';

interface ProfileNotificationBadgeProps {
  children: React.ReactNode;
}

export default function ProfileNotificationBadge({ children }: ProfileNotificationBadgeProps) {
  // Profile badge może pokazywać inne powiadomienia (np. komentarze, oceny)
  // Na razie pozostawimy pusty - można rozszerzyć w przyszłości
  const [notificationCount, setNotificationCount] = useState<number>(0);

  return (
    <div className={styles.notificationWrapper}>
      {children}
      {notificationCount > 0 && (
        <span className={styles.badge}>
          {notificationCount > 99 ? '99+' : notificationCount}
        </span>
      )}
    </div>
  );
}
