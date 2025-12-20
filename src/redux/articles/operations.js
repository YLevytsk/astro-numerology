import { createAsyncThunk } from "@reduxjs/toolkit";
import { publicAPI } from "../api/publicAPI.js";

// 🔹 Отримати всі статті з фільтрацією по "Popular"
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

      const filteredArticles =
        type === "Popular"
          ? articles
              .filter((article) => article.rate > 38)
              .sort(() => Math.random() - 0.5)
          : articles;

      return filteredArticles;
    } catch (e) {
      return thunkAPI.rejectWithValue(e.message);
    }
  }
);

// 🔹 Отримати одну статтю за ID
export const fetchArticle = createAsyncThunk(
  "articles/fetchArticle",
  async (id, thunkAPI) => {
    try {
      const response = await publicAPI.get(`/articles/${id}`);
      return response.data;
    } catch (e) {
      return thunkAPI.rejectWithValue(e.message);
    }
  }
);

// 🔹 Додати нову статтю (авторизація обов'язкова)
export const addArticle = createAsyncThunk(
  "articles/addArticle",
  async (item, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state.auth.token;

      if (!token) {
        return thunkAPI.rejectWithValue("No token available");
      }

      publicAPI.defaults.headers.common.Authorization = `Bearer ${token}`;

      const response = await publicAPI.post("/articles", item);
      return response.data;
    } catch (e) {
      return thunkAPI.rejectWithValue(e.message);
    }
  }
);

// 🔹 Завантажити статті з очищенням
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
    } else {
      return thunkAPI.rejectWithValue(resultAction.payload);
    }
  }
);

// 🔹 Отримати всі статті певного автора
export const fetchArticlesByOwner = createAsyncThunk(
  "articles/fetchArticlesByOwner",
  async (ownerId, thunkAPI) => {
    try {
      const response = await publicAPI.get("/articles", {
        params: { ownerId },
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

// 🔹 Допоміжні селектори
export const incrementPage = (currentPage) => currentPage + 1;
export const selectFilter = (state) => state.articles.filter;

