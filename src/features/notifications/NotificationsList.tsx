import { nanoid } from '@reduxjs/toolkit'
import { useAppSelector } from '../../app/withTypes'
import { TimeAgo } from '../posts/TimeAgo'
import { User, selectUserById } from '../users/usersSlice'
import { ServerNotification, selectAllNotifications } from './notificationsSlice'
import { Link } from 'react-router-dom'

const UNKNOWN_USER: User = {
  name: 'Unknown User',
  id: '',
}

export function NotificationsList() {
  const notifications = useAppSelector(selectAllNotifications)

  return (
    <section className="notificationsList">
      <h2>Notifications</h2>
      {notifications.map((n) => (
        <NotificationItem notification={n} key={n.id} />
      ))}
    </section>
  )
}

interface NotificationItemProps {
  notification: ServerNotification
}
function NotificationItem({ notification }: NotificationItemProps) {
  const user = useAppSelector((state) => selectUserById(state, notification.user)) || UNKNOWN_USER
  return (
    <article key={notification.id} className="notification">
      <b>{user.id ? <Link to={`/users/${user.id}`}>{user.name}</Link> : user.name}</b>
      {` ${notification.message} - `}
      <TimeAgo isoTime={notification.date} />
    </article>
  )
}
