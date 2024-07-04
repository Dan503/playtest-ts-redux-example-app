// https://deploy-preview-4706--redux-docs.netlify.app/tutorials/essentials/part-6-performance-normalization
import { PayloadAction, createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit'
import { EntityStateWithLoading } from '../../api/api.types'
import { client } from '../../api/client'
import { AppRootState } from '../../app/store'
import { createAppAsyncThunk, initialLoadingState } from '../../app/withTypes'
import { logout } from '../auth/authSlice'

// Define a TS type for the data we'll be using
export interface Reactions {
  thumbsUp: number
  tada: number
  heart: number
  rocket: number
  eyes: number
}

export type ReactionName = keyof Reactions

type PostsState = EntityStateWithLoading<Post>

export interface Post {
  id: string
  title: string
  content: string
  user?: string
  date: string
  reactions: Reactions
}

type PostUpdate = Pick<Post, 'id' | 'title' | 'content'>
type PostAddNew = Pick<Post, 'title' | 'content' | 'user'>

const postsAdapter = createEntityAdapter<Post>({
  // Sort in descending date order
  sortComparer: (a, b) => b.date.localeCompare(a.date),
})

const initialState: PostsState = postsAdapter.getInitialState(initialLoadingState)

export const fetchPosts = createAppAsyncThunk(
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

export const addNewPost = createAppAsyncThunk<Post, PostAddNew>(
  'posts/addNewPost',
  // The payload creator receives the partial `{title, content, user}` object
  async (initialPost) => {
    // We send the initial data to the fake API server
    const response = await client.post<Post>('/fakeApi/posts', initialPost)
    // The response includes the complete post object, including unique ID
    return response.data
  },
)

const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    postUpdated(state, action: PayloadAction<PostUpdate>) {
      const { title, content, id } = action.payload
      const postToUpdate = state.entities[id]
      if (postToUpdate) {
        postToUpdate.title = title
        postToUpdate.content = content
      }
    },
    reactionAdded(state, action: PayloadAction<{ postId: string; reaction: ReactionName }>) {
      const { postId, reaction } = action.payload
      const existingPost = state.entities[postId]
      if (existingPost) {
        existingPost.reactions[reaction]++
      }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(logout.fulfilled, (_state) => {
        // Clear out the list of posts whenever the user logs out
        return initialState
      })
      .addCase(fetchPosts.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'success'
        postsAdapter.setAll(state, action.payload)
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'fail'
        state.error = action.error.message ?? 'Unknown Error'
      })
      .addCase(addNewPost.fulfilled, postsAdapter.addOne)
  },
})

// Export the auto-generated action creator with the same name
export const { postUpdated, reactionAdded } = postSlice.actions

// Export the generated reducer function
export const postReducer = postSlice.reducer

// == SELECTORS ==
export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectAllPostIds,
} = postsAdapter.getSelectors<AppRootState>((state) => state.posts)

export const selectPostByUserId = createSelector(
  // Pass in one or more "input selectors"
  [
    // Outputs to PARAM 1
    // we can pass in an existing selector function that
    // reads something from the root `state` and returns it
    selectAllPosts,
    // Outputs to PARAM 2
    // This function extracts another argument and returns that
    (_state: AppRootState, userId: string) => userId,
  ],
  // the output function gets those values as its arguments,
  // and will run when either input value changes
  (/* PARAM 1 */ posts, /* PARAM 2 */ userId) => posts.filter((post) => post.user === userId),
)
