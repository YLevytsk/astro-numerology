import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ArticlesItem from "../ArticlesItem/ArticlesItem.jsx";
import { selectArticles } from "../../redux/articles/selectors.js";
import { fetchArticles } from "../../redux/articles/operations.js";
import s from "./BlogPreview.module.css";
import RightArrowIcon from "../../assets/img/right.svg?react";

export default function BlogPreview() {
  const dispatch = useDispatch();
  const articles = useSelector(selectArticles) || [];

  useEffect(() => {
    if (!articles.length) {
      dispatch(fetchArticles({ page: 1, limit: 3, type: "All" }));
    }
  }, [articles.length, dispatch]);

  // если нет данных из Redux → берём дефолтные
  const defaultArticles = [
    {
      _id: "1",
      title: "Astrology Basics",
      desc: "Learn the fundamentals of astrology and how it influences daily life.",
      img: "/images/annotacia-fioletovogo-i-sinego-oblaka.webp",
    },
    {
      _id: "2",
      title: "Numerology Secrets",
      desc: "Discover what numbers reveal about your personality and destiny.",
      img: "/images/liafs.webp",
    },
    {
      _id: "3",
      title: "Cosmic Predictions",
      desc: "Explore forecasts from the stars for the upcoming season.",
      img: "/images/obloka.webp",
    },
  ];

  const previewArticles =
    articles.length > 0 ? articles.slice(0, 3) : defaultArticles;

  return (
    <section id="blog" className={`py-5 ${s.sectionBlog}`}>
      <div className="container">
        <div className={s.headerBox}>
          <h2 className={s.blogTitle}>
            Latest from the Blog
          </h2>
          <p className={s.blogText}>
            Discover insights, tips, and stories that connect astrology and numerology with everyday life.
          </p>
        </div>

        <ul className={s.articlesList}>
          {previewArticles.map((article, index) => {
            const articleKey =
              article?._id ?? article?.id ?? `article-${index}`;

            return (
              <li key={articleKey}>
                <ArticlesItem
                  article={article}
                  authorName={article.author || article.ownerName || ""}
                />
              </li>
            );
          })}
        </ul>

 <div className={s.goToBlogWrapper}>
  <Link to="/blog" className={s.goToBlog}>
    Go to Blog
    <RightArrowIcon className={s.goToBlogIcon} aria-hidden="true" />
  </Link>
</div>

      </div>
    </section>
  );
}
