import { createSlice } from '@reduxjs/toolkit'
import { AppRootState } from '../../app/store'
import { selectCurrentUserId } from '../auth/authSlice'
import { client } from '../../api/client'
import { LoadingState } from '../../api/api.types'

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

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: (create) => ({
    // An example of a slice based thunk
    fetchUsers: create.asyncThunk(
      // Payload creator function to fetch the data
      async () => {
        const response = await client.get<Array<User>>('/fakeApi/users')
        return response.data
      },
      {
        // Options for `createAsyncThunk`
        options: {
          condition(arg, thunkApi): boolean {
            const { users } = thunkApi.getState() as AppRootState
            return users.status === 'idle'
          },
        },
        pending(state) {
          state.status = 'loading'
        },
        rejected(state, action) {
          state.status = 'fail'
          state.error = action.error.message ?? 'Unknown Error'
        },
        fulfilled(state, action) {
          state.status = 'success'
          state.userList = action.payload
        },
      },
    ),
  }),
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
