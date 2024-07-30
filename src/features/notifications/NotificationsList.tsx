import { useLayoutEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/withTypes'
import { PostAuthor } from '../posts/PostAuthor'
import { TimeAgo } from '../posts/TimeAgo'
import { allNotificationsRead, selectMetadataEntities, useGetNotificationsQuery } from './notificationsSlice'
import classNames from 'classnames'

export function NotificationsList() {
  const notificationMetaData = useAppSelector(selectMetadataEntities)
  const dispatch = useAppDispatch()
  const { data: notifications = [] } = useGetNotificationsQuery()

  useLayoutEffect(() => {
    dispatch(allNotificationsRead())
  })

  return (
    <section className="notificationsList">
      <h2>Notifications</h2>
      {notifications.map((notification) => {
        // Get the metadata object matching this notification
        const metadata = notificationMetaData[notification.id]
        const notificationClassName = classNames('notification', {
          new: metadata.isNew,
        })
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
