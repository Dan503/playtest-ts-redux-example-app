import { addListener, createListenerMiddleware } from '@reduxjs/toolkit'
import { AppDispatch, AppRootState } from './store'

export const listenerMiddleware = createListenerMiddleware()

export const startAppListening = listenerMiddleware.startListening.withTypes<AppRootState, AppDispatch>()

export type AppStartListening = typeof startAppListening

export const addAppListener = addListener.withTypes<AppRootState, AppDispatch>()
export type AppAddListener = typeof addAppListener
