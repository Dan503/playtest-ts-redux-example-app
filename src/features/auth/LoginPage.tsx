import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { FormEvent } from 'react'
import { userLoggedIn } from './authSlice'
import { selectAllUsers } from '../users/usersSlice'

interface LoginPageFormFields extends HTMLFormControlsCollection {
  userId: HTMLSelectElement
}
interface LoginPageFormElements extends HTMLFormElement {
  readonly elements: LoginPageFormFields
}

export function LoginPage() {
  const dispatch = useAppDispatch()
  const users = useAppSelector(selectAllUsers)
  const navigate = useNavigate()

  function handleSubmit(e: FormEvent<LoginPageFormElements>) {
    e.preventDefault()

    console.log(e.currentTarget.elements)
    const targetUserId = e.currentTarget.elements.userId.value
    dispatch(userLoggedIn(targetUserId))
    navigate('/posts')
  }

  return (
    <section>
      <h2>Welcome to Tweeter!</h2>
      <h3>Please log in:</h3>
      <form onSubmit={handleSubmit}>
        <label htmlFor="userId">User:</label>
        <select id="userId" name="userId" required>
          <option value="">-- Select a user to log in as --</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>
        <button>Log in</button>
      </form>
    </section>
  )
}
