import { createSlice } from '@reduxjs/toolkit'
import { client } from '../../api/client'
import { AppRootState } from '../../app/store'
import { createAppAsyncThunk } from '../../app/withTypes'
import { RootState } from '@reduxjs/toolkit/query'
import { apiSlice } from '../../app/apiSlice'

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

export const fetchNotifications = createAppAsyncThunk('notifications/fetchNotifications', async (_unused, thunkApi) => {
  const allNotifications = selectAllNotifications(thunkApi.getState())
  const [latestNotification] = allNotifications
  const latestTimestamp = latestNotification ? latestNotification.date : ''
  const response = await client.get<Array<ServerNotification>>(`/fakeApi/notifications?since=${latestTimestamp}`)
  return response.data
})

const initialState: Array<ClientNotification> = []

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    allNotificationsRead(state) {
      state.forEach((notification) => {
        notification.isRead = true
      })
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchNotifications.fulfilled, (state, action) => {
      const notificationsWithMetadata: Array<ClientNotification> = action.payload.map((notification) => ({
        ...notification,
        isNew: true,
        isRead: false,
      }))
      state.forEach((notification) => {
        // Any notification we've read is no longer new
        notification.isNew = !notification.isRead
      })

      state.push(...notificationsWithMetadata)
      // state.push(...action.payload)
      // Sort with newest first
      state.sort((a, b) => b.date.localeCompare(a.date))
    })
  },
})

export const notificationsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<Array<ServerNotification>, void>({
      query: () => '/notifications',
    }),
  }),
})

export const { useGetNotificationsQuery } = notificationsApiSlice

export const { allNotificationsRead } = notificationsSlice.actions

export const notificationsReducer = notificationsSlice.reducer

export const selectAllNotifications = (state: AppRootState) => state.notifications

export function selectUnreadNotificationsCount(state: AppRootState) {
  const allNotifications = selectAllNotifications(state)
  const unreadNotifications = allNotifications.filter((notification) => !notification.isRead)
  return unreadNotifications.length
}
