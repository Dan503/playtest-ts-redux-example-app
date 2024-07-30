import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'
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

export interface NotificationMetadata {
  id: string
  isRead: boolean
  isNew: boolean
}

export const fetchNotifications = createAppAsyncThunk('notifications/fetchNotifications', async (_unused, thunkApi) => {
  const response = await client.get<Array<ServerNotification>>(`/fakeApi/notifications`)
  return response.data
})

const metadataAdapter = createEntityAdapter<NotificationMetadata>()

const initialState = metadataAdapter.getInitialState()

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    allNotificationsRead(state) {
      Object.values(state.entities).forEach((metadata) => {
        metadata.isRead = true
      })
    },
  },
  extraReducers(builder) {
    builder.addMatcher(notificationsApiSlice.endpoints.getNotifications.matchFulfilled, (state, action) => {
      const notificationsWithMetadata: Array<NotificationMetadata> = action.payload.map((notification) => ({
        id: notification.id,
        isNew: true,
        isRead: false,
      }))

      Object.values(state.entities).forEach((metadata) => {
        // Any notification we've read is no longer new
        metadata.isNew = !metadata.isRead
      })

      metadataAdapter.upsertMany(state, notificationsWithMetadata)
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

export const { selectAll: selectAllNotificationMetadata, selectEntities: selectMetadataEntities } =
  metadataAdapter.getSelectors((state: AppRootState) => state.notifications)

export function selectUnreadNotificationsCount(state: AppRootState) {
  const allNotifications = selectAllNotificationMetadata(state)
  const unreadNotifications = allNotifications.filter((notification) => !notification.isRead)
  return unreadNotifications.length
}
