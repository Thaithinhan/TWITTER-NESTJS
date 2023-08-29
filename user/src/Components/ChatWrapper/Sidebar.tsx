// Sidebar.tsx
import React from "react";

import Header from "./Header";
import SearchBar from "./SearchBar";
import UserList from "./UserList";

const Sidebar = () => (
  <div className="sidebar">
    <Header />
    <SearchBar />
    <UserList />
  </div>
);

export default Sidebar;
