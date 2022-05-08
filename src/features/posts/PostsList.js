import React, { useEffect } from "react"

import {
  useAppDispatch,
  useAppSelector,
} from "../../app/hooks"
import { Spinner } from "../../components/Spinner"
import { PostExcerpt } from "./PostExcerpt"
import {
  fetchPosts,
  selectAllPosts,
} from "./PostsSlice"

export const PostsList = () => {
  const dispatch = useAppDispatch()

  const postStatus = useAppSelector((state) => state.posts.status)
  const posts = useAppSelector(selectAllPosts)
  const error = useAppSelector((state) => state.posts.error)

  useEffect(() => {
    if (postStatus === "idle") {
      dispatch(fetchPosts())
    }
  }, [postStatus, dispatch])

  let content
  if (postStatus === "loading") {
    content = <Spinner text="loading..." />
  } else if (postStatus === "succeeded") {
    const orderedPosts = posts
      .slice()
      .sort((a, b) => b.date.localeCompare(a.date))

    content = orderedPosts.map((post) => (
      <PostExcerpt key={post.id} post={post} />
    ))
  } else if (postStatus === "failed") {
    content = <div>{error}</div>
  }

  return (
    <section className="posts-list">
      <h2>Posts</h2>
      {content}
    </section>
  )
}
