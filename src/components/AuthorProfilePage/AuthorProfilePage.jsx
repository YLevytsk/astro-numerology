import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";

import { fetchAuthor } from "../../redux/author/operations";
import { selectCreator } from "../../redux/author/selectors";

import { selectUser } from "../../redux/auth/selectors";

import { fetchArticlesByOwner } from "../../redux/articles/operations";
import { selectArticlesByOwner } from "../../redux/articles/selectors";

import ArticlesList from "../ArticlesList/ArticlesList.jsx";
import css from "./AuthorProfilePage.module.css";

const AuthorProfilePage = () => {
  const dispatch = useDispatch();
  const { authorId } = useParams();

  // Текущий пользователь
  const currentUser = useSelector(selectUser);

  // Автор (если чужой профиль)
  const author = useSelector(selectCreator);

  // Личный профиль или чужой
  const isMyProfile = !authorId;

  // Пользователь профиля
  const profileUser = isMyProfile ? currentUser : author;

  // ID для загрузки статей
  const profileId = isMyProfile ? currentUser?._id : authorId;

  const articles =
    useSelector((state) => selectArticlesByOwner(state, profileId)) || [];

  // Загрузка данных
  useEffect(() => {
    if (!profileId) return;

    if (!isMyProfile) {
      dispatch(fetchAuthor(authorId));
    }

    dispatch(fetchArticlesByOwner(profileId));
  }, [dispatch, authorId, profileId, isMyProfile]);

  // Если данные ещё не загружены
  if (!profileUser) {
    return (
      <section className={css.authorProfile}>
        <div className={css.contentBlock}>
          <p>Loading profile...</p>
        </div>
      </section>
    );
  }

  return (
    <section className={css.authorProfile}>
      <div className={css.contentBlock}>
        <div className={css.profileHeader}>
          {/* AVATAR */}
          <div className={css.avatarWrapper}>
            <img
              src={profileUser.avatarUrl || "/default-avatar.png"}
              alt={profileUser.name}
              className={css.profileImage}
            />

            {isMyProfile && (
              <>
             <label
  htmlFor="avatarUpload"
  className={css.editAvatarButton}
  title="Change avatar"
>
  <svg
    className={css.editAvatarIcon}
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1.003 1.003 0 000-1.42l-2.34-2.34a1.003 1.003 0 00-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z"
      fill="currentColor"
    />
  </svg>
</label>


                <input
                  id="avatarUpload"
                  type="file"
                  accept="image/*"
                  className={css.hiddenInput}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      console.log("UPLOAD AVATAR:", file);
                      // TODO: dispatch(uploadAvatar(file))
                    }
                  }}
                />
              </>
            )}
          </div>

          {/* INFO */}
          <div>
            <h1 className={css.authorName}>
              {profileUser.name}
              {isMyProfile && " (My Profile)"}
            </h1>

            <p className={css.authorBio}>{articles.length} Articles</p>
          </div>
        </div>

        {/* Кнопка создания статьи */}
        {isMyProfile && (
          <Link className={css.createButton} to="/profile/articles/new">
            + Create Article
          </Link>
        )}

        {/* ARTICLES */}
        <div className={css.articlesList}>
          <ArticlesList articles={articles} />
        </div>
      </div>
    </section>
  );
};

export default AuthorProfilePage;





