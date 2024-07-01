import { PayloadAction, createSlice, nanoid } from '@reduxjs/toolkit'

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
  reducers: {
    // Declare a "case reducer" named `postAdded`.
    // The type of `action.payload` will be a `Post` object.
    postAdded: {
      reducer(state, action: PayloadAction<Post>) {
        // "Mutate" the existing state array, which is
        // safe to do here because `createSlice` uses Immer inside.
        state.push(action.payload)
      },
      prepare: (title: string, content: string) => ({
        payload: {
          id: nanoid(),
          title,
          content,
        } satisfies Post,
      }),
    },
    postUpdated(state, action: PayloadAction<Post>) {
      const { id, title, content } = action.payload
      const postToUpdate = state.find((item) => item.id === id)
      if (postToUpdate) {
        postToUpdate.title = title
        postToUpdate.content = content
      }
    },
  },
})

// Export the auto-generated action creator with the same name
export const { postAdded, postUpdated } = postSlice.actions

// Export the generated reducer function
export const postReducer = postSlice.reducer
