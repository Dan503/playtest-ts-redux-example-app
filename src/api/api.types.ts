export interface LoadingState {
  status: LoadingStatusString
  error: string | null
}

// Multiple possible status enum values
export type LoadingStatusString = 'idle' | 'loading' | 'fail' | 'success'
