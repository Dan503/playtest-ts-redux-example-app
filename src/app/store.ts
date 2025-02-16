import { Action, ThunkAction, configureStore } from '@reduxjs/toolkit'
import { authReducer } from '../features/auth/authSlice'
import { postReducer } from '../features/posts/postsSlice'
import { usersReducer } from '../features/users/usersSlice'
import { listenerMiddleware } from './listenerMiddleware'
import { apiSlice } from './apiSlice'
import { notificationsReducer } from '../features/notifications/notificationsSlice'

export const store = configureStore({
  // Pass in the root reducer setup as the `reducer` argument
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    posts: postReducer,
    users: usersReducer,
    auth: authReducer,
    notifications: notificationsReducer,
  },
  middleware: (getDefaultMiddleWare) => {
    return getDefaultMiddleWare().prepend(listenerMiddleware.middleware).concat(apiSlice.middleware)
  },
})

// Infer the type of `store`
export type AppStore = typeof store
// Infer the `AppDispatch` type from the store itself
export type AppDispatch = typeof store.dispatch
// Infer the `AppRootState` type from the store itself
export type AppRootState = ReturnType<typeof store.getState>
// Export a reusable type for handwritten thunks
export type AppThunk = ThunkAction<void, AppRootState, unknown, Action>
