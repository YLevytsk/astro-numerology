import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { axiosAPI } from "../../redux/auth/operations";
import s from "./AdminPage.module.css";

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
    const confirmed = window.confirm(
      `Delete article "${article.title || "Untitled"}"? This cannot be undone.`
    );

    if (!confirmed) return;

    const actionKey = `article-${article._id}`;
    setPendingAction(actionKey);
    setError("");

    try {
      await axiosAPI.delete(`/admin/articles/${article._id}`);
      setArticles((prev) => prev.filter((item) => item._id !== article._id));
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

  return (
    <main className={s.page}>
      <section className={s.header}>
        <div>
          <p className={s.kicker}>Admin</p>
          <h1 className={s.title}>Site Dashboard</h1>
        </div>
      </section>

      {error && <p className={s.error}>{error}</p>}

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
                  <th>Rate</th>
                  <th>Created</th>
                  <th>Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article) => (
                  <tr key={article._id}>
                    <td>{article.title || "-"}</td>
                    <td>{article.author || article.name || "-"}</td>
                    <td>{article.rate ?? 0}</td>
                    <td>{formatDate(article.createdAt || article.date)}</td>
                    <td>{formatDate(article.updatedAt)}</td>
                    <td>
                      <button
                        className={s.dangerButton}
                        type="button"
                        onClick={() => handleDeleteArticle(article)}
                        disabled={pendingAction === `article-${article._id}`}
                      >
                        {pendingAction === `article-${article._id}` ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
