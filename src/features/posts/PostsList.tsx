import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/withTypes'
import { Spinner } from '../../components/Spinner'
import { PostMetaData } from './PostMetaData'
import { ReactionButtons } from './ReactionButtons'
import { fetchPosts, selectAllPostIds, selectPostById } from './postsSlice'

export function PostList() {
  const postStatus = useAppSelector((state) => state.posts.status)
  const dispatch = useAppDispatch()
  const errorMessage = useAppSelector((state) => state.posts.error)
  const orderedPostIds = useAppSelector(selectAllPostIds)

  useEffect(() => {
    if (postStatus === 'idle') {
      dispatch(fetchPosts())
    }
  }, [postStatus, dispatch])

  return (
    <section className="posts-list">
      <h2>Posts</h2>
      {postStatus === 'loading' && <Spinner text="Loading..." />}
      {postStatus === 'fail' && errorMessage && <p>{errorMessage}</p>}
      {postStatus === 'success' && orderedPostIds.map((postId) => <PostExcerpt postId={postId} key={postId} />)}
    </section>
  )
}

interface PostExcerptProps {
  postId: string
}
function PostExcerpt({ postId }: PostExcerptProps) {
  const post = useAppSelector((state) => selectPostById(state, postId))
  return (
    <article className="post-excerpt">
      <h3>
        <Link to={`/posts/${post.id}`}>{post.title}</Link>
      </h3>
      <PostMetaData postId={post.id} />
      <p>{post.content.substring(0, 100)}</p>
      <ReactionButtons post={post} />
    </article>
  )
}
