import { createSlice } from '@reduxjs/toolkit'
import { AppRootState } from '../../app/store'
import { client } from '../../api/client'
import { createAppAsyncThunk } from '../../app/withTypes'

interface Auth {
  currentUserId: string | null
}

const initialState: Auth = {
  currentUserId: null,
}

export const login = createAppAsyncThunk('auth/login', async (userName: string) => {
  await client.post('/fakeApi/login', { userName })
  return userName
})

export const logout = createAppAsyncThunk('auth/logout', async () => {
  await client.post('/fakeApi/logout', {})
})

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.currentUserId = action.payload
      })
      .addCase(logout.fulfilled, (state) => {
        state.currentUserId = null
      })
  },
})

export const authReducer = authSlice.reducer

// == SELECTORS ==
export const selectCurrentUserId = (state: AppRootState) => state.auth.currentUserId
