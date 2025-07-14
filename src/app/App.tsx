// pages
import HomePage from "@/pages/home/HomePage"
import About from "@/pages/about/AboutPage"
import AuthorizationPage from "@/pages/authorization/AuthorizationPage"
import Profile from "@/pages/profile/ProfilePage"
import ProfilePage from "@/pages/profile/ProfilePage"
import BooksCatalog from "@/pages/books-catalog/BooksCatalogPage"
import Error from "@/pages/error/ErrorPage"
// react
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/books-catalog" element={<BooksCatalog />} />
        <Route path="/about" element={<About />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/authorization" element={<AuthorizationPage />} />
        <Route path="*" element={<Error />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Router>
  )
}

export default App
