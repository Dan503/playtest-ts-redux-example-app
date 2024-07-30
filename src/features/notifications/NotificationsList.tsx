import { useLayoutEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/withTypes'
import { PostAuthor } from '../posts/PostAuthor'
import { TimeAgo } from '../posts/TimeAgo'
import { allNotificationsRead, selectAllNotifications } from './notificationsSlice'
import classNames from 'classnames'

export function NotificationsList() {
  const notifications = useAppSelector(selectAllNotifications)
  const dispatch = useAppDispatch()

  useLayoutEffect(() => {
    dispatch(allNotificationsRead())
  })

  return (
    <section className="notificationsList">
      <h2>Notifications</h2>
      {notifications.map((notification) => {
        const notificationClassName = classNames('notification', { new: notification.isNew })
        return (
          <div key={notification.id} className={notificationClassName}>
            <div>
              <b>
                <PostAuthor userId={notification.user} />
              </b>{' '}
              {notification.message}
            </div>
            <TimeAgo isoTime={notification.date} />
          </div>
        )
      })}
    </section>
  )
}
