/* eslint-disable sort-keys */
import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit"

import { client } from "../../api/client"

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (_, { dispatch, getState }) => {
    // a thunkAPI object
    const allNotifications = selectAllNotifications(getState())
    const [latestNotification] = allNotifications
    const latestTimestamp = latestNotification ? latestNotification.date : ""
    const response = await client.get(
      `/fakeApi/notifications?since=${latestTimestamp}`
    )
    return response.data
  }
)

const notificationsSlice = createSlice({
  name: "notifications",
  initialState: [],
  reducers: {
    allNotificationsRead(state, action) {
      state.forEach((notification) => {
        // eslint-disable-next-line no-param-reassign
        notification.read = true
      })
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchNotifications.fulfilled, (state, action) => {
      state.push(...action.payload)
      state.forEach((notification) => {
        // eslint-disable-next-line no-param-reassign
        notification.isNew = !notification.read
      })
      state.sort((a, b) => b.date.localeCompare(a.date))
    })
  },
})

export const { allNotificationsRead } = notificationsSlice.actions

export default notificationsSlice.reducer

export const selectAllNotifications = (state) => state.notifications
