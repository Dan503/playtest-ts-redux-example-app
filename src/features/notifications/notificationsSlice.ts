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

// Replaces `ClientNotification` since we only need these fields
export interface NotificationMetaData {
  id: string
  isRead: boolean
  isNew: boolean
}

const notificationsReceived = createAction<Array<ServerNotification>>('notifications/notificationsReceived')

export const notificationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<Array<ServerNotification>, void>({
      query: () => `/notifications`,
      transformResponse: (res: { notifications: Array<ServerNotification> }) => res.notifications,
      async onCacheEntryAdded(_arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved, dispatch }) {
        // create a websocket connection when the cache subscription starts
        const webSocket = new WebSocket('ws://localhost')
        try {
          // wait for the initial query to resolve before proceeding
          await cacheDataLoaded

          // when data is received from the socket connection to the server,
          // update our query result with the received message
          function listener(event: MessageEvent<string>) {
            const action: PayloadAction<Array<ServerNotification>, 'notifications'> = JSON.parse(event.data)

            switch (action.type) {
              case 'notifications':
                updateCachedData((draft) => {
                  // Insert all received notifications from the websocket
                  // into the existing RTKQ cache array
                  draft.push(...action.payload)
                  draft.sort((a, b) => b.date.localeCompare(a.date))
                })

                dispatch(notificationsReceived(action.payload))
                break
              default:
                break
            }
          }
          webSocket.addEventListener('message', listener)
        } catch {
          // no-op in case `cacheEntryRemoved` resolves before `cacheDataLoaded`,
          // in which case `cacheDataLoaded` will throw
        }
        // cacheEntryRemoved will resolve when the cache subscription is no longer active
        await cacheEntryRemoved
        // perform cleanup steps once the `cacheEntryRemoved` promise resolves
        webSocket.close()
      },
    }),
  }),
})

export const { useGetNotificationsQuery } = notificationApiSlice

export const selectNotificationsResult = notificationApiSlice.endpoints.getNotifications.select()

export const selectNotificationsData = createSelector(selectNotificationsResult, (result) => result.data ?? [])

export const fetchNotificationsWebsocket = (): AppThunk => (_dispatch, getState) => {
  const allNotifications = selectNotificationsData(getState())
  const [latestNotification] = allNotifications
  const latestTimeStamp = latestNotification?.date ?? ''
  // Hardcode a call to the mock server to simulate a server push scenario over websockets
  forceGenerateNotifications(latestTimeStamp)
}

const notificationAdapter = createEntityAdapter<NotificationMetaData>()

const initialState = notificationAdapter.getInitialState()

const matchNotificationsReceived = isAnyOf(
  notificationsReceived,
  notificationApiSlice.endpoints.getNotifications.matchFulfilled,
)

const notificationSlice = createSlice({
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
      const notificationMetadata: Array<NotificationMetaData> = action.payload.map((n) => ({
        id: n.id,
        isRead: false,
        isNew: true,
      }))

      Object.values(state.entities).forEach((metaData) => {
        // Any notifications we've read are no longer new
        metaData.isNew = !metaData.isRead
      })

      notificationAdapter.upsertMany(state, notificationMetadata)
    })
  },
})

export const { selectAll: selectNotificationsMetadata, selectEntities: selectMetadataEntities } =
  notificationAdapter.getSelectors<AppRootState>((state) => state.notifications)

export const notificationReducer = notificationSlice.reducer

export const { allNotificationsRead } = notificationSlice.actions
