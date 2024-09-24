import { Route, Routes } from "react-router-dom";
import "./App.css";
import RegisterPage from "./pages/register";

function App() {
  // const [user, loading] = useAuthState(auth);

  // if (loading && !user?.email) {
  //   return (
  //     <div className="h-screen flex items-center justify-center  space-x-3">
  //       <p className="text-sm text-neutral-500">Checking user authentication...</p>
  //       <Loader2 className="animate-spin h-4" />
  //     </div>
  //   );
  // }

  return (
    <div className="h-screen  flex items-start justify-center">
        <Routes>
          {/* <Route path="/dashboard" element={<DashboardPage />} /> */}
          <Route path="/register" element={<RegisterPage />} />
          {/* <Route path="/login" element={<LoginPage />} /> */}
        </Routes>
        {/* Hi there how are you */}
    </div>
  );
}

export default App;
