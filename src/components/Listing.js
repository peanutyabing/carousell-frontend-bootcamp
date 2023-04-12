import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { BACKEND_URL } from "../constants.js";
import { useAuth0 } from "@auth0/auth0-react";

const Listing = () => {
  const [listingId, setListingId] = useState();
  const [listing, setListing] = useState({});
  const [accessToken, setAccessToken] = useState("");
  const { isAuthenticated, user, loginWithRedirect, getAccessTokenSilently } =
    useAuth0();

  useEffect(() => {
    // If there is a listingId, retrieve the listing data
    if (listingId) {
      axios.get(`${BACKEND_URL}/listings/${listingId}`).then((response) => {
        setListing(response.data);
      });
    }
    // Only run this effect on change to listingId
  }, [listingId]);

  const checkUser = async () => {
    if (isAuthenticated) {
      let token = await getAccessTokenSilently();
      console.log(token);
      setAccessToken(token);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  // Update listing ID in state if needed to trigger data retrieval
  const params = useParams();
  if (listingId !== params.listingId) {
    setListingId(params.listingId);
  }

  // Store a new JSX element for each property in listing details
  const listingDetails = [];
  if (listing) {
    for (const key in listing) {
      listingDetails.push(
        <Card.Text key={key}>{`${key}: ${listing[key]}`}</Card.Text>
      );
    }
  }

  const handleClick = async () => {
    if (isAuthenticated) {
      axios
        .put(
          `${BACKEND_URL}/listings/${listingId}`,
          { buyerEmail: user.email },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        )
        .then((response) => {
          setListing(response.data);
        });
    } else {
      await loginWithRedirect({
        authorizationParams: {
          redirect_uri: `http://localhost:3001/listings/${listingId}`,
        },
      });
    }
  };

  return (
    <div>
      <Link to="/">Home</Link>
      <Card bg="dark">
        <Card.Body>
          {listingDetails}
          <Button
            onClick={handleClick}
            // disabled={listing.BuyerId}
          >
            Buy
          </Button>
        </Card.Body>
      </Card>
      <br />
    </div>
  );
};

export default Listing;
