import { createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit'
import { forceGenerateNotifications } from '../../api/server'
import { apiSlice } from '../../app/apiSlice'
import { AppRootState, AppThunk } from '../../app/store'

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

export function fetchNotificationsWebSocket(): AppThunk {
  return (_dispatch, getState) => {
    const allNotifications = selectNotificationsData(getState())
    const [latestNotification] = allNotifications
    const latestTimestamp = latestNotification?.date ?? ''
    forceGenerateNotifications(latestTimestamp)
  }
}

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

export const selectNotificationsResult = notificationsApiSlice.endpoints.getNotifications.select()

const selectNotificationsData = createSelector(
  selectNotificationsResult,
  (notificationsResult) => notificationsResult.data ?? [],
)
