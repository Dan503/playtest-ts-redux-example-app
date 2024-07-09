import { Link, useParams } from 'react-router-dom'
import { useAppSelector } from '../../app/withTypes'
import { Spinner } from '../../components/Spinner'
import { selectCurrentUserId } from '../auth/authSlice'
import { PostMetaData } from './PostMetaData'
import { ReactionButtons } from './ReactionButtons'
import { useGetPostByIdQuery } from './postsApiSlice'

export function SinglePostPage() {
  const { postId } = useParams()
  const currentUserId = useAppSelector(selectCurrentUserId)

  const { data: post, isError, error, isFetching, isSuccess } = useGetPostByIdQuery(postId)

  if (isFetching) {
    return <Spinner text="Loading..." />
  }

  if (isError) {
    return (
      <section>
        <h2>An error occured</h2>
        <p>{error.toString()}</p>
      </section>
    )
  }

  if (!isSuccess) {
    return null
  }

  const canEdit = currentUserId === post.user

  return (
    <section>
      <article className="post">
        <h2>{post.title}</h2>
        <PostMetaData postId={postId} />
        <p className="post-content">{post.content}</p>
        {canEdit && (
          <p>
            <Link to={`/editPost/${postId}`} className="button">
              Edit
            </Link>
          </p>
        )}
        <ReactionButtons post={post} />
      </article>
    </section>
  )
}
