import { createSlice } from '@reduxjs/toolkit'
import { AppRootState } from '../../app/store'
import { selectCurrentUserId } from '../auth/authSlice'
import { client } from '../../api/client'
import { LoadingState } from '../../api/api.types'
import { createAppAsyncThunk } from '../../app/withTypes'

export interface User {
  id: string
  name: string
}

interface UsersState extends LoadingState {
  userList: Array<User>
}

const initialState: UsersState = {
  error: null,
  status: 'idle',
  userList: [],
}

export const fetchUsers = createAppAsyncThunk('users/fetchUsers', async () => {
  const response = await client.get<Array<User>>('fakeApi/users')
  return response.data
})

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  // Alternate method for writing selector functions
  // WARNING! These only have access to the slice state, not the full root state!
  selectors: {
    selectAllUsers: (state) => state.userList,
    selectUserById: (state, userId: string | undefined) => state.userList.find((u) => u.id === userId),
  },
  extraReducers(builder) {
    builder
      .addCase(fetchUsers.pending, (state, _action) => {
        state.status = 'loading'
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'fail'
        state.error = action.error.message ?? 'Unknown Error'
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'success'
        state.userList = action.payload
      })
  },
})

export const usersReducer = usersSlice.reducer

// == SELECTORS ==
export const { selectAllUsers, selectUserById } = usersSlice.selectors
// This selector requires the use of the root state, so it cannot be written as a slice selector like the others
export const selectCurrentUser = (state: AppRootState) =>
  state.users.userList.find((u) => u.id === selectCurrentUserId(state))
