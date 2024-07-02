import { configureStore } from '@reduxjs/toolkit'
import { postReducer } from '../features/posts/postsSlice'
import { usersReducer } from '../features/users/usersSlice'
import { authReducer } from '../features/auth/authSlice'

export const store = configureStore({
  // Pass in the root reducer setup as the `reducer` argument
  reducer: {
    posts: postReducer,
    users: usersReducer,
    auth: authReducer,
  },
})

// Infer the type of `store`
export type AppStore = typeof store
// Infer the `AppDispatch` type from the store itself
export type AppDispatch = typeof store.dispatch
// Infer the `RootState` type from the store itself as well
export type RootState = ReturnType<typeof store.getState>
