import { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/withTypes'
import { logout } from '../features/auth/authSlice'
import { selectCurrentUser } from '../features/users/usersSlice'
import { UserIcon } from './UserIcon'
import { fetchNotifications, selectUnreadNotificationsCount } from '../features/notifications/notificationsSlice'

export const Navbar = () => {
  const dispatch = useAppDispatch()
  const currentUser = useAppSelector(selectCurrentUser)

  let navContent: ReactNode = null

  const isLoggedIn = Boolean(currentUser.id)

  if (isLoggedIn) {
    async function onLogOutClicked() {
      await dispatch(logout())
    }

    function fetchNewNotifications() {
      dispatch(fetchNotifications())
    }

    const numUnreadNotifications = useAppSelector(selectUnreadNotificationsCount)

    const unreadNotificationsBadge =
      numUnreadNotifications > 0 ? <span className="badge">{numUnreadNotifications}</span> : null

    navContent = (
      <div className="navContent">
        <div className="navLinks">
          <Link to="/posts">Post</Link>
          <Link to="/users">Users</Link>
          <Link to="/notifications">Notifications {unreadNotificationsBadge}</Link>
          <button className="button small" onClick={fetchNewNotifications}>
            Refresh Notifications
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
