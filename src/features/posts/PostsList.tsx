import { Link } from 'react-router-dom'
import { useGetPostsQuery } from '../../app/apiSlice'
import { Spinner } from '../../components/Spinner'
import { PostMetaData } from './PostMetaData'
import { ReactionButtons } from './ReactionButtons'
import { Post } from './postsSlice'
import { useMemo } from 'react'
import classNames from 'classnames'

export function PostList() {
  const { data: posts = [], isLoading, isSuccess, isError, error, isFetching, refetch } = useGetPostsQuery()

  const sortedPosts = useMemo(() => posts.toSorted((a, b) => b.date.localeCompare(a.date)), [posts])

  const containerClassName = classNames('posts-container', {
    disabled: isFetching,
  })

  return (
    <section className="posts-list">
      <h2>Posts</h2>
      <button onClick={refetch}>Refetch posts</button>
      {isLoading && <Spinner text="Loading..." />}
      {isError && <p>{error.toString()}</p>}
      {isSuccess && (
        <div className={containerClassName}>
          {sortedPosts.map((post) => (
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
