import { Link, useParams } from 'react-router-dom'
import { useAppSelector } from '../../app/withTypes'
import { selectUserById } from './usersSlice'
import { selectAllPosts } from '../posts/postsSlice'

export function UserPage() {
  const { userId } = useParams()
  const user = useAppSelector((state) => selectUserById(state, userId))
  const postsByUser = useAppSelector((state) => {
    const allPosts = selectAllPosts(state)
    // ⁉️ This seems sketchy!
    return allPosts.filter((post) => post.user === userId)
  })

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
