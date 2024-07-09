import { Link, useParams } from 'react-router-dom'
import { useAppSelector } from '../../app/withTypes'
import { selectUserById } from './usersSlice'
import { Post } from '../posts/postsSlice'
import { TypedUseQueryStateResult } from '@reduxjs/toolkit/query/react'
import { createSelector, EntityState } from '@reduxjs/toolkit'
import { useGetPostsQuery } from '../posts/postsApiSlice'

// Create a TS type that represents:
// "the result value passed into the `selectFromResult` function for this hook"
type GetPostSelectFromResultArg = TypedUseQueryStateResult<EntityState<Post, string>, any, any>

const selectPostsByUser = createSelector(
  (res: GetPostSelectFromResultArg) => res.data,
  (_res: GetPostSelectFromResultArg, userId: string) => userId,
  (data, userId) => Object.values(data || {}).filter((post) => post.user === userId),
)

export function UserPage() {
  const { userId } = useParams()
  const user = useAppSelector((state) => selectUserById(state, userId!))

  // Use the same posts query, but extract only part of its data
  const { postsByUser } = useGetPostsQuery(undefined, {
    selectFromResult: (result) => ({
      // Optional: Include all of the existing result fields like `isFetching`
      ...result,
      // Include a field called `postsByUser` in the result object,
      // which will be a filtered list of posts
      postsByUser: selectPostsByUser(result, userId!),
    }),
  })
  // const postsByUser = useAppSelector((state) => selectPostByUserId(state, userId!))

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
        {postsByUser?.map((post) => (
          <li key={post.id}>
            <Link to={`/posts/${post.id}`}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
