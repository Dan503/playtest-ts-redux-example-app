import { useAppSelector } from '../../app/withTypes'
import { PostAuthor } from '../posts/PostAuthor'
import { TimeAgo } from '../posts/TimeAgo'
import { selectAllNotifications } from './notificationsSlice'

export function NotificationsList() {
  const notifications = useAppSelector(selectAllNotifications)

  return (
    <section className="notificationsList">
      <h2>Notifications</h2>
      {notifications.map((notification) => (
        <div key={notification.id} className="notification">
          <div>
            <b>
              <PostAuthor userId={notification.user} />
            </b>{' '}
            {notification.message}
          </div>
          <TimeAgo isoTime={notification.date} />
        </div>
      ))}
    </section>
  )
}
