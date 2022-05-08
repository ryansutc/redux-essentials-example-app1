import React from "react"

import { Link } from "react-router-dom"

import { PostAuthor } from "./PostsAuthor"
import { ReactionButtons } from "./ReactionButton"
import { TimeAgo } from "./TimeAgo"

export const PostExcerpt = React.memo(({ post }) => {
  return (
    <article className="post-excerpt" key={post.id}>
      <h3>{post.title}</h3>
      <div>
        <PostAuthor userId={post.user} />
        <TimeAgo timestamp={post.date} />
      </div>
      <p className="post-content">{post.content.substring(0, 100)}</p>

      <ReactionButtons post={post} />
      <Link to={`/posts/${post.id}`} className="button muted-button">
        View Post
      </Link>
    </article>
  )
})
