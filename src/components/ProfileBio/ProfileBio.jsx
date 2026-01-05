import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { updateBioThunk } from "../../redux/auth/operations.js";

import css from "./ProfileBio.module.css";

const ProfileBio = ({ bio = "", isMyProfile = false, userId }) => {
  const dispatch = useDispatch();

  const [bioValue, setBioValue] = useState(bio);
  const [isEditing, setIsEditing] = useState(!bio);
  const [isSaving, setIsSaving] = useState(false);

  // keep local state in sync when bio changes from store
  useEffect(() => {
    setBioValue(bio || "");
    setIsEditing(!bio);
  }, [bio]);

  const handleSave = async () => {
    if (!userId) return;
    setIsSaving(true);
    try {
      await dispatch(updateBioThunk({ bio: bioValue, userId })).unwrap();
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to save bio", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isMyProfile) {
    return (
      <div className={css.bioBlock}>
        <p className={css.bioText}>{bio || "No bio yet."}</p>
      </div>
    );
  }

  return (
    <div className={css.bioBlock}>
      {/* VIEW */}
      {bio && !isEditing && (
        <div className={css.bioView}>
          <p className={css.bioText}>{bio}</p>
          <button
            type="button"
            className={css.editButton}
            onClick={() => setIsEditing(true)}
          >
            Edit bio
          </button>
        </div>
      )}

      {/* EDIT */}
      {isEditing && (
        <div className={css.bioEditor}>
          <textarea
            className={css.textarea}
            value={bioValue}
            onChange={(e) => setBioValue(e.target.value)}
            maxLength={1000}
            placeholder="Tell readers about yourself"
          />
          <button
            type="button"
            className={css.saveButton}
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save bio"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileBio;
