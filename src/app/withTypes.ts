import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, AppRootState } from './store'
import { createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit'

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<AppRootState>()

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: AppRootState
  dispatch: AppDispatch
}>()
