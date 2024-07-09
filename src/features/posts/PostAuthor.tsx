import { useAppSelector } from '../../app/withTypes'
import { selectUserById } from '../users/usersSlice'

interface PostAuthorProps {
  userId: string | null | undefined
}

export function PostAuthor({ userId }: PostAuthorProps) {
  const authorName = useAppSelector((state) => (userId ? selectUserById(state, userId).name : 'Unknown author'))

  return <span>by {authorName}</span>
}
