import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { PostAddNew, Post } from '../features/posts/postsSlice'

// Define our single API slice object
export const apiSlice = createApi({
  // The cache reducer expects to be added at `state.api` (already default - this is optional)
  reducerPath: 'api',
  // All of our requests will have URLs starting with '/fakeApi'
  baseQuery: fetchBaseQuery({ baseUrl: '/fakeApi' }),
  // The "endpoints" represent operations and requests for this server
  endpoints: (builder) => ({
    // The `getPosts` endpoint is a "query" operation that returns data.
    // The return value is a `Post[]` array, and it takes no arguments.
    getPosts: builder.query<Array<Post>, void>({
      // The URL for the request is '/fakeApi/posts'
      query: () => '/posts',
    }),
    getPostById: builder.query<Post, string>({
      query: (postId) => `/posts/${postId}`,
    }),
    addNewPost: builder.mutation<Post, PostAddNew>({
      query: (newPostData) => ({
        url: '/posts',
        method: 'POST',
        // Include the entire post object as the body of the request
        body: newPostData,
      }),
    }),
  }),
})

// Export the auto-generated hook for the `getPosts` query endpoint
export const { useGetPostsQuery, useGetPostByIdQuery, useAddNewPostMutation } = apiSlice
