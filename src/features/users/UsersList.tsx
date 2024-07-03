import { Link } from 'react-router-dom'
import { useAppSelector } from '../../app/hooks'
import { selectAllUsers } from './usersSlice'

export function UsersList() {
  const users = useAppSelector(selectAllUsers)

  return (
    <section>
      <h2>Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <Link to={`/users/${user.id}`}>{user.name}</Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
