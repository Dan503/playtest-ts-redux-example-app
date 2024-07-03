import { useAppSelector } from '../../app/hooks'
import { PostAuthor } from './PostAuthor'
import { TimeAgo } from './TimeAgo'
import { selectPostById } from './postsSlice'

interface PostMeatDataProps {
  postId: string | undefined
}

export function PostMetaData({ postId }: PostMeatDataProps) {
  const post = useAppSelector((state) => selectPostById(state, postId))
  return (
    <p>
      <PostAuthor userId={post?.user} />
      {' - '}
      {post?.date && <TimeAgo isoTime={post?.date} />}
    </p>
  )
}
