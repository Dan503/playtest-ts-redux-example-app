import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'

import { Navbar } from './components/Navbar'
import { PostList } from './features/posts/PostsList'
import { AddPostForm } from './features/posts/AddPostForm'
import { SinglePostPage } from './features/posts/SinglePostPage'
import { EditPostForm } from './features/posts/EditPostForm'
import { LoginPage } from './features/auth/LoginPage'
import { ReactNode } from 'react'
import { useAppSelector } from './app/hooks'
import { selectCurrentUserId } from './features/auth/authSlice'

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
                  <Route path="/posts/:postId" element={<SinglePostPage />} />
                  <Route path="/editPost/:postId" element={<EditPostForm />} />
                </Routes>
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App
