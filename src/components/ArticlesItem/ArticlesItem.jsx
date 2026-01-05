import { Link } from "react-router-dom";
import s from "./ArticlesItem.module.css";
import ButtonAddToBookmarks from "../ButtonAddToBookmarks/ButtonAddToBookmarks.jsx";
import placeholderImg from "../../assets/Legacies.png";

const API_URL =
  (import.meta.env.VITE_API_BASE || "").replace(/\/api\/?$/, "");

const ArticlesItem = ({
  article,
  authorName,
  canDelete = false,
  onDelete,
}) => {
  const { _id, title, desc, img, ownerId } = article;

  const imageSrc =
    img && (img.startsWith("http") ? img : `${API_URL}${img}`);
  const displayImage = imageSrc || placeholderImg;

  const articleId =
    typeof _id === "object" && _id.$oid ? String(_id.$oid) : _id ? String(_id) : "";
  const hasValidId = Boolean(articleId);

  return (
    <div className={s.articleItem}>
      <div className={s.imageWrapper}>
        <img
          className={s.articleImage}
          src={displayImage}
          alt={title}
        />
      </div>

      <div className={s.wrapper}>
        <div className={s.content}>
          <p className={s.articleOwner}>
            {authorName || article.author || article.ownerName || "Author"}
          </p>
          <h3 className={s.articleTitle}>{title}</h3>
          <p className={s.articleDescription}>{desc}</p>
        </div>

        <div className={`${s.actions} ${canDelete ? s.actionsManage : ""}`}>
          <Link
            to={
              canDelete
                ? "/profile/articles/new"
                : hasValidId
                ? `/articles/${articleId}`
                : "/blog"
            }
            state={canDelete ? { article } : undefined}
            className={s.learn_more}
          >
            {canDelete ? "Edit" : hasValidId ? "Learn more" : "View blog"}
          </Link>
          {!canDelete && <ButtonAddToBookmarks articleId={articleId} />}
          {canDelete && (
            <button
              type="button"
              className={s.deleteButton}
              onClick={() => onDelete?.(articleId)}
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
export default ArticlesItem;
