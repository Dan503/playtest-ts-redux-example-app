import { PayloadAction, createAsyncThunk, createSlice, nanoid } from '@reduxjs/toolkit'
import { Duration, sub } from 'date-fns'
import { LoadingState } from '../../api/api.types'
import { client } from '../../api/client'
import { AppRootState } from '../../app/store'
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

interface PostsState extends LoadingState {
  postList: Array<Post>
}

export interface Post {
  id: string
  title: string
  content: string
  user?: string
  date: string
  reactions: Reactions
}

type PostUpdate = Pick<Post, 'id' | 'title' | 'content'>

export const fetchPosts = createAsyncThunk<Array<Post>, void, { state: AppRootState }>(
  'posts/fetchPosts',
  async () => {
    const response = await client.get<Array<Post>>('/fakeApi/posts')
    return response.data
  },
  {
    condition(_arg, thunkApi) {
      const { posts } = thunkApi.getState()
      if (posts.status === 'idle') {
        return true
      }
      return false
    },
  },
)

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

const initialState: PostsState = {
  postList: [],
  error: null,
  status: 'idle',
}

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
        state.postList.push(action.payload)
      },
      prepare: (title: string, content: string, authorUserId: string) => ({
        payload: {
          id: nanoid(),
          title,
          content,
          user: authorUserId,
          date: generateIsoDate(),
          reactions: initialReactions,
        } satisfies Post,
      }),
    },
    postUpdated(state, action: PayloadAction<PostUpdate>) {
      const { title, content, id } = action.payload
      const postToUpdate = state.postList.find((item) => item.id === id)
      if (postToUpdate) {
        postToUpdate.title = title
        postToUpdate.content = content
      }
    },
    reactionAdded(state, action: PayloadAction<{ postId: string; reaction: ReactionName }>) {
      const { postId, reaction } = action.payload
      const existingPost = state.postList.find((post) => post.id === postId)
      if (existingPost) {
        existingPost.reactions[reaction]++
      }
    },
  },
  extraReducers(builder) {
    // Pass the userLoggedOut action creator to `builder.addCase()`
    builder
      .addCase(userLoggedOut, (_state) => {
        // Clear out the list of posts whenever the user logs out
        return initialState
      })
      .addCase(fetchPosts.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'success'
        // Add any fetched posts to the array
        state.postList.push(...action.payload)
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'fail'
        state.error = action.error.message ?? 'Unknown Error'
      })
  },
})

// Export the auto-generated action creator with the same name
export const { postAdded, postUpdated, reactionAdded } = postSlice.actions

// Export the generated reducer function
export const postReducer = postSlice.reducer

// == SELECTORS ==
export const selectAllPosts = (state: AppRootState): Array<Post> => state.posts.postList
export const selectPostById = (state: AppRootState, postId: string | undefined): Post | undefined => {
  return state.posts.postList.find((post) => post.id === postId)
}
