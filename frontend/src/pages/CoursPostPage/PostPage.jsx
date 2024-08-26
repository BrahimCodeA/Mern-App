import "./PostPage.css";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { HiBookmark } from "react-icons/hi2";
import { useSelector } from "react-redux";

export default function PostPage() {
  const { postSlug } = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [post, setPost] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchposts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/post/getposts?slug=${postSlug}`);
        if (!response.ok) {
          setError("Erreur lors de la récupération du post");
          return;
        }
        const data = await response.json();
        setPost(data.posts[0]);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchposts();
  }, [postSlug]);

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  if (!post) {
    return <div className="not-found">Post introuvable</div>;
  }

  const handleAddToPanier = async () => {
    if (!currentUser) {
      return navigate("/sign-in");
    }
    try {
      const response = await fetch(`/api/post/addtopanier/${post._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`,
        },
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message);
      }
      navigate("/panier");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="post-page">
      <div className="post-container">
        <h1 className="post-title">{post.title}</h1>
        <p className="post-date">
          {new Date(post.updatedAt).toLocaleDateString()}
        </p>
      </div>
      <span className="post-username">{post.userId.username}</span>
      <img className="post-image" src={post.image} alt={post.title} />
      <div className="post-btn">
        <p className="post-category">{post.category}</p>
        <button className="post-favorites" onClick={handleAddToPanier}>
          Ajouter à la bibliothèque <HiBookmark style={{ marginLeft: "5px" }} />
        </button>
      </div>
      <hr />
      <p className="post-description">{post.description}</p>
      {error && <p className="post-error">{error}</p>}
    </div>
  );
}
