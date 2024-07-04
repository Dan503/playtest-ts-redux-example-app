import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/withTypes'
import { Spinner } from '../../components/Spinner'
import { PostMetaData } from './PostMetaData'
import { ReactionButtons } from './ReactionButtons'
import { Post, fetchPosts, selectAllPosts } from './postsSlice'

export function PostList() {
  const posts = useAppSelector(selectAllPosts)
  const postStatus = useAppSelector((state) => state.posts.status)
  const sortedPosts = posts.slice().sort((a, b) => b.date.localeCompare(a.date))
  const dispatch = useAppDispatch()
  const errorMessage = useAppSelector((state) => state.posts.error)

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
      {postStatus === 'success' && sortedPosts.map((post) => <PostExcerpt post={post} key={post.id} />)}
    </section>
  )
}

interface PostExcerptProps {
  post: Post
}
function PostExcerpt({ post }: PostExcerptProps) {
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
