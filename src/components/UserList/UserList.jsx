import { useEffect, useState } from "react";
import styles from "./UserList.module.scss";
import { fetchUsers } from "../../services/api";

export default function UserList({ refresh }) {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUsers(1);
  }, [refresh]);

  const loadUsers = async (pageToLoad) => {
    setLoading(true);
    try {
      const data = await fetchUsers(pageToLoad, 6);
      if (pageToLoad === 1) {
        setUsers(data.users);
      } else {
        setUsers((prev) => [...prev, ...data.users]);
      }
      setPage(data.page);
      setTotalPages(data.total_pages);
    } catch (error) {
      console.error("Error fetching users:", error);
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
      <h2 className={styles.title}>Working with GET request</h2>
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
        >
          {loading ? "Loading..." : "Show more"}
        </button>
      )}
    </section>
  );
}
