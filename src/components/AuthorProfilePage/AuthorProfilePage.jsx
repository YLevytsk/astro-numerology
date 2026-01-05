import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";

import {
  fetchAuthor,
  fetchAuthorSavedArticles,
} from "../../redux/author/operations";
import {
  selectCreator,
  selectSavedArticles,
} from "../../redux/author/selectors";

import {
  selectUser,
} from "../../redux/auth/selectors";
import {
  uploadAvatarThunk,
} from "../../redux/auth/operations";

import {
  fetchArticlesByOwner,
  deleteArticle,
} from "../../redux/articles/operations";
import { selectArticlesByOwner } from "../../redux/articles/selectors";

import ArticlesList from "../ArticlesList/ArticlesList.jsx";
import ProfileBio from "../ProfileBio/ProfileBio.jsx";
import css from "./AuthorProfilePage.module.css";

/* ===================== ASSETS ===================== */
const API_URL =
  import.meta.env.VITE_API_BASE || "https://harmoniq.disainnova.com";
const ASSET_BASE = API_URL.replace(/\/api\/?$/, "");
const buildAssetUrl = (path) => {
  if (!path) return "/default-avatar.png";
  return path.startsWith("http") ? path : `${ASSET_BASE}${path}`;
};

const AuthorProfilePage = () => {
  const dispatch = useDispatch();
  const { authorId } = useParams();

  const currentUser = useSelector(selectUser);
  const author = useSelector(selectCreator);

  /* ===================== PROFILE CONTEXT ===================== */
  const isMyProfile = Boolean(
    currentUser?.id && (!authorId || authorId === currentUser.id)
  );

  const profileUser = isMyProfile ? currentUser : author;
  const profileId = isMyProfile ? currentUser?.id : authorId;

  /* ===================== DATA ===================== */
  const articles =
    useSelector((state) => selectArticlesByOwner(state, profileId)) || [];
  const savedArticles = useSelector(selectSavedArticles) || [];

  const avatarSrc = buildAssetUrl(profileUser?.avatarUrl);

  const bio =
    profileUser?.bio ||
    profileUser?.description ||
    profileUser?.about ||
    "";

  /* ===================== LOAD PROFILE ===================== */
  useEffect(() => {
    if (!profileId) return;

    if (!isMyProfile) {
      dispatch(fetchAuthor(authorId));
    }

    dispatch(fetchArticlesByOwner(profileId));
  }, [dispatch, authorId, profileId, isMyProfile]);

  /* ===================== SAVED ARTICLES (MY PROFILE) ===================== */
  useEffect(() => {
    if (isMyProfile && profileId) {
      dispatch(fetchAuthorSavedArticles(profileId));
    }
  }, [dispatch, isMyProfile, profileId]);

  /* ===================== DELETE ARTICLE ===================== */
  const handleDelete = async (articleId) => {
    try {
      await dispatch(deleteArticle(articleId)).unwrap();
      dispatch(fetchArticlesByOwner(profileId));
    } catch (e) {
      console.error("Failed to delete article:", e);
    }
  };

  /* ===================== LOADING ===================== */
  if (!profileUser) {
    return (
      <section className={css.authorProfile}>
        <div className={css.contentBlock}>
          <p>Loading profile...</p>
        </div>
      </section>
    );
  }

  /* ===================== RENDER ===================== */
  return (
    <section className={css.authorProfile}>
      <div className={css.contentBlock}>
        {/* HEADER */}
        <div className={css.profileHeader}>
          {/* AVATAR */}
          <div className={css.avatarWrapper}>
            <img
              src={avatarSrc}
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
                  ✎
                </label>

                <input
                  id="avatarUpload"
                  type="file"
                  accept="image/*"
                  className={css.hiddenInput}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file && currentUser?.id) {
                      dispatch(
                        uploadAvatarThunk({
                          file,
                          userId: currentUser.id,
                        })
                      );
                    }
                  }}
                />
              </>
            )}

            <p className={css.articleCount}>
              {articles.length} Articles
            </p>
          </div>

          {/* INFO */}
          <div className={css.profileInfo}>
            <h1 className={css.authorName}>
              {profileUser.name}
            </h1>

            <ProfileBio
              bio={bio}
              isMyProfile={isMyProfile}
              userId={currentUser?.id}
            />
          </div>
        </div>

        {/* CREATE ARTICLE */}
        {isMyProfile && (
          <Link
            className={css.createButton}
            to="/profile/articles/new"
          >
            + Create Article
          </Link>
        )}

        {/* ARTICLES */}
        <ArticlesList
          articles={articles}
          canDelete={isMyProfile}
          onDelete={handleDelete}
        />

        {/* SAVED */}
        {isMyProfile && (
          <div className={css.savedSection}>
            <h2 className={css.savedHeading}>Saved</h2>

            {savedArticles.length ? (
              <ul className={css.savedList}>
                {savedArticles.map((saved) => {
                  const savedId =
                    saved?._id?.$oid ||
                    saved?._id ||
                    saved?.id;

                  if (!savedId) return null;

                  return (
                    <li key={savedId} className={css.savedItem}>
                      <Link
                        to={`/articles/${savedId}`}
                        className={css.savedLink}
                      >
                        {saved?.title || "Untitled"}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className={css.savedEmpty}>
                There are no saved articles yet.
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default AuthorProfilePage;
