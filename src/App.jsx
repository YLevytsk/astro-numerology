import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer/Footer.jsx";

import Home from "./pages/Home.jsx";
import PythagorasPage from "./pages/PythagorasPage/PythagorasPage.jsx";
import RegisterPage from "./pages/RegisterPage/RegisterPage.jsx";
import LoginPage from "./pages/LoginPage/LoginPage.jsx";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage.jsx";

import ArticlesList from "./components/ArticlesList/ArticlesList.jsx";
import ArticlePage from "./pages/ArticlePage/ArticlePage.jsx";
import AuthorProfilePage from "./components/AuthorProfilePage/AuthorProfilePage.jsx";
import CreateArticlePage from "./pages/CreateArticlePage/CreateArticlePage.jsx";

import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import RestrictedRoute from "./components/RestrictedRoute.jsx";

import { axiosAPI } from "./redux/auth/operations";

// Simple wrapper page (used for placeholders)
function Page({ title }) {
  return (
    <div className="container py-5">
      <h2 className="mb-4">{title}</h2>
    </div>
  );
}

export default function App() {
  // Restore token from localStorage
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      axiosAPI.defaults.headers.common.Authorization = `Bearer ${token}`;
    }
  }, []);

  return (
    <>
      <Navbar />

      <Routes>
        {/* HOME */}
        <Route path="/" element={<Home />} />

        {/* AUTH */}
        <Route
          path="/register"
          element={
            <RestrictedRoute
              redirectTo="/profile"
              component={<RegisterPage />}
            />
          }
        />

        <Route
          path="/login"
          element={
            <RestrictedRoute
              redirectTo="/profile"
              component={<LoginPage />}
            />
          }
        />

        {/* NUMEROLOGY */}
        <Route path="/numerology/pifagor" element={<PythagorasPage />} />
        <Route
          path="/numerology/compatibility"
          element={<Page title="Couple Compatibility" />}
        />

        {/* BLOG */}
        <Route path="/blog" element={<ArticlesList articles={[]} />} />
        <Route path="/articles/:articleId" element={<ArticlePage />} />

        {/* PROFILE */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <AuthorProfilePage />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile/articles/new"
          element={
            <PrivateRoute>
              <CreateArticlePage />
            </PrivateRoute>
          }
        />

        {/* AUTHORS */}
        <Route path="/authors/:authorId" element={<AuthorProfilePage />} />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <Footer />
    </>
  );
}









