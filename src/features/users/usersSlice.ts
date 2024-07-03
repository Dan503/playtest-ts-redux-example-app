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
})

export const usersReducer = usersSlice.reducer

// == SELECTORS ==
export const selectAllUsers = (state: AppRootState) => state.users
export const selectUserById = (state: AppRootState, userId: string | undefined) => {
  return state.users.find((u) => u.id === userId)
}
export const selectCurrentUser = (state: AppRootState) => state.users.find((u) => u.id === selectCurrentUserId(state))
