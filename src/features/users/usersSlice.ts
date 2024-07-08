import { createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit'
import { EntityStateWithLoading } from '../../api/api.types'
import { client } from '../../api/client'
import { AppRootState } from '../../app/store'
import { createAppAsyncThunk, initialLoadingState } from '../../app/withTypes'
import { selectCurrentUserId } from '../auth/authSlice'
import { apiSlice } from '../../app/apiSlice'

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

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<Array<User>, void>({
      query: () => '/users',
    }),
  }),
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

const emptyUsers: Array<User> = []

// == SELECTORS ==

// Calling `someEndpoint.select(someArg)` generates a new selector that will return
// the query result object for a query with those parameters.
// To generate a selector for a specific query argument, call `select(theQueryArg)`.
// In this case, the users query has no params, so we don't pass anything to select()
export const selectUsersResult = apiSlice.endpoints.getUsers.select()

export const selectAllUsers = createSelector(selectUsersResult, (usersResult) => usersResult?.data ?? emptyUsers)
export const selectUserById = createSelector(
  selectAllUsers,
  (_state: AppRootState, userId: string | undefined) => userId,
  (users, userId) => users.find((user) => user.id === userId),
)

export const selectCurrentUser = (state: AppRootState) => {
  const currentUsername = selectCurrentUserId(state)
  if (currentUsername) {
    return selectUserById(state, currentUsername)
  }
}

// = OLD SELECTORS =

// export const { selectAll: selectAllUsers, selectById: selectUserById } = usersEntityAdapter.getSelectors<AppRootState>(
//   (state) => state.users,
// )
// // This selector requires the use of the root state, so it cannot be written as a slice selector like the others
// export const selectCurrentUser = (state: AppRootState) => {
//   const currentUserId = selectCurrentUserId(state)
//   return currentUserId ? state.users.entities[currentUserId] : UNKNOWN_USER
// }
