// pages
import About from "@/pages/about/About"
import AuthorizationPage from "@/pages/authorization/AuthorizationPage"
import BooksCatalog from "@/pages/books-catalog/BooksCatalog"
import Error from "@/pages/error/Error"
import HomePage from "@/pages/home/HomePage"
import Profile from "@/pages/profile/Profile"
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
      </Routes>
    </Router>
  )
}

export default App
