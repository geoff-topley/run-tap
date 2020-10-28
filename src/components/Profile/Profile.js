import React, { useState, useEffect } from "react";
import Loader from "../Loader/Loader";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";

const Profile = ({ auth }) => {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [profileData, setProfileData] = useState({});

  // runs after every render and async
  // run effect and clean it up only once (on mount and unmount), pass an empty array ([]) as a second argument
  useEffect(() => {
    const profileData = JSON.parse(localStorage.getItem("profile"));
    setProfileData(profileData);
    setIsPageLoading(false);
  }, []);

  const firstName = profileData.firstname;
  const lastName = profileData.lastname;

  if (!profileData || !auth.isAuthenticated()) return null;

  return (
    <div>
      {isPageLoading ? (
        <Loader />
      ) : (
        <div>
          <Row style={{ marginTop: "16px" }}>
            <Col>
              <Image
                src={profileData.profile}
                style={{ maxWidth: 200, maxHeight: 200 }}
              />
            </Col>
          </Row>
          <Row>
            <Col>{`${firstName} ${lastName}`}</Col>
          </Row>
        </div>
      )}
    </div>
  );
};

export default Profile;
