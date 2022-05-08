import React, { useState } from "react"

import {
  useAppDispatch,
  useAppSelector,
} from "../../app/hooks"
import { addNewPost } from "./PostsSlice"

export const AddPostForm = () => {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [userId, setUserId] = useState("")
  const [addRequestStatus, setAddRequestStatus] = useState("idle")

  const canSave =
    [title, content, userId].every(Boolean) && addRequestStatus === "idle"
  const dispatch = useAppDispatch()

  const users = useAppSelector((state) => state.users)

  const onTitleChanged = (e) => setTitle(e.target.value)
  const onContentChanged = (e) => setContent(e.target.value)
  const onAuthorChanged = (e) => setUserId(e.target.value)

  const onSavePostClicked = async () => {
    if (canSave) {
      try {
        setAddRequestStatus("pending")
        // About unwrap. Redux toolkit adds a .unwrap function to the returned Promise,
        // which will return a new Promise that either has
        // the actual action.payload
        await dispatch(addNewPost({ content, title, user: userId })).unwrap() //https://redux.js.org/tutorials/essentials/part-5-async-logic
        setTitle("")
        setContent("")
        setUserId("")
      } catch (err) {
        console.error("Failed to save the post: ", err)
      } finally {
        setAddRequestStatus("idle")
      }
    }
  }

  const usersOptions = users.map((user) => (
    <option key={user.id} value={user.id}>
      {user.name}
    </option>
  ))

  return (
    <section>
      <h2>Add a New Post</h2>
      <form>
        <label htmlFor="postTitle">Post Title:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          value={title}
          onChange={onTitleChanged}
        />
        <label htmlFor="postAuthor">Author:</label>
        <select id="postAuthor" value={userId} onChange={onAuthorChanged}>
          <option value=""></option>
          {usersOptions}
        </select>
        <label htmlFor="postContent">Content:</label>
        <textarea
          id="postContent"
          name="postContent"
          value={content}
          onChange={onContentChanged}
        />
        <button type="button" onClick={onSavePostClicked} disabled={!canSave}>
          Save Post
        </button>
      </form>
    </section>
  )
}
