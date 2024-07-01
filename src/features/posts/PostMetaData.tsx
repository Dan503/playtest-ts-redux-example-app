import { useAppSelector } from '../../app/hooks'
import { PostAuthor } from './PostAuthor'
import { TimeAgo } from './TimeAgo'

interface PostMeatDataProps {
  postId: string | undefined
}

export function PostMetaData({ postId }: PostMeatDataProps) {
  const post = useAppSelector((state) => state.posts.find((p) => p.id === postId))
  return (
    <p>
      <PostAuthor userId={post?.authorUserId} />
      {' - '}
      {post?.isoDate && <TimeAgo isoTime={post?.isoDate} />}
    </p>
  )
}
