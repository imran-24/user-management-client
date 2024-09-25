import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import { auth } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import DashboardPage from "./pages/dashboard";
import { Loader2 } from "lucide-react";
import NotFoundPage from "./pages/not-found";
import LandingPage from "./pages/landing";

function App() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className='h-screen flex items-center justify-center space-x-3'>
        <p className='text-sm text-neutral-500'>
          Checking user authentication...
        </p>
        <Loader2 className='animate-spin h-4' />
      </div>
    );
  }
  if (user) navigate("/dashboard");

  return (
    <div className='h-screen  flex items-start justify-center'>
      <>
        <Routes>
          {/* Redirect to dashboard if authenticated */}
          <Route
            path='/dashboard'
            element={user ? <DashboardPage /> : <Navigate to='/login' />}
          />
          <Route
            path='/register'
            element={!user ? <RegisterPage /> : <Navigate to='/dashboard' />}
          />
          <Route
            path='/login'
            element={!user ? <LoginPage /> : <Navigate to='/dashboard' />}
          />

          <Route
            path='/'
            element={<LandingPage />}
          />

          {/* Wildcard route for undefined pages */}
          <Route path='*' element={<NotFoundPage />} />
        </Routes>
      </>
      {/* )} */}
    </div>
  );
}

export default App;
