import { createAsyncThunk } from "@reduxjs/toolkit";
import { publicAPI } from "../api/publicAPI.js";
import { axiosAPI } from "../auth/operations";

/* ===================== FETCH ALL ARTICLES ===================== */
export const fetchArticles = createAsyncThunk(
  "articles/fetchAll",
  async ({ page, limit, type }, thunkAPI) => {
    try {
      const response = await publicAPI.get("/articles", {
        params: { page, limit },
      });

      const articles = Array.isArray(response.data?.data?.data)
        ? response.data.data.data
        : [];

      if (type === "Popular") {
        return articles
          .filter((a) => a.rate > 38)
          .sort(() => Math.random() - 0.5);
      }

      return articles;
    } catch (e) {
      return thunkAPI.rejectWithValue(e.message);
    }
  }
);

/* ===================== FETCH ONE ARTICLE ===================== */
export const fetchArticle = createAsyncThunk(
  "articles/fetchArticle",
  async (id, thunkAPI) => {
    try {
      const response = await publicAPI.get(`/articles/${id}`);
      return response.data?.data;
    } catch (e) {
      return thunkAPI.rejectWithValue(e.message);
    }
  }
);

/* ===================== ADD ARTICLE (WITH IMAGE) ===================== */
export const addArticle = createAsyncThunk(
  "articles/addArticle",
  async (formData, thunkAPI) => {
    try {
      // 櫨 ﾐ漬籍孟斷・ ﾐｸﾑ・ｿﾐｾﾐｻﾑ糊ｷﾑσｵﾐｼ axiosAPI (ﾐｰﾐｲﾑひｾﾑﾐｸﾐｷﾐｾﾐｲﾐｰﾐｽﾐｽﾑ巾ｹ)
      const response = await axiosAPI.post("/articles", formData, {
        onUploadProgress: (e) => {
          if (e.total) {
            console.log(
              "UPLOAD:",
              Math.round((e.loaded * 100) / e.total) + "%"
            );
          }
        },
      });

      return response.data;
    } catch (e) {
      return thunkAPI.rejectWithValue(
        e.response?.data?.message || e.message
      );
    }
  }
);

/* ===================== UPDATE ARTICLE (WITH IMAGE) ===================== */
export const updateArticle = createAsyncThunk(
  "articles/updateArticle",
  async ({ articleId, formData }, thunkAPI) => {
    try {
      const response = await axiosAPI.patch(
        `/articles/${articleId}`,
        formData
      );
      return response.data;
    } catch (e) {
      return thunkAPI.rejectWithValue(
        e.response?.data?.message || e.message
      );
    }
  }
);

/* ===================== DELETE ARTICLE ===================== */
export const deleteArticle = createAsyncThunk(
  "articles/deleteArticle",
  async (articleId, thunkAPI) => {
    try {
      await axiosAPI.delete(`/articles/${articleId}`);
      return articleId;
    } catch (e) {
      return thunkAPI.rejectWithValue(
        e.response?.data?.message || e.message
      );
    }
  }
);

/* ===================== LOAD ARTICLES (WITH RESET) ===================== */
export const loadArticles = createAsyncThunk(
  "articles/loadArticles",
  async ({ page, limit, type }, thunkAPI) => {
    if (type === "All" && page === 1) {
      thunkAPI.dispatch({ type: "articles/clearArticles" });
    }

    const resultAction = await thunkAPI.dispatch(
      fetchArticles({ page, limit, type })
    );

    if (fetchArticles.fulfilled.match(resultAction)) {
      return resultAction.payload;
    }

    return thunkAPI.rejectWithValue(resultAction.payload);
  }
);

/* ===================== FETCH ARTICLES BY AUTHOR ===================== */
export const fetchArticlesByOwner = createAsyncThunk(
  "articles/fetchArticlesByOwner",
  async (ownerId, thunkAPI) => {
    try {
      const response = await publicAPI.get("/articles", {
        params: { ownerId, page: 1, limit: 100 },
      });

      const articles = Array.isArray(response.data?.data?.data)
        ? response.data.data.data
        : [];

      return { ownerId, articles };
    } catch (e) {
      return thunkAPI.rejectWithValue({ ownerId, message: e.message });
    }
  }
);




