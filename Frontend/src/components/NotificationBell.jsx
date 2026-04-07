import { useSelector } from "react-redux"
import { Link } from "react-router-dom"

const NotificationBell = () => {
  const notifications = useSelector(state => state.notifications.items)

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <Link to="/notifications" className="relative">
      🔔

      {unreadCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 rounded-full">
          {unreadCount}
        </span>
      )}
    </Link>
  )
}

export default NotificationBell