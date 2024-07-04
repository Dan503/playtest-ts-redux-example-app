import { createSlice } from '@reduxjs/toolkit'
import { AppRootState } from '../../app/store'
import { client } from '../../api/client'
import { createAppAsyncThunk } from '../../app/withTypes'

export interface ServerNotification {
  id: string
  date: string
  message: string
  user: string
}
export interface ClientNotification extends ServerNotification {
  isRead: boolean
  isNew: boolean
}

export const selectAllNotifications = (state: AppRootState) => state.notifications

export const fetchNotifications = createAppAsyncThunk('notifications/fetchNotifications', async (_unused, thunkApi) => {
  const allNotifications = selectAllNotifications(thunkApi.getState())
  const [latestNotification] = allNotifications
  const latestTimeStamp = latestNotification?.date || ''
  const response = await client.get<Array<ServerNotification>>(`/fakeApi/notifications?since=${latestTimeStamp}`)
  return response.data
})

const initialState: Array<ClientNotification> = []

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    allNotificationsRead(state) {
      state.forEach((n) => (n.isRead = true))
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchNotifications.fulfilled, (state, action) => {
      const notificationsWithMetadata: Array<ClientNotification> = action.payload.map((n) => ({
        ...n,
        isRead: false,
        isNew: true,
      }))
      state.forEach((n) => {
        // Any notifications we have read are not new anymore
        n.isNew = !n.isRead
      })
      state.push(...notificationsWithMetadata)
      state.sort((a, b) => b.date.localeCompare(a.date))
    })
  },
})

export const notificationReducer = notificationSlice.reducer
