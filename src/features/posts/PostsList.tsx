import { Link } from 'react-router-dom'
import { useAppSelector } from '../../app/hooks'
import { PostMetaData } from './PostMetaData'
import { Post } from './postsSlice'

export function PostList() {
  const posts = useAppSelector((state) => state.posts)

  return (
    <section className="posts-list">
      <h2>Posts</h2>
      {posts.map((post) => (
        <PostExcerpt post={post} key={post.id} />
      ))}
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
    </article>
  )
}
