import { useAppSelector } from '../../app/hooks'

interface PostAuthorProps {
  userId?: string
}

export function PostAuthor({ userId }: PostAuthorProps) {
  const author = useAppSelector((state) => state.users.find((u) => u.id === userId))

  return <p>by {author?.name ?? 'Unknown author'}</p>
}
