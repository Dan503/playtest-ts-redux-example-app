import {
  createAction,
  createEntityAdapter,
  createSelector,
  createSlice,
  isAnyOf,
  PayloadAction,
} from '@reduxjs/toolkit'
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

const notificationsReceived = createAction<Array<ServerNotification>>('notifications/notificationsReceived')

export const notificationsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<Array<ServerNotification>, void>({
      query: () => '/notifications',
      async onCacheEntryAdded(arg, lifecycleApi) {
        // create a websocket connection when the cache subscription starts
        const ws = new WebSocket('ws://localhost')
        try {
          // wait for the initial query to resolve before proceeding
          await lifecycleApi.cacheDataLoaded

          // when data is received from the socket connection to the server,
          // update our query result with the received message
          function listener(event: MessageEvent<string>) {
            const message: PayloadAction<Array<ServerNotification>> = JSON.parse(event.data)
            if (message.type === 'notifications') {
              lifecycleApi.updateCachedData((draft) => {
                // Insert all received notifications from the websocket
                // into the existing RTKQ cache array
                draft.push(...message.payload)
                draft.sort((a, b) => b.date.localeCompare(a.date))
              })
            }
          }

          ws.addEventListener('message', listener)
        } catch {
          // no-op in case `cacheEntryRemoved` resolves before `cacheDataLoaded`,
          // in which case `cacheDataLoaded` will throw
        }
        // cacheEntryRemoved will resolve when the cache subscription is no longer active
        await lifecycleApi.cacheEntryRemoved
        // perform cleanup steps once the `cacheEntryRemoved` promise resolves
        ws.close()
      },
    }),
  }),
})

const matchNotificationsReceived = isAnyOf(
  notificationsReceived,
  notificationsApiSlice.endpoints.getNotifications.matchFulfilled,
)

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
    builder.addMatcher(matchNotificationsReceived, (state, action) => {
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
