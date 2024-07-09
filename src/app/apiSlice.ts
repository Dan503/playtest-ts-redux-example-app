import { EntityState } from '@reduxjs/toolkit'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const emptyEntities: EntityState<any, string> = { entities: {}, ids: [] }

export enum TagType {
  post = 'post',
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
  endpoints: (_builder) => ({}),
})
