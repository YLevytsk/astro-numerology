import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ArticlesItem from "../ArticlesItem/ArticlesItem.jsx";
import s from "./ArticlesList.module.css";
import { fetchAuthors } from "../../redux/author/operations.js";
import { fetchBookmarks } from "../../redux/bookmarks/operations.js";
import { selectCreators } from "../../redux/author/selectors.js";
import { selectIsLoggedIn, selectUserId } from "../../redux/auth/selectors.js";
import Pagination from "../Pagination/Pagination.jsx";

const ArticlesList = ({ articles }) => {
  const dispatch = useDispatch();
  const authors = useSelector(selectCreators);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const userId = useSelector(selectUserId);

  // 🔹 pagination
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 6;

  useEffect(() => {
    dispatch(fetchAuthors());

    if (isLoggedIn && userId) {
      dispatch(fetchBookmarks(userId));
    }
  }, [dispatch, isLoggedIn, userId]);

  const getAuthorName = (ownerId) => {
    const author = authors.find((a) => a._id === ownerId);
    return author?.name || "Unknown";
  };

  // 🔹 EMPTY STATE — удалена кнопка "Create an article"
  if (articles.length === 0) {
    return (
      <div className={s.alertContainer}>
        <div className={s.alertContent}>
          <h3 className={s.alertTitle}>Nothing found.</h3>
          <p className={s.alertText}>Be the first, who create an article</p>
        </div>
      </div>
    );
  }

  // 🔹 pagination logic
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = articles.slice(indexOfFirstArticle, indexOfLastArticle);

  const totalPages = Math.ceil(articles.length / articlesPerPage);

  return (
    <>
      <ul className={s.articlesList}>
        {currentArticles.map((article) => (
          <li key={article._id}>
            <ArticlesItem
              article={article}
              authorName={getAuthorName(article.ownerId)}
            />
          </li>
        ))}
      </ul>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </>
  );
};

export default ArticlesList;
