import { motion, AnimatePresence } from 'framer-motion';
import useGameStore from '../store/gameStore';
import '../styles/Notifications.css';

function Notifications() {
  const { notifications } = useGameStore();

  const getIcon = (type) => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '💬';
    }
  };

  const getColor = (type) => {
    switch (type) {
      case 'success': return 'var(--color-success)';
      case 'error': return 'var(--color-danger)';
      case 'warning': return 'var(--color-rebel)';
      case 'info': return 'var(--color-secondary)';
      default: return 'var(--color-primary)';
    }
  };

  return (
    <div className="notifications-container">
      <AnimatePresence>
        {notifications.map((notif) => (
          <motion.div
            key={notif.id}
            className="notification"
            style={{ borderColor: getColor(notif.type) }}
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <span className="notification-icon">{getIcon(notif.type)}</span>
            <span className="notification-message">{notif.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default Notifications;
