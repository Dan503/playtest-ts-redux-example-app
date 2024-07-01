import { FormEvent } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { Post, postUpdated } from './postsSlice'
import { useNavigate, useParams } from 'react-router-dom'

interface EditPostFormFields extends HTMLFormControlsCollection {
  postTitle: HTMLInputElement
  postContent: HTMLTextAreaElement
}

interface EditPostFormElements extends HTMLFormElement {
  readonly elements: EditPostFormFields
}

export function EditPostForm() {
  const { postId } = useParams()
  const dispatch = useAppDispatch()
  const post = useAppSelector((state) => state.posts.find((p) => p.id === postId))
  const navigate = useNavigate()

  function handleSubmit(e: FormEvent<EditPostFormElements>) {
    e.preventDefault()

    const { elements } = e.currentTarget
    const title = elements.postTitle.value
    const content = elements.postContent.value

    if (!post) {
      return (
        <section>
          <h2>Post not found!</h2>
        </section>
      )
    }

    const newPost: Post = {
      id: post.id,
      title,
      content,
    }

    if (title && content) {
      dispatch(postUpdated(newPost))
      navigate(`/posts/${postId}`)
    }
  }

  return (
    <section>
      <h2>Edit Post</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="postTitle">Post Title</label>
        <input type="text" id="postTitle" defaultValue={post?.title} required />

        <label htmlFor="postContent">Content</label>
        <textarea id="postContent" name="postContent" defaultValue={post?.content} required />

        <button type="submit">Save post</button>
      </form>
    </section>
  )
}
