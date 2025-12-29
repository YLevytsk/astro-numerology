import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer/Footer.jsx";

import Home from "./pages/Home.jsx";
import Consultations from "./pages/Consultations.jsx";
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

function Page({ title }) {
  return (
    <div className="container py-5">
      <h2 className="mb-4">{title}</h2>
    </div>
  );
}

export default function App() {
  // ✅ Просто восстановить заголовок из localStorage
  // ❌ НИКАКОГО currentThunk (он у тебя всегда 401, потому что accessToken не JWT)
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
        <Route path="/" element={<Home />} />

        <Route
          path="/register"
          element={
            <RestrictedRoute redirectTo="/profile" component={<RegisterPage />} />
          }
        />

        <Route
          path="/login"
          element={
            <RestrictedRoute redirectTo="/profile" component={<LoginPage />} />
          }
        />

        <Route path="/numerology/pifagor" element={<PythagorasPage />} />
        <Route
          path="/numerology/compatibility"
          element={<Page title="Couple compatibility" />}
        />

        <Route path="/consultations" element={<Consultations />} />
        <Route path="/blog" element={<ArticlesList articles={[]} />} />

        {/* МОЙ ПРОФИЛЬ */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <AuthorProfilePage />
            </PrivateRoute>
          }
        />

        {/* СОЗДАНИЕ СТАТЬИ */}
        <Route
          path="/profile/articles/new"
          element={
            <PrivateRoute>
              <CreateArticlePage />
            </PrivateRoute>
          }
        />

        {/* ЧУЖОЙ ПРОФИЛЬ */}
        <Route path="/authors/:authorId" element={<AuthorProfilePage />} />

        <Route path="/articles/:articleId" element={<ArticlePage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <Footer />
    </>
  );
}









