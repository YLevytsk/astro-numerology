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
import { uploadAvatarThunk } from "../../redux/auth/operations";

import {
  fetchArticlesByOwner,
  deleteArticle,
} from "../../redux/articles/operations";
import { selectArticlesByOwner } from "../../redux/articles/selectors";

import ArticlesList from "../ArticlesList/ArticlesList.jsx";
import ProfileBio from "../ProfileBio/ProfileBio.jsx";
import css from "./AuthorProfilePage.module.css";

const API_URL =
  import.meta.env.VITE_API_BASE || "https://harmoniq.disainnova.com";
const ASSET_BASE = API_URL.replace(/\/api\/?$/, "");
const DEFAULT_AVATAR =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='124' height='124' viewBox='0 0 124 124'%3E%3Crect width='124' height='124' rx='62' fill='%23e9ecf1'/%3E%3Ccircle cx='62' cy='48' r='24' fill='%235b4b8a' opacity='.9'/%3E%3Cpath d='M24 108c5.5-22 20-34 38-34s32.5 12 38 34' fill='%235b4b8a' opacity='.9'/%3E%3C/svg%3E";
const ALLOWED_AVATAR_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_AVATAR_SIZE = 1024 * 1024;
const AVATAR_SIZE = 512;

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
  return "";
};

const resizeAvatar = (file) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    const reader = new FileReader();

    reader.onload = (event) => {
      image.src = event.target.result;
    };
    reader.onerror = () => reject(new Error("Failed to read image."));
    image.onerror = () => reject(new Error("Failed to process image."));

    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = AVATAR_SIZE;
      canvas.height = AVATAR_SIZE;

      const size = Math.min(image.width, image.height);
      const sourceX = Math.round((image.width - size) / 2);
      const sourceY = Math.round((image.height - size) / 2);
      const context = canvas.getContext("2d");

      context.drawImage(
        image,
        sourceX,
        sourceY,
        size,
        size,
        0,
        0,
        AVATAR_SIZE,
        AVATAR_SIZE
      );

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Failed to compress image."));
            return;
          }

          resolve(
            new File(
              [blob],
              file.name.replace(/\.[^.]+$/, ".webp"),
              { type: "image/webp" }
            )
          );
        },
        "image/webp",
        0.82
      );
    };

    reader.readAsDataURL(file);
  });

const AuthorProfilePage = () => {
  const dispatch = useDispatch();
  const { authorId } = useParams();
  const [avatarError, setAvatarError] = useState("");
  const [isAvatarUploading, setIsAvatarUploading] = useState(false);
  const [avatarPreviewError, setAvatarPreviewError] = useState(false);

  const currentUser = useSelector(selectUser);
  const persistedUserId = useSelector((state) => state.auth.userId);
  const author = useSelector(selectCreator);

  const currentUserId = currentUser?.id || persistedUserId;
  const isMyProfile = Boolean(
    currentUserId && (!authorId || authorId === currentUserId)
  );

  const profileUser = isMyProfile ? currentUser : author;
  const profileId = isMyProfile ? currentUserId : authorId;

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

  useEffect(() => {
    if (!profileId) return;

    if (!isMyProfile) {
      dispatch(fetchAuthor(authorId));
    }

    dispatch(fetchArticlesByOwner(profileId));
  }, [dispatch, authorId, profileId, isMyProfile]);

  useEffect(() => {
    if (isMyProfile && profileId) {
      dispatch(fetchAuthorSavedArticles(profileId));
    }
  }, [dispatch, isMyProfile, profileId]);

  useEffect(() => {
    setAvatarPreviewError(false);
  }, [profileUser?.avatarUrl]);

  const handleAvatarChange = async (event) => {
    const file = event.target.files[0];
    const validationError = validateAvatarFile(file);

    if (validationError) {
      setAvatarError(validationError);
      event.target.value = "";
      return;
    }

    if (!currentUserId) {
      setAvatarError("User id is missing. Please log in again.");
      event.target.value = "";
      return;
    }

    try {
      setAvatarError("");
      setIsAvatarUploading(true);
      setAvatarPreviewError(false);

      const avatarFile = await resizeAvatar(file);

      if (avatarFile.size > MAX_AVATAR_SIZE) {
        setAvatarError("Avatar must be 1 MB or smaller after compression.");
        return;
      }

      await dispatch(
        uploadAvatarThunk({
          file: avatarFile,
          userId: currentUserId,
        })
      ).unwrap();
    } catch (error) {
      setAvatarError(
        typeof error === "string"
          ? error
          : "Avatar upload failed. Please try another image."
      );
    } finally {
      setIsAvatarUploading(false);
      event.target.value = "";
    }
  };

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
        <div className={css.profileHeader}>
          <div className={css.avatarBlock}>
            <div className={css.avatarWrapper}>
              <img
                src={avatarSrc}
                alt={profileUser.name || "User"}
                className={css.profileImage}
                onError={() => setAvatarPreviewError(true)}
              />

              {isMyProfile && (
                <>
                  <label
                    htmlFor="avatarUpload"
                    className={css.editAvatarButton}
                    title={
                      isAvatarUploading ? "Uploading avatar" : "Change avatar"
                    }
                  >
                    {isAvatarUploading ? "..." : "+"}
                  </label>

                  <input
                    id="avatarUpload"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className={css.hiddenInput}
                    disabled={isAvatarUploading}
                    onChange={handleAvatarChange}
                  />
                </>
              )}
            </div>

            <p className={css.articleCount}>{articles.length} Articles</p>
            {isMyProfile && avatarError && (
              <p className={css.avatarError}>{avatarError}</p>
            )}
          </div>

          <div className={css.profileInfo}>
            <h1 className={css.authorName}>{profileUser.name}</h1>

            <ProfileBio
              bio={bio}
              isMyProfile={isMyProfile}
              userId={currentUserId}
            />
          </div>
        </div>

        {isMyProfile && (
          <Link className={css.createButton} to="/profile/articles/new">
            + Create Article
          </Link>
        )}

        <ArticlesList
          articles={articles}
          canDelete={isMyProfile}
          onDelete={handleDelete}
        />

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
