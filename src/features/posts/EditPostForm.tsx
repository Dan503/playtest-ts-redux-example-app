import { FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useEditPostMutation, useGetPostByIdQuery } from './postsApiSlice'

interface EditPostFormFields extends HTMLFormControlsCollection {
  postTitle: HTMLInputElement
  postContent: HTMLTextAreaElement
}

interface EditPostFormElements extends HTMLFormElement {
  readonly elements: EditPostFormFields
}

export function EditPostForm() {
  const { postId } = useParams()
  const navigate = useNavigate()

  const { data: post } = useGetPostByIdQuery(postId)

  const [updatePost, { isLoading }] = useEditPostMutation()

  async function handleSubmit(e: FormEvent<EditPostFormElements>) {
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

    if (title && content) {
      await updatePost({ id: post.id, title, content })
      navigate(`/posts/${postId}`)
    }
  }

  return (
    <section>
      <h2>Edit Post</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="postTitle">Post Title</label>
        <input type="text" id="postTitle" defaultValue={post?.title} required disabled={isLoading} />

        <label htmlFor="postContent">Content</label>
        <textarea id="postContent" name="postContent" defaultValue={post?.content} required disabled={isLoading} />

        <button type="submit" disabled={isLoading}>
          Save post
        </button>
      </form>
    </section>
  )
}
