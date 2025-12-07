import { Routes, Route } from "react-router-dom";
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

function Page({ title }) {
  return (
    <div className="container py-5">
      <h2 className="mb-4">{title}</h2>
    </div>
  );
}

export default function App() {
  return (
    <>
      <div id="top"></div>

      <Navbar />

      <Routes>
        {/* Главная */}
        <Route path="/" element={<Home />} />

        {/* Register */}
        <Route
          path="/register"
          element={
            <RestrictedRoute redirectTo="/profile" component={<RegisterPage />} />
          }
        />

        {/* Login */}
        <Route
          path="/login"
          element={
            <RestrictedRoute redirectTo="/profile" component={<LoginPage />} />
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

        {/* Личный кабинет текущего пользователя */}
        <Route path="/profile" element={<AuthorProfilePage />} />

        {/* Профили авторов */}
        <Route path="/authors/:authorId" element={<AuthorProfilePage />} />
        <Route
          path="/authors/:authorId/articles/:articleId"
          element={<AuthorProfilePage />}
        />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <Footer />
    </>
  );
}



