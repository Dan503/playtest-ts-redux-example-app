import { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/withTypes'
import { logout } from '../features/auth/authSlice'
import {
  fetchNotificationsWebsocket,
  selectNotificationsMetadata,
  useGetNotificationsQuery,
} from '../features/notifications/notificationsSlice'
import { selectCurrentUser } from '../features/users/usersSlice'
import { UserIcon } from './UserIcon'

export const Navbar = () => {
  const dispatch = useAppDispatch()
  const currentUser = useAppSelector(selectCurrentUser)

  let navContent: ReactNode = null

  useGetNotificationsQuery()

  const notificationsMetaData = useAppSelector(selectNotificationsMetadata)
  const numUnreadNotifications = notificationsMetaData.filter((n) => !n.isRead).length

  const isLoggedIn = Boolean(currentUser.id)

  if (isLoggedIn) {
    async function onLogOutClicked() {
      await dispatch(logout())
    }
    async function fetchNewNotifications() {
      await dispatch(fetchNotificationsWebsocket())
    }

    const unreadNotificationBadge =
      numUnreadNotifications > 0 ? <span className="badge">{numUnreadNotifications}</span> : <></>

    navContent = (
      <div className="navContent">
        <div className="navLinks">
          <Link to="/posts">Post</Link>
          <Link to="/users">Users</Link>
          <Link to="/notifications">Notifications {unreadNotificationBadge}</Link>
          <button className="small button" onClick={fetchNewNotifications}>
            Refresh notifications
          </button>
        </div>
        <div className="userDetails">
          <UserIcon size={32} />
          {currentUser?.name + ' '}
          <button className="button small" onClick={onLogOutClicked}>
            Log out
          </button>
        </div>
      </div>
    )
  }

  return (
    <nav>
      <section>
        <h1>Redux Essentials Example</h1>
        {navContent}
      </section>
    </nav>
  )
}
