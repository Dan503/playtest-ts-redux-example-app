import { createSlice } from '@reduxjs/toolkit'
import { client } from '../../api/client'
import { AppRootState } from '../../app/store'
import { createAppAsyncThunk } from '../../app/withTypes'

export interface ServerNotification {
  id: string
  date: string
  message: string
  user: string
}

export const fetchNotifications = createAppAsyncThunk('notifications/fetchNotifications', async (_unused, thunkApi) => {
  const allNotifications = selectAllNotifications(thunkApi.getState())
  const [latestNotification] = allNotifications
  const latestTimestamp = latestNotification ? latestNotification.date : ''
  const response = await client.get<Array<ServerNotification>>(`/fakeApi/notifications?since=${latestTimestamp}`)
  return response.data
})

const initialState: Array<ServerNotification> = []

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchNotifications.fulfilled, (state, action) => {
      state.push(...action.payload)
      // Sort with newest first
      state.sort((a, b) => b.date.localeCompare(a.date))
    })
  },
})

export const notificationsReducer = notificationsSlice.reducer

export const selectAllNotifications = (state: AppRootState) => state.notifications
