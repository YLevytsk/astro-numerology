import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { publicAPI } from "../../redux/api/publicAPI.js";

import BookmarkIcon from "../../assets/img/icons/bookmark.svg?react";
import s from "./ArticlePage.module.css";
import Loader from "../../components/Loader/Loader.jsx";
import { selectIsLoggedIn, selectUserId } from "../../redux/auth/selectors.js";
import { useToggle } from "../../hooks/useToggle.js";
import AuthModal from "../../components/ModalErrorSave/ModalErrorSave.jsx";
import {
  addBookmark,
  fetchBookmarks,
  removeBookmark,
} from "../../redux/bookmarks/operations.js";
import { selectBookmarks } from "../../redux/bookmarks/selectors.js";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE || "https://harmoniq.disainnova.com"
).replace(/\/api\/?$/, "");

const ArticlePage = () => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const bookmarks = useSelector(selectBookmarks).map(String);
  const { articleId } = useParams();
  const normalizedArticleId = String(articleId);
  const isBookmarked = bookmarks.includes(normalizedArticleId);
  const dispatch = useDispatch();
  const userId = useSelector(selectUserId);
  const { isOpen, close, open } = useToggle();

  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState({
    article: true,
    related: true,
    users: true,
  });

  const getUserName = (usersArray, ownerId) => {
    const id = ownerId?.$oid ?? ownerId;
    const user = usersArray.find(({ _id }) => _id === id);
    return user?.name ?? "Unknown author";
  };

  const getRandomArticles = (allArticles, currentId, count = 3) => {
    const filtered = allArticles.filter((item) => item._id !== currentId);
    const shuffled = [...filtered].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [articleId]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading({ article: true, related: true, users: true });
      try {
        const [articleRes, usersRes, allArticlesRes] = await Promise.all([
          publicAPI.get(`/articles/${articleId}`),
          publicAPI.get("/creators/all"),
          publicAPI.get("/articles"),
        ]);

        setArticle(articleRes.data.data);

        const rawUsers = usersRes.data.data ?? usersRes.data;
        setUsers(Array.isArray(rawUsers) ? rawUsers : []);

        const rawArticles =
          allArticlesRes.data.data?.data ?? allArticlesRes.data;
        const articlesArray = Array.isArray(rawArticles) ? rawArticles : [];

        setRelatedArticles(getRandomArticles(articlesArray, articleId, 3));
      } catch (error) {
        console.error("Error while fetching data:", error);
      } finally {
        setLoading({ article: false, related: false, users: false });
      }
    };

    fetchData();
  }, [articleId]);

  const handleToggleBookmark = async () => {
    if (!isLoggedIn) {
      open();
      return;
    }

    if (!userId) return;

    try {
      if (isBookmarked) {
        await dispatch(
          removeBookmark({ userId, articleId: normalizedArticleId })
        ).unwrap();
      } else {
        await dispatch(
          addBookmark({ userId, articleId: normalizedArticleId })
        ).unwrap();
      }

      await dispatch(fetchBookmarks(userId));
    } catch (error) {
      console.error("Error while updating bookmarks:", error);
    }
  };

  if (loading.article || loading.users) return <Loader />;

  if (!article) {
    return <p className={s.empty}>Article not found</p>;
  }

  const formattedText = article.article.replace(/\/n/g, "<br><br>");

  const articleOwnerId = article.ownerId?.$oid ?? article.ownerId;
  const user = users.find(({ _id }) => _id === articleOwnerId);
  const authorName = user?.name ?? "Unknown author";

  return (
    <div className="container">
      <div className={s.articleWrapper}>
        <h1 className={s.title}>{article.title}</h1>

        {article.img && (
          <img
            className={s.articleImage}
            src={
              article.img?.startsWith("http")
                ? article.img
                : `${API_BASE_URL}${article.img}`
            }
            alt={`Article image ${article.title}`}
          />
        )}

        <div className={s.contentBlock}>
          <p
            className={s.articleText}
            dangerouslySetInnerHTML={{ __html: formattedText }}
          />

          <div className={s.wrapper}>
            <div className={s.metaBlock}>
              <p className={s.author}>
                <strong>Author:</strong>{" "}
                <span className={s.authorName}>{authorName}</span>
              </p>

              <p className={s.date}>
                <strong>Publication date:</strong>{" "}
                {new Date(article.date).toLocaleDateString()}
              </p>

              <p className={s.bottomText}>
                You may also be interested in
              </p>

              <ul className={s.links}>
                {relatedArticles.map((suggested) => {
                  const id = suggested._id;

                  return (
                    <li key={id} className={s.similarArticles}>
                      <div className={s.linkBlock}>
                        <div className={s.titleWithIcon}>
                          <Link
                            to={`/articles/${id}`}
                            className={s.similarArticlesTitle}
                          >
                            {suggested.title}
                          </Link>

                          <Link
                            className={s.linkButton}
                            to={`/articles/${id}`}
                            aria-label={`Open article ${suggested.title}`}
                          >
                            &rarr;
                          </Link>
                        </div>

                        <p className={s.similarArticlesAuthor}>
                          {getUserName(users, suggested.ownerId)}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            <button onClick={handleToggleBookmark} className={s.button}>
              {isBookmarked ? "Unsave" : "Save"}
              <BookmarkIcon className={s.buttonIcon} size={24} />
            </button>

            {!isLoggedIn && isOpen && <AuthModal onClose={close} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticlePage;



