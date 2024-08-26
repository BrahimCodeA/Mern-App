import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import ProfileLinks from "../ProfileLinks/ProfileLinks";
import "./ProfileCours.css";
import { RiDeleteBin5Line } from "react-icons/ri";
import { Link } from "react-router-dom";

export default function ProfileCours() {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  console.log(userPosts);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`);
        const data = await res.json();
        if (res.ok) {
          setUserPosts(data.posts);
        }
      } catch (error) {
        console.error(error.message);
      }
    };
    if (currentUser._id) {
      fetchPosts();
    }
  }, [currentUser._id]);

  const handleDeletePost = async (postId) => {
    try {
      const res = await fetch(`api/post/deleteuserpost/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
          "Content-type": "application/json",
        },
      });
      const data = await res.json();
      if (res.ok) {
        setUserPosts(userPosts.filter((post) => post._id !== postId));
      }
      console.log(data);
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="profile-cours-container">
      <ProfileLinks />
      <div className="profile-cours">
        <div className="profile-cours-list">
          {userPosts.length > 0 ? (
            userPosts.map((post) => (
              <div key={post._id} className="profile-cours-item">
                <ul className="profile-cours-ul">
                  <li className="profile-cours-li">
                    <Link to={`/post/${post.slug}`}>
                      <img
                        src={post.image}
                        alt={post.title}
                        className="profile-cours-img"
                      />
                    </Link>
                  </li>
                  <li className="profile-cours-li">
                    <h2 className="profile-cours-title">{post.title}</h2>
                  </li>
                  <li className="profile-cours-li">
                    <span className="profile-cours-date">
                      {new Date(post.updatedAt).toLocaleDateString()}
                    </span>
                  </li>
                  <li className="profile-cours-li">
                    <RiDeleteBin5Line
                      className="profile-cours-icon"
                      onClick={() => handleDeletePost(post._id)}
                    />
                  </li>
                </ul>
              </div>
            ))
          ) : (
            <div className="profile-cours-empty">Aucun cours trouvé</div>
          )}
        </div>
      </div>
    </div>
  );
}
