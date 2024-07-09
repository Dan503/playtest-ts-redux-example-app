import { useAppDispatch } from '../../app/withTypes'
import { useAddReactionMutation } from './postsApiSlice'
import { Post, ReactionName, reactionAdded } from './postsSlice'

const reactionEmoji: Record<ReactionName, string> = {
  thumbsUp: '👍',
  tada: '🎉',
  heart: '❤️',
  rocket: '🚀',
  eyes: '👀',
}

interface ReactionButtonProps {
  post: Post
}

export function ReactionButtons({ post }: ReactionButtonProps) {
  const [addReaction] = useAddReactionMutation()

  return (
    <div>
      {Object.entries(reactionEmoji).map(([emojiName, emojiIcon]) => {
        const reactionName = emojiName as ReactionName
        return (
          <button
            key={emojiName}
            type="button"
            className="muted-button reaction-button"
            onClick={() => addReaction({ postId: post.id, reaction: reactionName })}
          >
            {emojiIcon} {post.reactions[reactionName]}
          </button>
        )
      })}
    </div>
  )
}
