import { configureStore } from "@reduxjs/toolkit"

import notificationsReducer from "../features/notifications/notificationsSlice"
import postsReducer from "../features/posts/PostsSlice"
import usersReducer from "../features/users/usersSlice"

const store = configureStore({
  reducer: {
    notifications: notificationsReducer,
    posts: postsReducer,
    users: usersReducer,
  },
})

export default store
