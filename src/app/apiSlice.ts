import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { PostAddNew, Post, PostUpdate } from '../features/posts/postsSlice'
import { User } from '../features/users/usersSlice'

enum TagType {
  post = 'post',
}
enum TagId {
  list = 'list',
}

const TAGS = {
  postList: { type: TagType.post, id: TagId.list },
}

// Define our single API slice object
export const apiSlice = createApi({
  // The cache reducer expects to be added at `state.api` (already default - this is optional)
  reducerPath: 'api',
  // All of our requests will have URLs starting with '/fakeApi'
  baseQuery: fetchBaseQuery({ baseUrl: '/fakeApi' }),
  // Used for invalidating cached data triggering an immediate auto-refetch of data
  tagTypes: [TagType.post],
  // The "endpoints" represent operations and requests for this server
  endpoints: (builder) => ({
    // = POSTS =
    // The `getPosts` endpoint is a "query" operation that returns data.
    // The return value is a `Post[]` array, and it takes no arguments.
    getPosts: builder.query<Array<Post>, void>({
      // The URL for the request is '/fakeApi/posts'
      query: () => '/posts',
      providesTags: (result = [], _error, _arg) => [
        TAGS.postList,
        ...result.map(({ id }) => ({ type: TagType.post, id }) as const),
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
export const { useGetPostsQuery, useGetPostByIdQuery, useAddNewPostMutation, useEditPostMutation } = apiSlice
