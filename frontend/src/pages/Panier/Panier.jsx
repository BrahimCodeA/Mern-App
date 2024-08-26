import "./Panier.css";
import { useEffect, useState } from "react";
import { HiAcademicCap } from "react-icons/hi2";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";

export default function Panier() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPanier = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("/api/post/panier", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération du panier");
        }
        const data = await response.json();
        console.log(data);
        setPosts(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPanier();
  }, []);

  const handleDeleteAll = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("api/post/deletepanier", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) {
        setLoading(false);
        console.log("Erreur lors de la suppression du panier");
        return;
      }
      const data = await response.json();
      console.log(data);
      setPosts([]);
      setLoading(false);
      setError(null);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`api/post/deletepostpanier/${postId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        setLoading(false);
        console.log("Erreur lors de la suppression du post");
        return;
      }

      const data = await response.json();
      console.log(data);

      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
    } catch (error) {
      console.log(error);
      setError("Erreur lors de la suppression du post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bibliotheque-container">
      <h1 className="bibliotheque-title">
        Ma Bibliothèque <HiAcademicCap />
      </h1>
      <span className="bibliotheque-delete" onClick={handleDeleteAll}>
        Tout supprimer <MdDelete className="icon-delete" />
      </span>
      {loading && <div className="loading">Chargement...</div>}
      <div className="bibliotheque-posts">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post._id} className="bibliotheque-post">
              <Link to={`/post/${post.slug}`} className="bibliotheque-link">
                <img
                  className="bibliotheque-image"
                  src={post.image}
                  alt={post.title}
                />
                <div className="overlay">
                  <button className="play-button">▶</button>
                </div>
              </Link>
              <div className="bibliotheque-content">
                <h2 className="bibliotheque-post-title">{post.title}</h2>
                <p className="bibliotheque-date">
                  {new Date(post.updatedAt).toLocaleDateString()}
                </p>
                <p className="bibliotheque-category">{post.category}</p>
                <span
                  className="icon-dele"
                  onClick={() => handleDeletePost(post._id)}
                >
                  <MdDelete />
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="empty">Votre bibliothèque est vide</div>
        )}
      </div>
    </div>
  );
}
