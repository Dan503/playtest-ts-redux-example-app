import { FormEvent, useState } from 'react'
import { LoadingStatusString } from '../../api/api.types'
import { useAppDispatch, useAppSelector } from '../../app/withTypes'
import { selectCurrentUserId } from '../auth/authSlice'
import { addNewPost } from './postsSlice'

interface AddPostFormFields extends HTMLFormControlsCollection {
  postTitle: HTMLInputElement
  postContent: HTMLTextAreaElement
  postAuthor: HTMLSelectElement
}
interface AddPostFormElements extends HTMLFormElement {
  readonly elements: AddPostFormFields
}

export function AddPostForm() {
  const dispatch = useAppDispatch()
  const userId = useAppSelector(selectCurrentUserId) as string
  const [addRequestStatus, setAddRequestStatus] = useState<LoadingStatusString>('idle')

  async function handleSubmit(e: FormEvent<AddPostFormElements>) {
    e.preventDefault()

    const { elements } = e.currentTarget
    const title = elements.postTitle.value
    const content = elements.postContent.value

    const form = e.currentTarget

    try {
      setAddRequestStatus('loading')
      await dispatch(addNewPost({ title, content, user: userId })).unwrap()
      form.reset()
    } catch (err) {
      console.error('Failed to save the post: ', err)
    } finally {
      setAddRequestStatus('idle')
    }
  }

  const isSubmitting = addRequestStatus === 'loading'

  return (
    <section>
      <h2>Add a New Post</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="postTitle">Post Title</label>
        <input type="text" id="postTitle" defaultValue="" required disabled={isSubmitting} />

        <label htmlFor="postContent">Content</label>
        <textarea id="postContent" name="postContent" defaultValue="" required disabled={isSubmitting} />

        <button type="submit" disabled={isSubmitting}>
          Save post
        </button>
      </form>
    </section>
  )
}
