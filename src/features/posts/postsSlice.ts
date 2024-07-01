import { createSlice } from '@reduxjs/toolkit'

// Define a TS type for the data we'll be using
export interface Post {
  id: string
  title: string
  content: string
}

const initialState: Array<Post> = [
  { id: '1', title: 'First Post!', content: 'Hello!' },
  { id: '2', title: 'Second Post', content: 'More text' },
]

const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
})

// Export the generated reducer function
export const postReducer = postSlice.reducer
