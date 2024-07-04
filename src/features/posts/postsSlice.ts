// https://deploy-preview-4706--redux-docs.netlify.app/tutorials/essentials/part-6-performance-normalization
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { LoadingState } from '../../api/api.types'
import { client } from '../../api/client'
import { AppRootState } from '../../app/store'
import { logout } from '../auth/authSlice'
import { createAppAsyncThunk } from '../../app/withTypes'

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
type PostAddNew = Pick<Post, 'title' | 'content' | 'user'>

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

const initialState: PostsState = {
  postList: [],
  error: null,
  status: 'idle',
}

const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
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
        // Add any fetched posts to the array
        state.postList.push(...action.payload)
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'fail'
        state.error = action.error.message ?? 'Unknown Error'
      })
      .addCase(addNewPost.fulfilled, (state, action) => {
        // We can directly add the new post object to our posts array
        state.postList.push(action.payload)
      })
  },
})

// Export the auto-generated action creator with the same name
export const { postUpdated, reactionAdded } = postSlice.actions

// Export the generated reducer function
export const postReducer = postSlice.reducer

// == SELECTORS ==
export const selectAllPosts = (state: AppRootState): Array<Post> => state.posts.postList
export const selectPostById = (state: AppRootState, postId: string | undefined): Post | undefined => {
  return state.posts.postList.find((post) => post.id === postId)
}
