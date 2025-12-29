import { createAsyncThunk } from "@reduxjs/toolkit";
import { publicAPI } from "../api/publicAPI";

/* ===================== FETCH BOOKMARKS ===================== */
export const fetchBookmarks = createAsyncThunk(
  "bookmarks/fetchAll",
  async (userId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const { data } = await publicAPI.get(
        `/users/${userId}/saved-articles`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const articles = Array.isArray(data.data)
        ? data.data.map(a => a._id)
        : [];
      return articles;
    } catch (e) {
      return thunkAPI.rejectWithValue(e.message);
    }
  }
);

/* ===================== ADD BOOKMARK ===================== */
export const addBookmark = createAsyncThunk(
  "bookmarks/add",
  async ({ userId, articleId }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      await publicAPI.post(
        `/users/${userId}/saved-articles/${articleId}`,
        null,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return articleId;
    } catch (e) {
      return thunkAPI.rejectWithValue(e.message);
    }
  }
);

/* ===================== REMOVE BOOKMARK ===================== */
export const removeBookmark = createAsyncThunk(
  "bookmarks/remove",
  async ({ userId, articleId }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      await publicAPI.delete(
        `/users/${userId}/saved-articles/${articleId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return articleId;
    } catch (e) {
      return thunkAPI.rejectWithValue(e.message);
    }
  }
);

/* ===================== SELECTORS ===================== */
export const selectBookmarks = (state) =>
  Array.isArray(state.bookmarks?.items) ? state.bookmarks.items : [];

export const selectBookmarksLoading = (state) => state.bookmarks?.isLoading;
export const selectBookmarksError = (state) => state.bookmarks?.error;

