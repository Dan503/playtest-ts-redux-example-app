import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, AppRootState } from './store'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { LoadingState } from '../api/api.types'

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<AppRootState>()

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: AppRootState
  dispatch: AppDispatch
}>()

export const initialLoadingState: LoadingState = {
  error: null,
  status: 'idle',
}
