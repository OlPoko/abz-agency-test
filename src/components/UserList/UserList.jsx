import { useEffect, useState } from "react";
import styles from "./UserList.module.scss";
import { fetchUsers } from "../../services/api";

export default function UserList({ refresh }) {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setUsers([]);
    setPage(1);
    setTotalPages(1);
    loadUsers(1);
  }, [refresh]);

  const loadUsers = async (pageToLoad) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchUsers(pageToLoad, 6);
      if (pageToLoad === 1) {
        setUsers(data.users);
      } else {
        setUsers((prev) => [...data.users, ...prev]);
      }
      setPage(data.page);
      setTotalPages(data.total_pages);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  const handleShowMore = () => {
    if (page < totalPages) {
      loadUsers(page + 1);
    }
  };

  return (
    <section id="users" className={styles.userList}>
      <div className={`container ${styles.container}`}>
        <h2 className={styles.title}>Working with GET request</h2>

        {error && <p className={styles.errorMsg}>{error}</p>}

        {users.length === 0 && !loading && <p>No users found.</p>}

        <ul className={styles.list}>
          {users.map((user) => (
            <li key={user.id} className={styles.userCard}>
              <img
                src={user.photo}
                alt={`${user.name}`}
                className={styles.photo}
              />
              <h3 className={styles.name}>{user.name}</h3>
              <p className={styles.position}>{user.position}</p>
              <p className={styles.email}>{user.email}</p>
              <p className={styles.phone}>{user.phone}</p>
            </li>
          ))}
        </ul>

        {page < totalPages && (
          <button
            className={styles.showMoreBtn}
            onClick={handleShowMore}
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? "Loading..." : "Show more"}
          </button>
        )}
      </div>
    </section>
  );
}
