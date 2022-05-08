import { useAppDispatch } from '../../app/hooks'
import { reactionEmoji } from './emojis'
import { reactionAdded } from './PostsSlice'

export const ReactionButtons = ({ post }) => {
  const dispatch = useAppDispatch()
  const reactionButtons = Object.entries(reactionEmoji).map(([name, emoji]) => {
    return (
      <button
        key={name}
        type="button"
        className="muted-button reaction-button"
        onClick={() =>
          dispatch(reactionAdded({ postId: post.id, reaction: name }))
        }
      >
        {emoji} {post.reactions[name]}
      </button>
    )
  })

  return <div>{reactionButtons}</div>
}
