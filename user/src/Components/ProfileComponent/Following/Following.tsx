import "./Following.css";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { useFollowing } from "../../../Context/FollowingContext";
import { useUser } from "../../../Context/UserContext";
import { IUser } from "../../../Types/type";

const Following = () => {
  const { user: currentUser } = useUser();
  const { id } = useParams();
  const { followings, setFollowings } = useFollowing();
  const [currentUserFollowings, setCurrentUserFollowings] = useState<IUser[]>(
    []
  );

  useEffect(() => {
    if (id === currentUser?._id) {
      // Fetch lại nếu là người dùng hiện tại
      axios
        .get(
          `http://localhost:8000/api/v1/follow/following/${currentUser?._id}`
        )
        .then((response) => {
          // console.log(response.data);
          setFollowings(response.data);
        });
    }
    // Nếu không phải người dùng hiện tại thì không làm gì cả
  }, [id, currentUser?._id, setFollowings]);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/v1/follow/following/${id}`)
      .then((response) => {
        setFollowings(response.data);
      });
  }, [id]);

  useEffect(() => {
    if (currentUser) {
      axios
        .get(`http://localhost:8000/api/v1/follow/following/${currentUser._id}`)
        .then((response) => {
          setCurrentUserFollowings(response.data);
        });
    }
  }, [currentUser]);

  const isCurrentUserFollowing = (targetUserId: string) => {
    if (id === currentUser?._id) return true; // Nếu đang xem trang của chính mình thì đã theo dõi
    return currentUserFollowings.some(
      (followedUser) => followedUser._id === targetUserId
    );
  };

  return (
    <div className="following-wrapper">
      {followings.map((user) => {
        return (
          <div className="following-component" key={user?._id}>
            <Link
              to={`/profile/${user?._id}`}
              className="following-user nav-link"
            >
              <div className="user-img">
                <img src={user?.avatar} alt="avatar" />
              </div>
              <div>
                <h5 className="font-bold">{user?.fullname}</h5>
                <p className="text-secondary m-0">@{user?.username}</p>
              </div>
            </Link>
            <button className="w-28 btn-unfollowing">
              {id === currentUser?._id
                ? "Unfollow"
                : isCurrentUserFollowing(user._id)
                ? "Unfollow"
                : "Follow"}
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Following;
