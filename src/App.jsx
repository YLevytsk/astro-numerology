import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer/Footer.jsx";
import CookieBanner from "./components/CookieBanner/CookieBanner.jsx";

import Home from "./pages/Home.jsx";
import PythagorasPage from "./pages/PythagorasPage/PythagorasPage.jsx";
import RegisterPage from "./pages/RegisterPage/RegisterPage.jsx";
import LoginPage from "./pages/LoginPage/LoginPage.jsx";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage.jsx";

import ArticlePage from "./pages/ArticlePage/ArticlePage.jsx";
import AuthorProfilePage from "./components/AuthorProfilePage/AuthorProfilePage.jsx";
import CreateArticlePage from "./pages/CreateArticlePage/CreateArticlePage.jsx";
import ArticlesPage from "./pages/ArticlesPage/ArticlesPage.jsx";
import CookiesPage from "./pages/CookiesPage/CookiesPage.jsx";
import PrivacySecurityPage from "./pages/PrivacySecurityPage/PrivacySecurityPage.jsx";

import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import RestrictedRoute from "./components/RestrictedRoute.jsx";

import { axiosAPI, fetchCurrentUserThunk, refreshThunk } from "./redux/auth/operations";
import { getCookie } from "./utils/cookies.js";

// Simple wrapper page (used for placeholders)
function Page({ title }) {
  return (
    <div className="container py-5">
      <h2 className="mb-4">{title}</h2>
    </div>
  );
}

export default function App() {
  const dispatch = useDispatch();

  // Restore token from localStorage
  useEffect(() => {
    const accessToken =
      getCookie("accessToken") || localStorage.getItem("accessToken");
    const refreshToken =
      getCookie("refreshToken") || localStorage.getItem("refreshToken");

    if (refreshToken) {
      dispatch(refreshThunk());
    } else if (accessToken) {
      axiosAPI.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
      dispatch(fetchCurrentUserThunk());
    }
  }, [dispatch]);

  return (
    <>
      <Navbar />
      <CookieBanner />

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
        <Route path="/blog" element={<ArticlesPage />} />
        <Route path="/articles/:articleId" element={<ArticlePage />} />
        <Route path="/cookies" element={<CookiesPage />} />
        <Route path="/security" element={<PrivacySecurityPage />} />

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



