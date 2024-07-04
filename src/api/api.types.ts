import { EntityState } from '@reduxjs/toolkit'

export interface LoadingState {
  status: LoadingStatusString
  error: string | null
}

// Multiple possible status enum values
export type LoadingStatusString = 'idle' | 'loading' | 'fail' | 'success'

export type EntityStateWithLoading<T, Key extends string = string> = LoadingState & EntityState<T, Key>
