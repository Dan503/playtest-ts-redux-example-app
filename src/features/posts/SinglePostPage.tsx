import { Link, useParams } from 'react-router-dom'
import { useAppSelector } from '../../app/hooks'
import { PostMetaData } from './PostMetaData'
import { ReactionButtons } from './ReactionButtons'
import { selectPostById } from './postsSlice'
import { selectCurrentUserId } from '../auth/authSlice'

export function SinglePostPage() {
  const { postId } = useParams()
  const currentUserId = useAppSelector(selectCurrentUserId)
  const post = useAppSelector((state) => selectPostById(state, postId))

  if (!post) {
    return (
      <section>
        <h2>Post not found!</h2>
      </section>
    )
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
