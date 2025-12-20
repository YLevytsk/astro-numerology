import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Consultations from "./pages/Consultations.jsx";
import PythagorasPage from "./pages/PythagorasPage/PythagorasPage.jsx";
import AuthorProfilePage from "./components/AuthorProfilePage/AuthorProfilePage.jsx";
import ArticlesList from "./components/ArticlesList/ArticlesList.jsx";
import RestrictedRoute from "./components/RestrictedRoute.jsx";
import RegisterPage from "./pages/RegisterPage/RegisterPage.jsx";
import LoginPage from "./pages/LoginPage/LoginPage.jsx";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage.jsx";
import Footer from "./components/Footer/Footer.jsx";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";

import ArticlePage from "./pages/ArticlePage/ArticlePage.jsx";
import CreateArticlePage from "./pages/CreateArticlePage/CreateArticlePage.jsx";

import { refreshThunk } from "./redux/auth/operations";
import {
  selectIsLoggedIn,
  selectIsRefreshing,
} from "./redux/auth/selectors";

function Page({ title }) {
  return (
    <div className="container py-5">
      <h2 className="mb-4">{title}</h2>
    </div>
  );
}

export default function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const isLoggedIn = useSelector(selectIsLoggedIn);
  const isRefreshing = useSelector(selectIsRefreshing);

  // refresh auth on app start
  useEffect(() => {
    dispatch(refreshThunk());
  }, [dispatch]);

  // 🔥 редирект гостя ТОЛЬКО с защищённых страниц
  useEffect(() => {
    const publicPaths = ["/", "/login", "/register", "/blog"];

    const isArticlePage = location.pathname.startsWith("/articles/");
    const isAuthorPage = location.pathname.startsWith("/authors/");

    if (
      !isRefreshing &&
      !isLoggedIn &&
      !publicPaths.includes(location.pathname) &&
      !isArticlePage &&
      !isAuthorPage
    ) {
      navigate("/", { replace: true });
    }
  }, [isRefreshing, isLoggedIn, location.pathname, navigate]);

  return (
    <>
      <Navbar />

      <Routes>
        {/* Главная */}
        <Route path="/" element={<Home />} />

        {/* Register */}
        <Route
          path="/register"
          element={
            <RestrictedRoute
              redirectTo="/profile"
              component={<RegisterPage />}
            />
          }
        />

        {/* Login */}
        <Route
          path="/login"
          element={
            <RestrictedRoute
              redirectTo="/profile"
              component={<LoginPage />}
            />
          }
        />

        {/* Numerology */}
        <Route path="/numerology/pifagor" element={<PythagorasPage />} />
        <Route
          path="/numerology/compatibility"
          element={<Page title="Couple compatibility" />}
        />

        {/* Consultations */}
        <Route path="/consultations" element={<Consultations />} />

        {/* Blog */}
        <Route path="/blog" element={<ArticlesList articles={[]} />} />

        {/* Личный кабинет */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <AuthorProfilePage />
            </PrivateRoute>
          }
        />

        {/* ➕ СОЗДАНИЕ СТАТЬИ (ВОТ ОН!) */}
        <Route
          path="/profile/articles/new"
          element={
            <PrivateRoute>
              <CreateArticlePage />
            </PrivateRoute>
          }
        />

        {/* Статья */}
        <Route path="/articles/:articleId" element={<ArticlePage />} />

        {/* Профиль автора */}
        <Route path="/authors/:authorId" element={<AuthorProfilePage />} />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <Footer />
    </>
  );
}






