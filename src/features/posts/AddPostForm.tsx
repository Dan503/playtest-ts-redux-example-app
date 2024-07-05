import { FormEvent, useState } from 'react'
import { LoadingStatusString } from '../../api/api.types'
import { useAppDispatch, useAppSelector } from '../../app/withTypes'
import { selectCurrentUserId } from '../auth/authSlice'
import { addNewPost } from './postsSlice'
import { useAddNewPostMutation } from '../../app/apiSlice'

interface AddPostFormFields extends HTMLFormControlsCollection {
  postTitle: HTMLInputElement
  postContent: HTMLTextAreaElement
  postAuthor: HTMLSelectElement
}
interface AddPostFormElements extends HTMLFormElement {
  readonly elements: AddPostFormFields
}

export function AddPostForm() {
  const userId = useAppSelector(selectCurrentUserId)
  const [addNewPost, { isLoading }] = useAddNewPostMutation()

  async function handleSubmit(e: FormEvent<AddPostFormElements>) {
    e.preventDefault()

    const { elements } = e.currentTarget
    const title = elements.postTitle.value
    const content = elements.postContent.value

    const form = e.currentTarget

    try {
      await addNewPost({ title, content, user: userId }).unwrap()

      form.reset()
    } catch (err) {
      console.error('Failed to save the post: ', err)
    }
  }

  return (
    <section>
      <h2>Add a New Post</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="postTitle">Post Title</label>
        <input type="text" id="postTitle" defaultValue="" required disabled={isLoading} />

        <label htmlFor="postContent">Content</label>
        <textarea id="postContent" name="postContent" defaultValue="" required disabled={isLoading} />

        <button type="submit" disabled={isLoading}>
          Save post
        </button>
      </form>
    </section>
  )
}
