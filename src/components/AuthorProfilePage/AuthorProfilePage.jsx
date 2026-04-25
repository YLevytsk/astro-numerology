import React, { useEffect, useState } from "react";
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

import { selectUser } from "../../redux/auth/selectors";
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
const DEFAULT_AVATAR =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='124' height='124' viewBox='0 0 124 124'%3E%3Crect width='124' height='124' rx='62' fill='%23e9ecf1'/%3E%3Ccircle cx='62' cy='48' r='24' fill='%235b4b8a' opacity='.9'/%3E%3Cpath d='M24 108c5.5-22 20-34 38-34s32.5 12 38 34' fill='%235b4b8a' opacity='.9'/%3E%3C/svg%3E";
const ALLOWED_AVATAR_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_AVATAR_SIZE = 5 * 1024 * 1024;

const buildAssetUrl = (path) => {
  if (!path) return DEFAULT_AVATAR;
  if (path.startsWith("data:")) return path;
  return path.startsWith("http") ? path : `${ASSET_BASE}${path}`;
};

const validateAvatarFile = (file) => {
  if (!file) return "Please choose an image file.";
  if (!ALLOWED_AVATAR_TYPES.includes(file.type)) {
    return "Avatar must be JPG, PNG, or WebP.";
  }
  if (file.size > MAX_AVATAR_SIZE) {
    return "Avatar must be 5 MB or smaller.";
  }
  return "";
};

const AuthorProfilePage = () => {
  const dispatch = useDispatch();
  const { authorId } = useParams();
  const [avatarError, setAvatarError] = useState("");
  const [isAvatarUploading, setIsAvatarUploading] = useState(false);
  const [avatarPreviewError, setAvatarPreviewError] = useState(false);

  const currentUser = useSelector(selectUser);
  const persistedUserId = useSelector((state) => state.auth.userId);
  const author = useSelector(selectCreator);

  /* ===================== PROFILE CONTEXT ===================== */
  const currentUserId = currentUser?.id || persistedUserId;
  const isMyProfile = Boolean(
    currentUserId && (!authorId || authorId === currentUserId)
  );

  const profileUser = isMyProfile ? currentUser : author;
  const profileId = isMyProfile ? currentUserId : authorId;

  /* ===================== DATA ===================== */
  const articles =
    useSelector((state) => selectArticlesByOwner(state, profileId)) || [];
  const savedArticles = useSelector(selectSavedArticles) || [];

  const avatarSrc = avatarPreviewError
    ? DEFAULT_AVATAR
    : buildAssetUrl(profileUser?.avatarUrl);

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
              onError={() => setAvatarPreviewError(true)}
            />

            {isMyProfile && (
              <>
                <label
                  htmlFor="avatarUpload"
                  className={css.editAvatarButton}
                  title={isAvatarUploading ? "Uploading avatar" : "Change avatar"}
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
                    if (file && currentUserId) {
                      dispatch(
                        uploadAvatarThunk({
                          file,
                          userId: currentUserId,
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
              userId={currentUserId}
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
