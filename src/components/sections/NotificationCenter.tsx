import { useState } from 'react';
import { Bell, Check, X, AlertCircle, Info, CheckCircle, AlertTriangle } from 'lucide-react';
import styles from './NotificationCenter.module.css';

interface Notification {
  id: number;
  type: 'success' | 'warning' | 'info' | 'error';
  message: string;
  time: string;
  read: boolean;
}

const initialNotifications: Notification[] = [
  { id: 1, type: 'success', message: 'Deployment successful: v19.0.0 is live', time: '2 minutes ago', read: false },
  { id: 2, type: 'info', message: 'New comment on "Task Board" from @kaze', time: '15 minutes ago', read: false },
  { id: 3, type: 'warning', message: 'Storage usage at 85% - consider cleanup', time: '1 hour ago', read: true },
  { id: 4, type: 'success', message: 'Pull request #42 merged successfully', time: '2 hours ago', read: true },
  { id: 5, type: 'error', message: 'Build failed: dependency conflict detected', time: '3 hours ago', read: true },
  { id: 6, type: 'info', message: 'Weekly analytics report is ready', time: '5 hours ago', read: true },
];

const iconMap = {
  success: CheckCircle,
  warning: AlertTriangle,
  info: Info,
  error: AlertCircle,
};

const iconClassMap = {
  success: styles.iconSuccess,
  warning: styles.iconWarning,
  info: styles.iconInfo,
  error: styles.iconError,
};

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState('all');

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNotifications = filter === 'all'
    ? notifications
    : filter === 'unread'
    ? notifications.filter(n => !n.read)
    : notifications.filter(n => n.type === filter);

  const markAsRead = (id: number) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const dismissNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <section className={styles.notificationCenter}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          <Bell className={styles.icon} size={20} />
          Notification Center
          {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
        </h2>
      </div>

      <div className={styles.filterTabs}>
        {['all', 'unread', 'success', 'warning', 'info', 'error'].map((tab) => (
          <button
            key={tab}
            className={`${styles.tab} ${filter === tab ? styles.active : ''}`}
            onClick={() => setFilter(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className={styles.notificationsList}>
        {filteredNotifications.map((notification) => {
          const Icon = iconMap[notification.type];
          return (
            <div
              key={notification.id}
              className={`${styles.notification} ${!notification.read ? styles.unread : ''}`}
            >
              <div className={`${styles.iconWrapper} ${iconClassMap[notification.type]}`}>
                <Icon size={20} />
              </div>
              <div className={styles.content}>
                <div className={styles.message}>{notification.message}</div>
                <div className={styles.time}>{notification.time}</div>
              </div>
              <div className={styles.actions}>
                {!notification.read && (
                  <button
                    className={styles.actionBtn}
                    onClick={() => markAsRead(notification.id)}
                    title="Mark as read"
                  >
                    <Check size={16} />
                  </button>
                )}
                <button
                  className={styles.actionBtn}
                  onClick={() => dismissNotification(notification.id)}
                  title="Dismiss"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
