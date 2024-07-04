import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'
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

const notificationAdapter = createEntityAdapter<ClientNotification>({
  sortComparer: (a, b) => b.date.localeCompare(a.date),
})

const initialState = notificationAdapter.getInitialState()

export const {
  selectAll: selectAllNotifications,
  selectById: selectNotificationById,
  selectIds: selectNotificationIds,
} = notificationAdapter.getSelectors<AppRootState>((state) => state.notifications)

export const fetchNotifications = createAppAsyncThunk('notifications/fetchNotifications', async (_unused, thunkApi) => {
  const allNotifications = selectAllNotifications(thunkApi.getState())
  const [latestNotification] = allNotifications
  const latestTimeStamp = latestNotification?.date || ''
  const response = await client.get<Array<ServerNotification>>(`/fakeApi/notifications?since=${latestTimeStamp}`)
  return response.data
})

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    allNotificationsRead(state) {
      Object.values(state.entities).forEach((notification) => {
        notification.isRead = true
      })
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchNotifications.fulfilled, (state, action) => {
      const notificationsWithMetadata: Array<ClientNotification> = action.payload.map((n) => ({
        ...n,
        isRead: false,
        isNew: true,
      }))
      Object.values(state.entities).forEach((notification) => {
        // Any notifications we've read are no longer new
        notification.isNew = !notification.isRead
      })

      notificationAdapter.upsertMany(state, notificationsWithMetadata)
    })
  },
})

export const notificationReducer = notificationSlice.reducer

export const { allNotificationsRead } = notificationSlice.actions
