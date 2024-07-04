import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { AppRootState } from '../../app/store'
import { client } from '../../api/client'

export interface Notification {
  id: string
  date: string
  message: string
  user: string
}

export const selectAllNotifications = (state: AppRootState) => state.notifications

export const fetchNotifications = createAsyncThunk<Array<Notification>, void, { state: AppRootState }>(
  'notifications/fetchNotifications',
  async (_unused, thunkApi) => {
    const allNotifications = selectAllNotifications(thunkApi.getState())
    const [latestNotification] = allNotifications
    const latestTimeStamp = latestNotification?.date || ''
    const response = await client.get<Array<Notification>>(`/fakeApi/notifications?since=${latestTimeStamp}`)
    return response.data
  },
)

const initialState: Array<Notification> = []

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchNotifications.fulfilled, (state, action) => {
      state.push(...action.payload)
      state.sort((a, b) => b.date.localeCompare(a.date))
    })
  },
})

export const notificationReducer = notificationSlice.reducer
