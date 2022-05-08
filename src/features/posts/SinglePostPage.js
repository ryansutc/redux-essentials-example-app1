import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

// omit imports
import { selectPostById } from './PostsSlice'
import { ReactionButtons } from './ReactionButton'

// https://redux.js.org/tutorials/essentials/part-4-using-data
export const SinglePostPage = ({ match }) => {
  const { postId } = match.params

  const post = useSelector((state) => selectPostById(state, postId))

  if (!post) {
    return (
      <section>
        <h2>Post not found :(</h2>
      </section>
    )
  }

  return (
    <section>
      <article className="post">
        <h2>{post.title}</h2>
        <p className="post-content">{post.content}</p>
        <ReactionButtons post={post} />
        <Link to={`/editPost/${post.id}`} className="button">
          Edit Post
        </Link>
      </article>
    </section>
  )
}
