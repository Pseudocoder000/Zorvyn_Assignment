import { useSelector, useDispatch } from "react-redux"
import { markAsRead, markAllAsRead } from "../features/notifications/notificationSlice"
import { useNavigate } from "react-router-dom";

const NotificationsPage = () => {
  const dispatch = useDispatch()
  const notifications = useSelector(state => state.notifications.items)
  const navigate = useNavigate();

  return (
    
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Notifications</h1>
      <button
  onClick={() => navigate(-1)}
  className="mb-4 px-4 py-2 rounded-lg text-sm font-medium transition bg-slate-700 hover:bg-slate-600 text-white"
>
  ← Back
</button>

      <button 
        onClick={() => dispatch(markAllAsRead())}
        className="mb-4 bg-blue-500 text-white px-3 py-1 rounded"
      >
        
        Mark all as read
      </button>
      

      {notifications.length === 0 ? (
        <p>No notifications</p>
      ) : (
        notifications.map(n => (
          <div
            key={n.id}
            onClick={() => dispatch(markAsRead(n.id))}
            className={`p-3 mb-2 rounded-lg cursor-pointer transition-all border ${
  n.read
    ? "bg-slate-800 border-slate-700 text-slate-400"
    : "bg-teal-500/10 border-teal-400/30 text-white font-semibold"
}`}
          >
            {n.message}
          </div>
        ))
      )}
    </div>
  )
}

export default NotificationsPage