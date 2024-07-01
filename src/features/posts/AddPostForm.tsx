import { FormEvent } from 'react'
import { useAppDispatch } from '../../app/hooks'
import { Post, postAdded } from './postsSlice'
import { nanoid } from '@reduxjs/toolkit'

interface AddPostFormFields extends HTMLFormControlsCollection {
  postTitle: HTMLInputElement
  postContent: HTMLTextAreaElement
}
interface AddPostFormElements extends HTMLFormElement {
  readonly elements: AddPostFormFields
}

export function AddPostForm() {
  const dispatch = useAppDispatch()

  function handleSubmit(e: FormEvent<AddPostFormElements>) {
    e.preventDefault()

    const { elements } = e.currentTarget
    const title = elements.postTitle.value
    const content = elements.postContent.value

    dispatch(postAdded(title, content))

    e.currentTarget.reset()
  }

  return (
    <section>
      <h2>Add a New Post</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="postTitle">Post Title</label>
        <input type="text" id="postTitle" defaultValue="" required />

        <label htmlFor="postContent">Content</label>
        <textarea id="postContent" name="postContent" defaultValue="" required />

        <button type="submit">Save post</button>
      </form>
    </section>
  )
}
