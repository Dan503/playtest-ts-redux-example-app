import { Link } from 'react-router-dom'
import { Spinner } from '../../components/Spinner'
import { PostMetaData } from './PostMetaData'
import { ReactionButtons } from './ReactionButtons'
import { Post, selectAllPosts } from './postsSlice'
import { useMemo } from 'react'
import classNames from 'classnames'
import { useGetPostsQuery } from './postsApiSlice'
import { emptyEntities } from '../../app/apiSlice'
import { useAppSelector } from '../../app/withTypes'

export function PostList() {
  const { isLoading, isSuccess, isError, error, isFetching } = useGetPostsQuery()
  const posts = useAppSelector((state) => selectAllPosts(state))

  const containerClassName = classNames('posts-container', {
    disabled: isFetching,
  })

  return (
    <section className="posts-list">
      <h2>Posts</h2>
      {isLoading && <Spinner text="Loading..." />}
      {isError && <p>{error.toString()}</p>}
      {isSuccess && (
        <div className={containerClassName}>
          {posts.map((post) => (
            <PostExcerpt post={post} key={post.id} />
          ))}
        </div>
      )}
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
