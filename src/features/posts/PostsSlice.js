/* eslint-disable sort-keys */
/* eslint-disable security/detect-object-injection */
/* eslint-disable no-plusplus */
import { client } from "../../api/client"

const {
  createSlice,
  createAsyncThunk,
  createSelector,
  createEntityAdapter,
} = require("@reduxjs/toolkit")

/**
 * @typedef {object} PostPayload a post as submitted in a payload
 * @property {string} content the user content
 * @property {string} title the title
 * @property {string} user the user ID number
 */

/**
 * @typedef {object} PostState a post
 * @property {number} id server generated id
 * @property {object} date server generated date val (object string?)
 */

const postsAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.date.localeCompare(a.date),
})

// The trick for entities, is per here: https://stackoverflow.com/questions/59063496/document-structure-of-a-value-for-arbitrary-keys-in-an-object-in-jsdoc

/**
 * @typedef {object} State
 * @property {object} error error optional
 * @property {{[key: string]: (PostPayload & PostState)}} entities the posts
 * @property {('idle'| 'loading'| 'succeeded' | 'failed' )} status status
 */
const initialState = postsAdapter.getInitialState({
  error: null,
  status: "idle",
})

export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  /**
   * Make GET request to API to get all posts
   *
   * @returns {Promise<{content: string, date: string, id: string,
   * reactions: object, title: string, user: string}[]>} returned post with id
   */
  async () => {
    const response = await client.get("/fakeApi/posts")
    return response.data
  }
)

export const addNewPost = createAsyncThunk(
  "posts/addNewPost",
  /**
   * Make POST request to API w. params and create record
   *
   * @param {PostPayload} initialPost post
   * @returns {Promise<{content: string, date: string,
   * id: string, reactions: object, title: string, user: string}>} returned data
   */
  async (initialPost) => {
    const response = await client.post("/fakeApi/posts", initialPost)
    // The response includes the complete post object, including unique ID
    return response.data
  }
)

const postsSlice = createSlice({
  initialState,
  name: "posts",
  reducers: {
    /**
     * @param {State} state redux state
     * @param {object} action redux action
     * @param {{ content: string, id: number, title: string}} action.payload redux action payload
     */
    postUpdated(state, action) {
      const { content, id, title } = action.payload
      const existingPost = state.entities[id]
      if (existingPost) {
        existingPost.title = title
        existingPost.content = content
      }
    },
    reactionAdded(state, action) {
      const { postId, reaction } = action.payload
      const existingPost = state.entities[postId]
      if (existingPost) {
        // eslint-disable-next-line security/detect-object-injection
        existingPost.reactions[reaction]++
      }
    },
  },
  extraReducers(builder) {
    // pending, fulfilled, rejected are the states of promises.
    builder
      .addCase(fetchPosts.pending, (state, action) => {
        state.status = "loading"
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded"
        // Add any fetched posts to the array
        // use the `upsertMany` reducer as a mutating update utility
        postsAdapter.upsertMany(state, action.payload)
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message
      })
    builder.addCase(addNewPost.fulfilled, postsAdapter.addOne)
  },
})

export const { postUpdated, reactionAdded } = postsSlice.actions

export default postsSlice.reducer

// export const selectPostById = (state, postId) =>
//   state.posts.posts.find((post) => post.id === postId)

export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds,
} = postsAdapter.getSelectors((state) => state.posts)

const userId = (state, userId) => userId

// createSelector is the Reselect library method for
// memoizing functions so they only rerun when their
// dependencies change. This is used by the userPage
// component.

export const selectPostsByUser = createSelector(
  [(state) => selectAllPosts(state), (state, userId) => userId],
  (posts, userId) => posts.filter((post) => post.user === userId)
)
