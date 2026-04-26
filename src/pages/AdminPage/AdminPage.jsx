import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { axiosAPI } from "../../redux/auth/operations";
import s from "./AdminPage.module.css";

const initialAiForm = {
  topic: "",
  keywords: "",
  language: "English",
  tone: "Expert, clear",
  length: "1200",
};

const initialEditForm = {
  title: "",
  seoTitle: "",
  metaDescription: "",
  slug: "",
  desc: "",
  article: "",
  image: null,
};

const getArticleId = (article) =>
  article?._id?.$oid || article?._id || article?.id || "";

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleDateString("en-GB");
};

export default function AdminPage() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [articles, setArticles] = useState([]);
  const [activeTab, setActiveTab] = useState("users");
  const [isLoading, setIsLoading] = useState(true);
  const [isAiFormOpen, setIsAiFormOpen] = useState(false);
  const [aiForm, setAiForm] = useState(initialAiForm);
  const [generatedArticle, setGeneratedArticle] = useState(null);
  const [editingArticle, setEditingArticle] = useState(null);
  const [editForm, setEditForm] = useState(initialEditForm);
  const [pendingAction, setPendingAction] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const loadAdminData = async () => {
      setIsLoading(true);
      setError("");

      try {
        const [statsRes, usersRes, articlesRes] = await Promise.all([
          axiosAPI.get("/admin/stats"),
          axiosAPI.get("/admin/users"),
          axiosAPI.get("/admin/articles"),
        ]);

        if (ignore) return;

        setStats(statsRes.data?.data || null);
        setUsers(Array.isArray(usersRes.data?.data) ? usersRes.data.data : []);
        setArticles(
          Array.isArray(articlesRes.data?.data) ? articlesRes.data.data : []
        );
      } catch (err) {
        if (!ignore) {
          setError(err.response?.data?.message || "Failed to load admin data");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    loadAdminData();

    return () => {
      ignore = true;
    };
  }, []);

  const totalSaved = useMemo(
    () => articles.reduce((sum, article) => sum + (Number(article.rate) || 0), 0),
    [articles]
  );

  const refreshStats = async () => {
    const statsRes = await axiosAPI.get("/admin/stats");
    setStats(statsRes.data?.data || null);
  };

  const replaceArticle = (updatedArticle) => {
    const updatedId = getArticleId(updatedArticle);

    setArticles((prev) =>
      prev.map((article) =>
        getArticleId(article) === updatedId ? updatedArticle : article
      )
    );
  };

  const handleToggleBlockUser = async (user) => {
    const nextBlockedState = !user.isBlocked;
    const action = nextBlockedState ? "block" : "unblock";
    const confirmed = window.confirm(
      `Are you sure you want to ${action} ${user.email || user.name || "this user"}?`
    );

    if (!confirmed) return;

    const actionKey = `user-${user._id}`;
    setPendingAction(actionKey);
    setError("");

    try {
      const res = await axiosAPI.patch(`/admin/users/${user._id}/block`, {
        isBlocked: nextBlockedState,
      });
      const updatedUser = res.data?.data;

      setUsers((prev) =>
        prev.map((item) =>
          item._id === user._id
            ? { ...item, isBlocked: updatedUser?.isBlocked ?? nextBlockedState }
            : item
        )
      );
      toast.success(nextBlockedState ? "User blocked" : "User unblocked");
    } catch (err) {
      const message = err.response?.data?.message || "Failed to update user";
      setError(message);
      toast.error(message);
    } finally {
      setPendingAction("");
    }
  };

  const handleDeleteUser = async (user) => {
    const userLabel = user.email || user.name || "this user";
    const confirmed = window.confirm(
      `Delete account ${userLabel}? This cannot be undone.`
    );

    if (!confirmed) return;

    const actionKey = `delete-user-${user._id}`;
    setPendingAction(actionKey);
    setError("");

    try {
      await axiosAPI.delete(`/admin/users/${user._id}`);
      setUsers((prev) => prev.filter((item) => item._id !== user._id));
      await refreshStats();
      toast.success("User account deleted");
    } catch (err) {
      const message = err.response?.data?.message || "Failed to delete user";
      setError(message);
      toast.error(message);
    } finally {
      setPendingAction("");
    }
  };

  const handleDeleteArticle = async (article) => {
    const articleId = getArticleId(article);
    const confirmed = window.confirm(
      `Delete article "${article.title || "Untitled"}"? This cannot be undone.`
    );

    if (!confirmed) return;

    const actionKey = `article-${articleId}`;
    setPendingAction(actionKey);
    setError("");

    try {
      await axiosAPI.delete(`/admin/articles/${articleId}`);
      setArticles((prev) => prev.filter((item) => getArticleId(item) !== articleId));
      await refreshStats();
      toast.success("Article deleted");
    } catch (err) {
      const message = err.response?.data?.message || "Failed to delete article";
      setError(message);
      toast.error(message);
    } finally {
      setPendingAction("");
    }
  };

  const openEditForm = (article) => {
    setEditingArticle(article);
    setEditForm({
      title: article.title || "",
      seoTitle: article.seoTitle || article.title || "",
      metaDescription: article.metaDescription || article.desc || "",
      slug: article.slug || "",
      desc: article.desc || article.metaDescription || "",
      article: article.article || article.content || "",
      image: null,
    });
  };

  const closeEditForm = () => {
    setEditingArticle(null);
    setEditForm(initialEditForm);
  };

  const handleEditFieldChange = (event) => {
    const { name, value, files } = event.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: files ? files[0] || null : value,
    }));
  };

  const handleSaveArticle = async (event) => {
    event.preventDefault();

    const articleId = getArticleId(editingArticle);
    if (!articleId) return;

    const actionKey = `save-article-${articleId}`;
    const formData = new FormData();

    formData.append("title", editForm.title);
    formData.append("seoTitle", editForm.seoTitle);
    formData.append("metaDescription", editForm.metaDescription);
    formData.append("slug", editForm.slug);
    formData.append("desc", editForm.desc);
    formData.append("article", editForm.article);
    formData.append("content", editForm.article);

    if (editForm.image) {
      formData.append("img", editForm.image);
    }

    setPendingAction(actionKey);
    setError("");

    try {
      const res = await axiosAPI.patch(`/admin/articles/${articleId}`, formData);
      const updatedArticle = res.data?.data || res.data;
      replaceArticle(updatedArticle);
      setEditingArticle(updatedArticle);
      setEditForm((prev) => ({ ...prev, image: null }));
      toast.success("Article updated");
    } catch (err) {
      const message = err.response?.data?.message || "Failed to update article";
      setError(message);
      toast.error(message);
    } finally {
      setPendingAction("");
    }
  };

  const handlePublishArticle = async (article) => {
    const articleId = getArticleId(article);
    if (!articleId) return;

    const confirmed = window.confirm(
      `Publish article "${article.title || "Untitled"}"?`
    );

    if (!confirmed) return;

    const actionKey = `publish-article-${articleId}`;
    setPendingAction(actionKey);
    setError("");

    try {
      const res = await axiosAPI.patch(`/admin/articles/${articleId}/publish`);
      const updatedArticle = res.data?.data || res.data;
      replaceArticle(updatedArticle);
      if (getArticleId(editingArticle) === articleId) {
        setEditingArticle(updatedArticle);
      }
      toast.success("Article published");
    } catch (err) {
      const message = err.response?.data?.message || "Failed to publish article";
      setError(message);
      toast.error(message);
    } finally {
      setPendingAction("");
    }
  };

  const handleAiFieldChange = (event) => {
    const { name, value } = event.target;
    setAiForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerateArticle = async (event) => {
    event.preventDefault();

    if (!aiForm.topic.trim()) {
      toast.error("Article topic is required");
      return;
    }

    const actionKey = "generate-ai-article";
    setPendingAction(actionKey);
    setError("");
    setGeneratedArticle(null);

    try {
      const res = await axiosAPI.post("/admin/articles/generate-ai", {
        topic: aiForm.topic.trim(),
        keywords: aiForm.keywords
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        language: aiForm.language.trim(),
        tone: aiForm.tone.trim(),
        length: Number(aiForm.length) || 1200,
      });
      const createdArticle = res.data?.data || res.data?.article || res.data;

      if (createdArticle?._id || createdArticle?.id) {
        setArticles((prev) => [createdArticle, ...prev]);
      }

      setGeneratedArticle(createdArticle || null);
      setAiForm(initialAiForm);
      await refreshStats();
      toast.success("AI article saved as draft");
      setActiveTab("articles");
    } catch (err) {
      const status = err.response?.status;
      const message =
        status === 404
          ? "AI article generation endpoint is not deployed on the server yet."
          : err.response?.data?.message || "Failed to generate AI article";
      setError(message);
      toast.error(message);
    } finally {
      setPendingAction("");
    }
  };

  return (
    <main className={s.page}>
      <section className={s.header}>
        <div>
          <p className={s.kicker}>Admin</p>
          <h1 className={s.title}>Site Dashboard</h1>
        </div>
        <button
          className={s.primaryButton}
          type="button"
          onClick={() => setIsAiFormOpen((prev) => !prev)}
        >
          {isAiFormOpen ? "Close AI form" : "Create article with AI"}
        </button>
      </section>

      {error && <p className={s.error}>{error}</p>}

      {isAiFormOpen && (
        <section className={s.aiPanel} aria-label="AI article generation">
          <div className={s.aiPanelHeader}>
            <div>
              <p className={s.kicker}>Draft generator</p>
              <h2 className={s.panelTitle}>Create Article With AI</h2>
            </div>
            <span className={s.draftBadge}>Always saved as draft</span>
          </div>

          <form className={s.aiForm} onSubmit={handleGenerateArticle}>
            <label className={s.field}>
              Article topic
              <input
                name="topic"
                value={aiForm.topic}
                onChange={handleAiFieldChange}
                placeholder="Numerology compatibility by birth date"
                required
              />
            </label>

            <label className={s.field}>
              Keywords
              <input
                name="keywords"
                value={aiForm.keywords}
                onChange={handleAiFieldChange}
                placeholder="numerology, compatibility, birth date"
              />
            </label>

            <label className={s.field}>
              Language
              <select
                name="language"
                value={aiForm.language}
                onChange={handleAiFieldChange}
              >
                <option>English</option>
                <option>Russian</option>
                <option>Ukrainian</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
            </label>

            <label className={s.field}>
              Tone
              <select
                name="tone"
                value={aiForm.tone}
                onChange={handleAiFieldChange}
              >
                <option>Expert, clear</option>
                <option>Warm and practical</option>
                <option>SEO editorial</option>
                <option>Academic</option>
                <option>Friendly</option>
              </select>
            </label>

            <label className={s.field}>
              Approximate length, words
              <input
                name="length"
                type="number"
                min="400"
                max="4000"
                step="100"
                value={aiForm.length}
                onChange={handleAiFieldChange}
              />
            </label>

            <button
              className={s.primaryButton}
              type="submit"
              disabled={pendingAction === "generate-ai-article"}
            >
              {pendingAction === "generate-ai-article"
                ? "Generating..."
                : "Generate draft"}
            </button>
          </form>

          {generatedArticle && (
            <div className={s.aiResult}>
              <h3>Draft Created</h3>
              <dl>
                <div>
                  <dt>SEO title</dt>
                  <dd>{generatedArticle.seoTitle || generatedArticle.title || "-"}</dd>
                </div>
                <div>
                  <dt>Meta description</dt>
                  <dd>{generatedArticle.metaDescription || generatedArticle.desc || "-"}</dd>
                </div>
                <div>
                  <dt>Slug</dt>
                  <dd>{generatedArticle.slug || "-"}</dd>
                </div>
                <div>
                  <dt>Status</dt>
                  <dd>{generatedArticle.status || "draft"}</dd>
                </div>
              </dl>
            </div>
          )}
        </section>
      )}

      <section className={s.statsGrid} aria-label="Site statistics">
        <div className={s.statItem}>
          <span className={s.statLabel}>Users</span>
          <strong className={s.statValue}>
            {isLoading ? "-" : stats?.usersCount ?? users.length}
          </strong>
        </div>
        <div className={s.statItem}>
          <span className={s.statLabel}>Articles</span>
          <strong className={s.statValue}>
            {isLoading ? "-" : stats?.articlesCount ?? articles.length}
          </strong>
        </div>
        <div className={s.statItem}>
          <span className={s.statLabel}>Saved Article Clicks</span>
          <strong className={s.statValue}>{isLoading ? "-" : totalSaved}</strong>
        </div>
      </section>

      <section className={s.panel}>
        <div className={s.tabs} role="tablist" aria-label="Admin tables">
          <button
            className={`${s.tab} ${activeTab === "users" ? s.activeTab : ""}`}
            type="button"
            onClick={() => setActiveTab("users")}
          >
            Users
          </button>
          <button
            className={`${s.tab} ${activeTab === "articles" ? s.activeTab : ""}`}
            type="button"
            onClick={() => setActiveTab("articles")}
          >
            Articles
          </button>
        </div>

        {isLoading ? (
          <p className={s.empty}>Loading...</p>
        ) : activeTab === "users" ? (
          <div className={s.tableWrap}>
            <table className={s.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Articles</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name || "-"}</td>
                    <td>{user.email || "-"}</td>
                    <td>{user.role || "user"}</td>
                    <td>
                      <span className={user.isBlocked ? s.badgeBlocked : s.badgeActive}>
                        {user.isBlocked ? "Blocked" : "Active"}
                      </span>
                    </td>
                    <td>{user.articlesAmount ?? 0}</td>
                    <td>{formatDate(user.createdAt)}</td>
                    <td>
                      <div className={s.actionGroup}>
                        <button
                          className={user.isBlocked ? s.actionButton : s.dangerButton}
                          type="button"
                          onClick={() => handleToggleBlockUser(user)}
                          disabled={user.role === "admin" || pendingAction === `user-${user._id}`}
                        >
                          {pendingAction === `user-${user._id}`
                            ? "Saving..."
                            : user.isBlocked
                              ? "Unblock"
                              : "Block"}
                        </button>
                        <button
                          className={s.dangerButton}
                          type="button"
                          onClick={() => handleDeleteUser(user)}
                          disabled={
                            user.role === "admin" ||
                            pendingAction === `delete-user-${user._id}`
                          }
                        >
                          {pendingAction === `delete-user-${user._id}`
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={s.tableWrap}>
            <table className={s.table}>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Status</th>
                  <th>Rate</th>
                  <th>Created</th>
                  <th>Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article) => (
                  <tr key={getArticleId(article)}>
                    <td>{article.title || "-"}</td>
                    <td>{article.author || article.name || "-"}</td>
                    <td>
                      <span
                        className={
                          article.status === "draft" ? s.badgeDraft : s.badgeActive
                        }
                      >
                        {article.status || "published"}
                      </span>
                    </td>
                    <td>{article.rate ?? 0}</td>
                    <td>{formatDate(article.createdAt || article.date)}</td>
                    <td>{formatDate(article.updatedAt)}</td>
                    <td>
                      <div className={s.actionGroup}>
                        <button
                          className={s.actionButton}
                          type="button"
                          onClick={() => openEditForm(article)}
                        >
                          Edit
                        </button>
                        {article.status === "draft" && (
                          <button
                            className={s.actionButton}
                            type="button"
                            onClick={() => handlePublishArticle(article)}
                            disabled={
                              pendingAction ===
                              `publish-article-${getArticleId(article)}`
                            }
                          >
                            {pendingAction ===
                            `publish-article-${getArticleId(article)}`
                              ? "Publishing..."
                              : "Publish"}
                          </button>
                        )}
                        <button
                          className={s.dangerButton}
                          type="button"
                          onClick={() => handleDeleteArticle(article)}
                          disabled={
                            pendingAction === `article-${getArticleId(article)}`
                          }
                        >
                          {pendingAction === `article-${getArticleId(article)}`
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {editingArticle && (
        <section className={s.editorPanel} aria-label="Edit article">
          <div className={s.aiPanelHeader}>
            <div>
              <p className={s.kicker}>Article editor</p>
              <h2 className={s.panelTitle}>{editingArticle.title || "Untitled"}</h2>
            </div>
            <div className={s.actionGroup}>
              {editingArticle.status === "draft" && (
                <button
                  className={s.primaryButton}
                  type="button"
                  onClick={() => handlePublishArticle(editingArticle)}
                  disabled={
                    pendingAction ===
                    `publish-article-${getArticleId(editingArticle)}`
                  }
                >
                  {pendingAction ===
                  `publish-article-${getArticleId(editingArticle)}`
                    ? "Publishing..."
                    : "Publish"}
                </button>
              )}
              <button className={s.actionButton} type="button" onClick={closeEditForm}>
                Close
              </button>
            </div>
          </div>

          <form className={s.editorForm} onSubmit={handleSaveArticle}>
            <label className={s.field}>
              Title
              <input
                name="title"
                value={editForm.title}
                onChange={handleEditFieldChange}
                required
              />
            </label>

            <label className={s.field}>
              SEO title
              <input
                name="seoTitle"
                value={editForm.seoTitle}
                onChange={handleEditFieldChange}
              />
            </label>

            <label className={s.field}>
              Meta description
              <textarea
                name="metaDescription"
                value={editForm.metaDescription}
                onChange={handleEditFieldChange}
                rows="3"
              />
            </label>

            <label className={s.field}>
              Slug
              <input
                name="slug"
                value={editForm.slug}
                onChange={handleEditFieldChange}
              />
            </label>

            <label className={s.field}>
              Card description
              <textarea
                name="desc"
                value={editForm.desc}
                onChange={handleEditFieldChange}
                rows="3"
              />
            </label>

            <label className={s.field}>
              Upload image
              <input
                name="image"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleEditFieldChange}
              />
            </label>

            <label className={`${s.field} ${s.fullField}`}>
              Article text
              <textarea
                name="article"
                value={editForm.article}
                onChange={handleEditFieldChange}
                rows="14"
                required
              />
            </label>

            <div className={s.editorActions}>
              <button
                className={s.primaryButton}
                type="submit"
                disabled={
                  pendingAction ===
                  `save-article-${getArticleId(editingArticle)}`
                }
              >
                {pendingAction === `save-article-${getArticleId(editingArticle)}`
                  ? "Saving..."
                  : "Save changes"}
              </button>
            </div>
          </form>
        </section>
      )}
    </main>
  );
}
