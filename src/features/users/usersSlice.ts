import { createSlice } from '@reduxjs/toolkit'
import { AppRootState } from '../../app/store'
import { selectCurrentUserId } from '../auth/authSlice'

export interface User {
  id: string
  name: string
}

const initialState: Array<User> = [
  { id: '0', name: 'Tianna Jenkins' },
  { id: '1', name: 'Kevin Grant' },
  { id: '2', name: 'Madison Price' },
]

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  // Alternate method for writing selector functions
  // WARNING! These only have access to the slice state, not the full root state!
  selectors: {
    selectAllUsers: (state) => state,
    selectUserById: (state, userId: string | undefined) => state.find((u) => u.id === userId),
  },
})

export const usersReducer = usersSlice.reducer

// == SELECTORS ==
export const { selectAllUsers, selectUserById } = usersSlice.selectors
// This selector requires the use of the root state, so it cannot be written as a slice selector like the others
export const selectCurrentUser = (state: AppRootState) => state.users.find((u) => u.id === selectCurrentUserId(state))
