import { Link, useParams } from 'react-router-dom'
import { useAppSelector } from '../../app/withTypes'
import { selectUserById } from './usersSlice'
import { selectPostByUserId } from '../posts/postsSlice'

export function UserPage() {
  const { userId } = useParams()
  const user = useAppSelector((state) => selectUserById(state, userId))
  const postsByUser = useAppSelector((state) => selectPostByUserId(state, userId!))

  if (!user) {
    return (
      <section>
        <h2>User not found!</h2>
      </section>
    )
  }

  return (
    <section>
      <h2>{user.name}</h2>
      <ul>
        {postsByUser.map((post) => (
          <li key={post.id}>
            <Link to={`/posts/${post.id}`}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
