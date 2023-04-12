import React from "react";
import { useNavigate } from "react-router-dom";
import ListingPreviewList from "./ListingPreviewList";
import { useAuth0 } from "@auth0/auth0-react";

const Home = () => {
  const navigate = useNavigate();
  const { loginWithRedirect, logout, isAuthenticated, isLoading, user } =
    useAuth0();

  const renderUserInfo = () => {
    if (isLoading) {
      return <div>Loading ...</div>;
    } else if (isAuthenticated) {
      return (
        <div>
          <div>Welcome, {user.nickname}!</div>
          <button
            onClick={() =>
              logout({ logoutParams: { returnTo: window.location.origin } })
            }
          >
            Log Out
          </button>
        </div>
      );
    } else {
      return (
        <div>
          <div>Please log in to buy or sell</div>
          <button onClick={() => loginWithRedirect()}>Log In</button>
        </div>
      );
    }
  };

  const handleClick = () => {
    if (isAuthenticated) {
      navigate("/listings/new");
    } else {
      loginWithRedirect();
    }
  };

  return (
    <div>
      {renderUserInfo()}
      <button onClick={handleClick}>Sell</button>
      {/* <Link to="/listings/new">Sell</Link> */}
      <br />
      <br />
      <ListingPreviewList />
    </div>
  );
};

export default Home;
