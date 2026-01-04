import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";

import { fetchAuthor } from "../../redux/author/operations";
import { selectCreator } from "../../redux/author/selectors";

import { selectUser } from "../../redux/auth/selectors";
import { uploadAvatarThunk, updateBioThunk } from "../../redux/auth/operations";

import {
  fetchArticlesByOwner,
  deleteArticle,
} from "../../redux/articles/operations";
import { selectArticlesByOwner } from "../../redux/articles/selectors";

import ArticlesList from "../ArticlesList/ArticlesList.jsx";
import css from "./AuthorProfilePage.module.css";

const API_URL = import.meta.env.VITE_API_URL || "http://95.217.129.211:3000";
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

  const isMyProfile = Boolean(
    currentUser?.id && (!authorId || authorId === currentUser.id)
  );

  const profileUser = isMyProfile ? currentUser : author;
  const profileId = isMyProfile ? currentUser?.id : authorId;

  const articles =
    useSelector((state) => selectArticlesByOwner(state, profileId)) || [];

  const avatarSrc = buildAssetUrl(profileUser?.avatarUrl);

  const bio =
    profileUser?.bio ||
    profileUser?.description ||
    profileUser?.about ||
    "";

  const [bioValue, setBioValue] = useState(bio);
  const [isEditingBio, setIsEditingBio] = useState(!bio);

  useEffect(() => {
    setBioValue(bio);
    setIsEditingBio(!bio);
  }, [bio]);

  useEffect(() => {
    if (!profileId) return;

    if (!isMyProfile) {
      dispatch(fetchAuthor(authorId));
    }

    dispatch(fetchArticlesByOwner(profileId));
  }, [dispatch, authorId, profileId, isMyProfile]);

  const handleDelete = async (articleId) => {
    try {
      await dispatch(deleteArticle(articleId)).unwrap();
      dispatch(fetchArticlesByOwner(profileId));
    } catch (e) {
      console.error("Failed to delete article:", e);
    }
  };

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

            <p className={css.articleCount}>{articles.length} Articles</p>
          </div>

          {/* INFO */}
          <div className={css.profileInfo}>
            <div className={css.leftInfo}>
              <h1 className={css.authorName}>{profileUser.name}</h1>
            </div>

            {/* BIO VIEW */}
            {bio && !isEditingBio && (
              <div className={css.bioView}>
                <p className={css.bioText}>{bio}</p>
                <button
                  type="button"
                  className={css.editBioLink}
                  onClick={() => setIsEditingBio(true)}
                >
                  Edit bio
                </button>
              </div>
            )}

            {/* BIO EDITOR */}
            {isMyProfile && isEditingBio && (
              <div className={css.bioEditor}>
                <textarea
                  className={css.bioTextarea}
                  value={bioValue}
                  onChange={(e) => setBioValue(e.target.value)}
                  maxLength={1000}
                  placeholder="Tell readers about yourself"
                />

                <button
                  type="button"
                  className={css.saveBioButton}
                  onClick={() => {
                    const targetId =
                      currentUser?.id || profileUser?.id || profileId || authorId;

                    if (!targetId) {
                      console.warn("No user id for bio update");
                      return;
                    }

                    dispatch(
                      updateBioThunk({
                        bio: bioValue,
                        userId: targetId,
                      })
                    )
                      .unwrap()
                      .then(() => setIsEditingBio(false))
                      .catch((err) => {
                        console.error("Failed to save bio", err);
                      });
                  }}
                >
                  Save bio
                </button>
              </div>
            )}
          </div>
        </div>

        {/* CREATE ARTICLE */}
        {isMyProfile && (
          <Link className={css.createButton} to="/profile/articles/new">
            + Create Article
          </Link>
        )}

        {/* ARTICLES */}
        <ArticlesList
          articles={articles}
          canDelete={isMyProfile}
          onDelete={handleDelete}
        />
      </div>
    </section>
  );
};

export default AuthorProfilePage;
