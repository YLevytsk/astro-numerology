import { useEffect, useMemo, useState } from "react";
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
                  <th>Articles</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name || "-"}</td>
                    <td>{user.email || "-"}</td>
                    <td>{user.role || "user"}</td>
                    <td>{user.articlesAmount ?? 0}</td>
                    <td>{formatDate(user.createdAt)}</td>
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
