import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ArticlesItem from "../ArticlesItem/ArticlesItem.jsx";
import { selectArticles } from "../../redux/articles/selectors.js";
import s from "./BlogPreview.module.css";
import rightArrow from "../../assets/img/right.svg";

export default function BlogPreview() {
  const articles = useSelector(selectArticles);

  // если нет данных из Redux → берём дефолтные
  const defaultArticles = [
    {
      _id: "1",
      title: "Astrology Basics",
      desc: "Learn the fundamentals of astrology and how it influences daily life.",
      img: "/images/blog1.jpg",
    },
    {
      _id: "2",
      title: "Numerology Secrets",
      desc: "Discover what numbers reveal about your personality and destiny.",
      img: "/images/blog2.jpg",
    },
    {
      _id: "3",
      title: "Cosmic Predictions",
      desc: "Explore forecasts from the stars for the upcoming season.",
      img: "/images/blog3.jpg",
    },
  ];

  const previewArticles =
    articles.length > 0 ? articles.slice(0, 3) : defaultArticles;

  return (
    <section id="blog" className={`py-5 ${s.sectionBlog}`}>
      <div className="container">
        <h2 className={`text-center mb-4 ${s.blogTitle}`}>
          Latest from the Blog
        </h2>
        <p className={`lead text-center mb-5 ${s.blogText}`}>
          Discover insights, tips, and stories that connect astrology and numerology with everyday life.
        </p>

        <ul className={s.articlesList}>
          {previewArticles.map((article) => (
            <li key={article._id}>
              <ArticlesItem article={article} />
            </li>
          ))}
        </ul>

 <div className={s.goToBlogWrapper}>
  <Link to="/blog" className={s.goToBlog}>
  Go to Blog
  <img src={rightArrow} alt="" className={s.goToBlogIcon} />
</Link>
</div>

      </div>
    </section>
  );
}
