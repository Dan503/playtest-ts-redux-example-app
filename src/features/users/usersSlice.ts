import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import { EntityStateWithLoading } from '../../api/api.types'
import { client } from '../../api/client'
import { AppRootState, initialLoadingState } from '../../app/store'
import { createAppAsyncThunk } from '../../app/withTypes'
import { selectCurrentUserId } from '../auth/authSlice'

export interface User {
  id: string
  name: string
}

export const UNKNOWN_USER: User = {
  name: 'Unknown User',
  id: '',
}

type UsersState = EntityStateWithLoading<User>

const usersEntityAdapter = createEntityAdapter<User>()

const initialState: UsersState = usersEntityAdapter.getInitialState(initialLoadingState)

export const fetchUsers = createAppAsyncThunk('users/fetchUsers', async () => {
  const response = await client.get<Array<User>>('fakeApi/users')
  return response.data
})

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
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
        usersEntityAdapter.setAll(state, action.payload)
      })
  },
})

export const usersReducer = usersSlice.reducer

// == SELECTORS ==
export const { selectAll: selectAllUsers, selectById: selectUserById } = usersEntityAdapter.getSelectors<AppRootState>(
  (state) => state.users,
)
// This selector requires the use of the root state, so it cannot be written as a slice selector like the others
export const selectCurrentUser = (state: AppRootState) => {
  const currentUserId = selectCurrentUserId(state)
  return currentUserId ? state.users.entities[currentUserId] : UNKNOWN_USER
}
