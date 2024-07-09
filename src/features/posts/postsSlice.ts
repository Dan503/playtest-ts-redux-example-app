import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { startAppListening } from '../../app/listenerMiddleware'
import { AppRootState } from '../../app/store'
import { postsAdapter, postsApiSlice, PostUpdate } from './postsApiSlice'

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
  user?: string | null
  date: string
  reactions: Reactions
}

const initialState = postsAdapter.getInitialState()

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
})

export function addPostListeners() {
  startAppListening({
    matcher: postsApiSlice.endpoints.addNewPost.matchFulfilled,
    effect: async (_action, listenerApi) => {
      const { toast } = await import('react-tiny-toast')

      const toastId = toast.show('New post added!', {
        variant: 'success',
        position: 'bottom-right',
        pause: true,
      })

      await listenerApi.delay(5000)
      toast.remove(toastId)
    },
  })
}

// Export the auto-generated action creator with the same name
export const { postUpdated, reactionAdded } = postSlice.actions

// Export the generated reducer function
export const postReducer = postSlice.reducer

// = SELECTORS = //

const selectPostsResult = postsApiSlice.endpoints.getPosts.select()
const selectPostsData = createSelector(selectPostsResult, (result) => result.data ?? initialState)

export const { selectAll: selectAllPosts, selectById: selectPostById } = postsAdapter.getSelectors<AppRootState>(
  (state) => selectPostsData(state),
)

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
