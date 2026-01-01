import { Link } from "react-router-dom";
import s from "./ArticlesItem.module.css";
import ButtonAddToBookmarks from "../ButtonAddToBookmarks/ButtonAddToBookmarks.jsx";

const API_URL =
  import.meta.env.VITE_API_URL || "http://95.217.129.211:3000";

const ArticlesItem = ({ article, authorName }) => {
  const { _id, title, desc, img } = article;

  const imageSrc =
    img && (img.startsWith("http") ? img : `${API_URL}${img}`);

  const articleId =
    typeof _id === "object" && _id.$oid ? String(_id.$oid) : String(_id);

  return (
    <div className={s.articleItem}>
      {imageSrc && (
        <div className={s.imageWrapper}>
          <img
            className={s.articleImage}
            src={imageSrc}
            alt={title}
          />
        </div>
      )}

      <div className={s.wrapper}>
        <div className={s.content}>
          <p className={s.articleOwner}>{authorName}</p>
          <h3 className={s.articleTitle}>{title}</h3>
          <p className={s.articleDescription}>{desc}</p>
        </div>

        <div className={s.actions}>
          <Link to={`/articles/${articleId}`} className={s.learn_more}>
            Learn more
          </Link>
          <ButtonAddToBookmarks articleId={articleId} />
        </div>
      </div>
    </div>
  );
};

export default ArticlesItem;





