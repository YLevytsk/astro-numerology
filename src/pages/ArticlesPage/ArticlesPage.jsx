import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";

import SectionTitle from "../../components/SectionTitle/SectionTitle";
import ArticlesList from "../../components/ArticlesList/ArticlesList";
import Container from "../../components/Container/Container";
import Loader from "../../components/Loader/Loader";

import { loadArticles } from "../../redux/articles/operations.js";
import { setFilter, clearArticles } from "../../redux/articles/slice.js";

import {
  selectArticles,
  selectLoading,
  selectFilter,
} from "../../redux/articles/selectors.js";

import s from "./ArticlesPage.module.css";

const limit = 12;
const filterOptions = ["All", "Popular"];

const ArticlesPage = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const articles = useSelector(selectArticles);
  const loading = useSelector(selectLoading);
  const filter = useSelector(selectFilter);

  const [isOpen, setIsOpen] = useState(false);
  const listRef = useRef(null);
  const queryPage = Math.max(1, Number(searchParams.get("page")) || 1);

  // 🔁 При зміні фільтру — очищуємо і завантажуємо 1 сторінку
  const handleFilterChange = (e) => {
    const selected = e.target.value;
    dispatch(setFilter(selected));
    dispatch(clearArticles());
    dispatch(loadArticles({ page: 1, limit, type: selected }));
    setSearchParams({});
  };

  const handlePageChange = useCallback((nextPage) => {
    const pageParams = new URLSearchParams(searchParams);

    if (nextPage <= 1) {
      pageParams.delete("page");
    } else {
      pageParams.set("page", String(nextPage));
    }

    setSearchParams(pageParams);
  }, [searchParams, setSearchParams]);

  // ➕ Load more
  // ⏳ Первинне завантаження при відкритті сторінки
  useEffect(() => {
    dispatch(clearArticles());
    dispatch(loadArticles({ page: 1, limit, type: filter }));
  }, [dispatch, filter]);

  useEffect(() => {
    if (!articles.length) return;

    const totalPages = Math.max(1, Math.ceil(articles.length / 6));
    if (queryPage > totalPages) {
      handlePageChange(totalPages);
    }
  }, [articles.length, handlePageChange, queryPage]);

  // 🧭 Автоматичний скрол при load more
  useEffect(() => {
    if (queryPage > 1 && listRef.current) {
      const firstNewIndex = (queryPage - 1) * 6;
      const el = listRef.current.children[firstNewIndex];
      if (el) {
        window.scrollTo({
          top: el.offsetTop,
          behavior: "smooth",
        });
      }
    }
  }, [queryPage]);

  // 🌀 Loader на старті
  if (loading && articles.length === 0) {
    return (
      <section>
        <Container className={s.page}>
          <SectionTitle title="Articles" />
          <div className={s.articleCountRow}>
            <span className={s.articleCount}>{articles.length} articles</span>
          </div>
          <Loader />
        </Container>
      </section>
    );
  }

  return (
    <section>
      <Container className={s.page}>
        <SectionTitle title="Articles" />
        <div className={s.articleCountRow}>
          <span className={s.articleCount}>{articles.length} articles</span>
        </div>

        <div className={s.filterBar}>
          <div
            className={s.dropdownWrapper}
            onFocus={() => setIsOpen(true)}
            onBlur={() => setIsOpen(false)}
          >
            <select
              value={filter}
              onChange={handleFilterChange}
              className={s.dropdown}
            >
            {filterOptions.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
            </select>
            <span
              className={`${s.dropdownIcon} ${isOpen ? s.open : ""}`}
              aria-hidden="true"
            >
              ▾
            </span>
          </div>
        </div>

        <div className={s.listGap}>
          <ArticlesList
            articles={articles}
            currentPage={queryPage}
            listRef={listRef}
            onPageChange={handlePageChange}
          />
        </div>

        {loading && articles.length > 0 && (
          <div style={{ textAlign: "center", margin: "20px 0" }}>
            <Loader />
          </div>
        )}
      </Container>
    </section>
  );
};

export default ArticlesPage;
