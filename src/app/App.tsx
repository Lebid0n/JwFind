import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/shared/context/AuthContext";

// pages
import HomePage from "@/pages/home/HomePage";
import About from "@/pages/about/AboutPage";
import AuthorizationPage from "@/pages/authorization/AuthorizationPage";
import ProfilePage from "@/pages/profile/ProfilePage";
import Error from "@/pages/error/ErrorPage";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<About />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/authorization" element={<AuthorizationPage />} />
          <Route path="*" element={<Error />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;