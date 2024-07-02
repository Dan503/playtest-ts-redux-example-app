import { PayloadAction, createSlice, nanoid } from '@reduxjs/toolkit'
import { Duration, sub } from 'date-fns'
import { userLoggedOut } from '../auth/authSlice'

// Define a TS type for the data we'll be using
export interface Reactions {
  thumbsUp: number
  tada: number
  heart: number
  rocket: number
  eyes: number
}

export type ReactionName = keyof Reactions

export interface Post {
  id: string
  title: string
  content: string
  authorUserId?: string
  isoDate: string
  reactions: Reactions
}

function generateIsoDate(howLongAgo?: Duration) {
  return sub(new Date(), howLongAgo || {}).toISOString()
}

const initialReactions: Reactions = {
  thumbsUp: 0,
  tada: 0,
  heart: 0,
  rocket: 0,
  eyes: 0,
}

const initialState: Array<Post> = [
  {
    id: '1',
    title: 'First Post!',
    content: 'Hello!',
    isoDate: generateIsoDate({ minutes: 10 }),
    reactions: initialReactions,
  },
  {
    id: '2',
    title: 'Second Post',
    content: 'More text',
    isoDate: generateIsoDate({ minutes: 5 }),
    reactions: initialReactions,
  },
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
      prepare: (title: string, content: string, authorUserId: string) => ({
        payload: {
          id: nanoid(),
          title,
          content,
          authorUserId,
          isoDate: generateIsoDate(),
          reactions: initialReactions,
        } satisfies Post,
      }),
    },
    postUpdated(state, action: PayloadAction<Post>) {
      const { id, title, content, authorUserId } = action.payload
      const postToUpdate = state.find((item) => item.id === id)
      if (postToUpdate) {
        postToUpdate.title = title
        postToUpdate.content = content
        postToUpdate.authorUserId = authorUserId
      }
    },
    reactionAdded(state, action: PayloadAction<{ postId: string; reaction: ReactionName }>) {
      const { postId, reaction } = action.payload
      const existingPost = state.find((post) => post.id === postId)
      if (existingPost) {
        existingPost.reactions[reaction]++
      }
    },
  },
  extraReducers(builder) {
    // Pass the userLoggedOut action creator to `builder.addCase()`
    builder.addCase(userLoggedOut, (_state) => {
      // Clear out the list of posts whenever the user logs out
      return initialState
    })
  },
})

// Export the auto-generated action creator with the same name
export const { postAdded, postUpdated, reactionAdded } = postSlice.actions

// Export the generated reducer function
export const postReducer = postSlice.reducer
