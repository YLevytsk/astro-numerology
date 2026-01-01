import { createSlice } from "@reduxjs/toolkit";
import {
  addArticle,
  fetchArticle,
  fetchArticles,
  fetchArticlesByOwner,
  deleteArticle,
} from "./operations.js";

// Загальний обробник pending
const handlePending = (state) => {
  state.isLoading = true;
  state.error = null;
};

// Загальний обробник rejected
const handleRejected = (state, action) => {
  state.isLoading = false;
  state.error = action.payload;
};

const slice = createSlice({
  name: "articles",
  initialState: {
    items: [], // всі отримані статті
    byOwner: {}, // кешовані статті по автору
    currentArticle: null, // поточна обрана стаття
    isLoading: false,
    error: null,
    page: 1,
    limit: 12,
    filter: "All", // "All" або "Popular"
    hasMore: true, // чи є ще статті для пагінації
  },

  reducers: {
    incrementPage(state) {
      state.page += 1;
    },
    setFilter(state, action) {
      state.filter = action.payload;
    },
    setPage(state, action) {
      state.page = action.payload;
    },
    clearArticles(state) {
      state.items = [];
      state.hasMore = true; // важливо обнулити також пагінацію
    },
    setHasMore(state, action) {
      state.hasMore = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      // ==== FETCH ARTICLES ====
      .addCase(fetchArticles.pending, handlePending)
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;

        // Оновлюємо сторінку на ту, що була передана при запиті
        state.page = action.meta.arg.page;

        // Перезапис або додавання до масиву статей
        if (state.page === 1) {
          state.items = action.payload;
        } else {
          state.items = [...state.items, ...action.payload];
        }

        // Оновлюємо hasMore
        state.hasMore = action.payload.length >= state.limit;
      })
      .addCase(fetchArticles.rejected, handleRejected)

      // ==== FETCH ONE ARTICLE ====
      .addCase(fetchArticle.pending, handlePending)
      .addCase(fetchArticle.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.currentArticle = action.payload;
      })
      .addCase(fetchArticle.rejected, handleRejected)

      // ==== ADD ARTICLE ====
      .addCase(addArticle.pending, handlePending)
      .addCase(addArticle.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        // додаємо нову статтю тільки якщо вона проходить поточний фільтр
        const newArticle = action.payload;
        if (
          state.filter === "All" ||
          (state.filter === "Popular" && newArticle.rate > 35)
        ) {
          state.items.unshift(newArticle); // додаємо на початок
        }
      })
      .addCase(addArticle.rejected, handleRejected)

      // ==== FETCH BY OWNER ====
      .addCase(fetchArticlesByOwner.pending, handlePending)
      .addCase(fetchArticlesByOwner.fulfilled, (state, action) => {
        const { ownerId, articles } = action.payload;
        state.isLoading = false;
        state.error = null;
        state.byOwner[ownerId] = {
          items: articles,
          status: "succeeded",
        };
      })
      .addCase(fetchArticlesByOwner.rejected, handleRejected)

      // ==== DELETE ARTICLE ====
      .addCase(deleteArticle.pending, handlePending)
      .addCase(deleteArticle.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        const idToRemove = String(action.payload);
        state.items = state.items.filter(
          (item) => String(item._id ?? item.id ?? item) !== idToRemove
        );
        Object.keys(state.byOwner).forEach((ownerId) => {
          const entry = state.byOwner[ownerId];
          if (entry?.items) {
            entry.items = entry.items.filter(
              (item) => String(item._id ?? item.id ?? item) !== idToRemove
            );
          }
        });
      })
      .addCase(deleteArticle.rejected, handleRejected);
  },
});

// Експортуємо редюсер і дії
export const articlesReducer = slice.reducer;
export const { setFilter, incrementPage, setPage, clearArticles, setHasMore } =
  slice.actions;
