import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosAPI } from "../auth/operations";

/* ===================== FETCH BOOKMARKS ===================== */
export const fetchBookmarks = createAsyncThunk(
  "bookmarks/fetchAll",
  async (userId, thunkAPI) => {
    try {
      const { data } = await axiosAPI.get(`/users/${userId}/saved-articles`);
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
      await axiosAPI.post(`/users/${userId}/saved-articles/${articleId}`);
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
      await axiosAPI.delete(`/users/${userId}/saved-articles/${articleId}`);
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

