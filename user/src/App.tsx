import "./App.css";

import { BrowserRouter } from "react-router-dom";

import { FollowersProvider } from "./Context/FollowersContext";
import { FollowingProvider } from "./Context/FollowingContext";
import { TweetProvider } from "./Context/TweetContext";
import { UserProvider } from "./Context/UserContext";
import Router from "./Routes/Route";

function App() {
  return (
    <>
      <UserProvider>
        <FollowingProvider>
          <FollowersProvider>
            <TweetProvider>
              <BrowserRouter>
                <Router />
              </BrowserRouter>
            </TweetProvider>
          </FollowersProvider>
        </FollowingProvider>
      </UserProvider>
    </>
  );
}

export default App;
