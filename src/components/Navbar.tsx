import React, { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { userLoggedOut } from '../features/auth/authSlice'
import { UserIcon } from './UserIcon'
import { selectCurrentUser } from '../features/users/usersSlice'

export const Navbar = () => {
  const dispatch = useAppDispatch()
  const currentUser = useAppSelector(selectCurrentUser)

  const isLoggedIn = Boolean(currentUser)
  let navContent: ReactNode = null

  if (isLoggedIn) {
    function onLogOutClicked() {
      dispatch(userLoggedOut())
    }

    navContent = (
      <div className="navContent">
        <div className="navLinks">
          <Link to="/posts">Post</Link>
          <Link to="/users">Users</Link>
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
