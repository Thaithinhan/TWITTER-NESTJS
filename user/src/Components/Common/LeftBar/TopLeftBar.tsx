import "./TopLeftBar.css";

import React, { useEffect, useState } from "react";
import { LuVerified } from "react-icons/lu";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";

import BookmarksOutlinedIcon from "@mui/icons-material/BookmarksOutlined";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import HomeIcon from "@mui/icons-material/Home";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import PermIdentityOutlinedIcon from "@mui/icons-material/PermIdentityOutlined";

import { useTweets } from "../../../Context/TweetContext";
import { fetchTweetsByUserId } from "../../../Utils/TweetFunction";

const TopLeftBar = () => {
  const userLogin = JSON.parse(localStorage.getItem("userLogin"));
  const { resetTweets, setTweets } = useTweets();
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const socket = io("http://localhost:8000");

    socket.on("connect", () => {
      console.log("Connected to server", socket.id);
    });

    // Thay đổi địa chỉ máy chủ của bạn
    socket.on("notification", (data) => {
      console.log("data socket", data.data.senderId);
      console.log("curent", userLogin?._id);

      if (userLogin?._id !== data.data.senderId) {
        setNotificationCount((prevCount) => prevCount + 1);
      }
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server", socket.id);
    });

    return () => {
      socket.disconnect();
    };
  }, []);
  return (
    <div className="top-sidebar">
      <div className="logo-image">
        <Link to={"/home"}>
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="logo-img r-1cvl2hr r-4qtqp9 r-yyyyoo r-16y2uox
             r-8kz0gk r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-lrsllp fill-blue-500 w-16"
          >
            <g>
              <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"></path>
            </g>
          </svg>
        </Link>
      </div>
      <ul className="list-menu-sidebar">
        <li className="menu-item-sidebar active">
          <Link to={"/home"} className="menu ">
            <HomeIcon className="icon-menu" />{" "}
            <span className="menu-title">Home</span>
          </Link>
        </li>
        <li className="menu-item-sidebar">
          <Link
            to={"/notifications"}
            className="menu"
            // onClick={handleNotificationClick}
          >
            <NotificationsNoneOutlinedIcon className="icon-menu" />
            <span className="menu-title">Notifications</span>
            <span className="notification-badge">{notificationCount}</span>
          </Link>
        </li>
        <li className="menu-item-sidebar">
          <Link to={"/messages"} className="menu ">
            <ForumOutlinedIcon className="icon-menu" />
            <span className="menu-title"> Messages</span>
          </Link>
        </li>
        <li className="menu-item-sidebar">
          <Link to={"/bookmarks"} className="menu ">
            <BookmarksOutlinedIcon className="icon-menu" />
            <span className="menu-title"> Bookmarks</span>
          </Link>
        </li>
        <li className="menu-item-sidebar">
          <Link to={`/verify`} className="menu ">
            <LuVerified className="icon-menu" />{" "}
            <span className="menu-title">Verify</span>
          </Link>
        </li>
        <li className="menu-item-sidebar">
          <Link
            to={`/profile/${userLogin?._id}`}
            className="menu "
            onClick={async () => {
              resetTweets();
              const newTweets = await fetchTweetsByUserId(
                userLogin?._id as string
              );
              setTweets(newTweets);
            }}
          >
            <PermIdentityOutlinedIcon className="icon-menu" />{" "}
            <span className="menu-title">My Profile</span>
          </Link>
        </li>
        <li>
          <button className="btn-tweet rounded-full">Tweet</button>
        </li>
      </ul>
    </div>
  );
};

export default TopLeftBar;
