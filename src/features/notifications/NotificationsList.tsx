import { useAppDispatch, useAppSelector } from '../../app/withTypes'
import { TimeAgo } from '../posts/TimeAgo'
import { UNKNOWN_USER, selectUserById } from '../users/usersSlice'
import { ClientNotification, allNotificationsRead, selectAllNotifications } from './notificationsSlice'
import { Link } from 'react-router-dom'
import { useLayoutEffect } from 'react'
import classNames from 'classnames'

export function NotificationsList() {
  const notifications = useAppSelector(selectAllNotifications)
  const dispatch = useAppDispatch()

  useLayoutEffect(() => {
    console.log('dispatch(allNotificationsRead())')
    dispatch(allNotificationsRead())
  })

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
  notification: ClientNotification
}
function NotificationItem({ notification }: NotificationItemProps) {
  const user = useAppSelector((state) => selectUserById(state, notification.user)) || UNKNOWN_USER
  const notificationClassName = classNames('notification', {
    new: notification.isNew,
  })
  return (
    <article key={notification.id} className={notificationClassName}>
      <b>{user.id ? <Link to={`/users/${user.id}`}>{user.name}</Link> : user.name}</b>
      {` ${notification.message} - `}
      <TimeAgo isoTime={notification.date} />
    </article>
  )
}
