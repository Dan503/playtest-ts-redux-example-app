import { createEntityAdapter, EntityState } from '@reduxjs/toolkit'
import { apiSlice, emptyEntities, TagType } from '../../app/apiSlice'
import { Post, ReactionName } from './postsSlice'

export type PostUpdate = Pick<Post, 'id' | 'title' | 'content'>
export type PostAddNew = Pick<Post, 'title' | 'content' | 'user'>

const TAGS = {
  postList: { type: TagType.post, id: 'list' },
}

export const postsAdapter = createEntityAdapter<Post>({
  // Sort in descending date order
  sortComparer: (a, b) => b.date.localeCompare(a.date),
})

export const postsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // = POSTS =
    // The `getPosts` endpoint is a "query" operation that returns data.
    // The return value is a `Post[]` array, and it takes no arguments.
    getPosts: builder.query<EntityState<Post, string>, void>({
      // The URL for the request is '/fakeApi/posts'
      query: () => '/posts',
      transformResponse(res: Array<Post>) {
        return postsAdapter.setAll(emptyEntities, res)
      },
      providesTags: (result = emptyEntities, _error, _arg) => [
        TAGS.postList,
        ...result.ids.map((id) => ({ type: TagType.post, id }) as const),
      ],
    }),
    getPostById: builder.query<Post, string | undefined>({
      query: (postId) => `/posts/${postId}`,
      providesTags: (_result, _error, arg) => [{ type: TagType.post, id: arg }],
    }),
    addNewPost: builder.mutation<Post, PostAddNew>({
      query: (newPostData) => ({
        url: '/posts',
        method: 'POST',
        // Include the entire post object as the body of the request
        body: newPostData,
      }),
      invalidatesTags: [TAGS.postList],
    }),
    editPost: builder.mutation<Post, PostUpdate>({
      query: (post) => ({
        url: `posts/${post.id}`,
        method: 'PATCH',
        body: post,
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: TagType.post, id: arg.id }],
    }),
    addReaction: builder.mutation<Post, { postId: string; reaction: ReactionName }>({
      query: ({ postId, reaction }) => ({
        url: `posts/${postId}/reactions`,
        method: 'POST',
        // In a real app, we'd probably need to base this on user ID somehow
        // so that a user can't do the same reaction more than once
        body: { reaction },
      }),
      // `updateQueryData` requires the endpoint name and cache key arguments,
      // so it knows which piece of cache state to update
      async onQueryStarted({ postId, reaction }, { dispatch, queryFulfilled }) {
        const getMultiPostPatchResult = dispatch(
          postsApiSlice.util.updateQueryData('getPosts', undefined, (draft) => {
            // The `draft` is Immer-wrapped and can be "mutated" like in createSlice
            const post = draft.entities[postId]
            post.reactions[reaction]++
          }),
        )

        // We also have another copy of the same data in the `getPost` cache
        // entry for this post ID, so we need to update that as well
        const getSinglePostPatchResult = dispatch(
          postsApiSlice.util.updateQueryData('getPostById', postId, (draft) => {
            draft.reactions[reaction]++
          }),
        )

        try {
          await queryFulfilled
        } catch {
          getSinglePostPatchResult.undo()
          getMultiPostPatchResult.undo()
        }
      },
    }),
  }),
})

// Export the auto-generated hook for the `getPosts` query endpoint
export const {
  useGetPostsQuery,
  useGetPostByIdQuery,
  useAddNewPostMutation,
  useEditPostMutation,
  useAddReactionMutation,
} = postsApiSlice
