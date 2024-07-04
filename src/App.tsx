import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'

import { Navbar } from './components/Navbar'
import { PostList } from './features/posts/PostsList'
import { AddPostForm } from './features/posts/AddPostForm'
import { SinglePostPage } from './features/posts/SinglePostPage'
import { EditPostForm } from './features/posts/EditPostForm'
import { LoginPage } from './features/auth/LoginPage'
import { ReactNode } from 'react'
import { useAppSelector } from './app/withTypes'
import { selectCurrentUserId } from './features/auth/authSlice'
import { UsersList } from './features/users/UsersList'
import { UserPage } from './features/users/UserPage'
import { NotificationsList } from './features/notifications/NotificationsList'
import { ToastContainer } from 'react-tiny-toast'

interface ProtectedRouteProps {
  children: ReactNode
}
function ProtectedRoute({ children }: ProtectedRouteProps) {
  const currentUserId = useAppSelector(selectCurrentUserId)

  if (!currentUserId) {
    return <Navigate to="/" replace />
  }

  return children
}

function App() {
  return (
    <Router>
      <Navbar />
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Routes>
                  <Route
                    path="/posts"
                    element={
                      <>
                        <AddPostForm />
                        <PostList />
                      </>
                    }
                  />
                  <Route path="/posts/:postId" Component={SinglePostPage} />
                  <Route path="/editPost/:postId" Component={EditPostForm} />
                  <Route path="/notifications" Component={NotificationsList} />
                  <Route path="/users" Component={UsersList} />
                  <Route path="/users/:userId" Component={UserPage} />
                </Routes>
              </ProtectedRoute>
            }
          />
        </Routes>
        <ToastContainer />
      </div>
    </Router>
  )
}

export default App
