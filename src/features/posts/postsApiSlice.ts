import { createEntityAdapter, EntityState } from '@reduxjs/toolkit'
import { apiSlice, emptyEntities, TagType } from '../../app/apiSlice'
import { Post } from './postsSlice'

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
  }),
})

// Export the auto-generated hook for the `getPosts` query endpoint
export const { useGetPostsQuery, useGetPostByIdQuery, useAddNewPostMutation, useEditPostMutation } = postsApiSlice
