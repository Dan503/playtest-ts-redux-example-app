import classNames from 'classnames'
import { useLayoutEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/withTypes'
import { TimeAgo } from '../posts/TimeAgo'
import { selectUserById, UNKNOWN_USER } from '../users/usersSlice'
import {
  allNotificationsRead,
  NotificationMetaData,
  selectMetadataEntities,
  ServerNotification,
  useGetNotificationsQuery,
} from './notificationsSlice'

export function NotificationsList() {
  const dispatch = useAppDispatch()

  const { data: notifications = [] } = useGetNotificationsQuery()
  const notificationsMetaData = useAppSelector(selectMetadataEntities)

  useLayoutEffect(() => {
    console.log('dispatch(allNotificationsRead())')
    dispatch(allNotificationsRead())
  })

  return (
    <section className="notificationsList">
      <h2>Notifications</h2>
      {notifications.map((n) => {
        const metadata = notificationsMetaData[n.id]
        return <NotificationItem notification={n} metaData={metadata} key={n.id} />
      })}
    </section>
  )
}

interface NotificationItemProps {
  notification: ServerNotification
  metaData: NotificationMetaData
}
function NotificationItem({ notification, metaData }: NotificationItemProps) {
  const user = useAppSelector((state) => selectUserById(state, notification.user)) || UNKNOWN_USER
  const notificationClassName = classNames('notification', {
    new: metaData.isNew,
  })
  return (
    <article key={notification.id} className={notificationClassName}>
      <b>{user.id ? <Link to={`/users/${user.id}`}>{user.name}</Link> : user.name}</b>
      {` ${notification.message} - `}
      <TimeAgo isoTime={notification.date} />
    </article>
  )
}
