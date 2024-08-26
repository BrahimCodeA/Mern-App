import "./Posts.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

export default function Posts({ category, searchTerm }) {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/post/getposts?category=${category}`);
        const data = await res.json();
        if (res.ok) {
          const validPosts = data.posts.filter((post) => post.userId !== null);
          setUserPosts(validPosts);
          setFilteredPosts(validPosts);
          setShowMore(validPosts.length >= 8);
        }
      } catch (error) {
        console.log("Erreur lors du chargement des posts :", error.message);
      }
    };

    fetchPosts();
  }, [category]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = userPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPosts(filtered);
    } else {
      setFilteredPosts(userPosts);
    }
  }, [searchTerm, userPosts]);

  const handleShowMore = async () => {
    const startIndex = userPosts.length;
    try {
      const res = await fetch(
        `/api/post/getposts?category=${category}&startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setUserPosts((prev) => [...prev, ...data.posts]);
        setFilteredPosts((prev) => [...prev, ...data.posts]);
        setShowMore(data.posts.length >= 8);
      }
    } catch (error) {
      console.log("Erreur lors du chargement des posts :", error.message);
    }
  };

  return (
    <>
      {filteredPosts.length === 0 ? (
        <p className="no-posts-message">
          Il n'y a aucun cours pour l'instant dans cette catégorie
        </p>
      ) : (
        <>
          <div className="posts">
            {filteredPosts.map((post) => (
              <div key={post._id} className="post">
                <div className="card-posts">
                  <div className="card-top">
                    <p className="card-title">{post.title}</p>
                    <p className="card-date">
                      {new Date(post.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <img src={post.image} alt={post.title} className="card-img" />
                  {post.userId &&
                  currentUser &&
                  currentUser._id === post.userId._id ? (
                    <p className="card-username">
                      Créé par - <span className="card-username-name">Moi</span>
                    </p>
                  ) : (
                    <p className="card-username">
                      Créé par -{" "}
                      <span className="card-username-name">
                        {post.userId?.username || "Utilisateur inconnu"}
                      </span>
                    </p>
                  )}

                  <div className="post__info">
                    <p className="card-category">{post.category}</p>
                    <Link to={`/post/${post.slug}`} className="card-link">
                      <button className="card-btn">Voir le cours</button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {showMore && (
            <div className="show-more">
              <button onClick={handleShowMore} className="show-more-btn">
                Voir plus
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}

Posts.propTypes = {
  category: PropTypes.string.isRequired,
  searchTerm: PropTypes.string.isRequired,
};
