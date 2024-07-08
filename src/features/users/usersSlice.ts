import { createEntityAdapter, createSelector, createSlice, EntityState } from '@reduxjs/toolkit'
import { client } from '../../api/client'
import { apiSlice } from '../../app/apiSlice'
import { AppRootState } from '../../app/store'
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

const usersEntityAdapter = createEntityAdapter<User>()

const initialState = usersEntityAdapter.getInitialState()

export const fetchUsers = createAppAsyncThunk('users/fetchUsers', async () => {
  const response = await client.get<Array<User>>('fakeApi/users')
  return response.data
})

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<EntityState<User, string>, void>({
      query: () => '/users',
      transformResponse(res: Array<User>) {
        return usersEntityAdapter.setAll(initialState, res)
      },
    }),
  }),
})

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
})

export const usersReducer = usersSlice.reducer

// = SELECTORS = //

const selectUsersResult = usersApiSlice.endpoints.getUsers.select()
const selectUsersData = createSelector(selectUsersResult, (result) => result.data ?? initialState)

export const { selectAll: selectAllUsers, selectById: selectUserById } = usersEntityAdapter.getSelectors<AppRootState>(
  (state) => selectUsersData(state),
)
// This selector requires the use of the root state, so it cannot be written as a slice selector like the others
export const selectCurrentUser = (state: AppRootState) => {
  const currentUserId = selectCurrentUserId(state)
  return currentUserId ? state.users.entities[currentUserId] : UNKNOWN_USER
}
