import { PayloadAction, createSlice } from '@reduxjs/toolkit'

interface Auth {
  currentUserId: string | null
}

const initialState: Auth = {
  currentUserId: null,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    userLoggedIn(state, action: PayloadAction<string>) {
      state.currentUserId = action.payload
    },
    userLoggedOut(state) {
      state.currentUserId = null
    },
  },
})

export const { userLoggedIn, userLoggedOut } = authSlice.actions

export const authReducer = authSlice.reducer
