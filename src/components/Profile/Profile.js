import React from "react";
import Loader from "../Loader/Loader";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";

class Profile extends React.Component {
  state = {
    isPageLoading: true,
    profileData: {},
  };

  componentDidMount() {
    this.getProfileInfo();
  }

  getProfileInfo() {
    const profileData = JSON.parse(localStorage.getItem("profile"));
    this.setState({
      profileData,
      isPageLoading: false,
    });
  }

  render() {
    const { profileData, isPageLoading } = this.state;
    const firstName = profileData.firstname;
    const lastName = profileData.lastname;

    if (!profileData || !this.props.auth.isAuthenticated()) return null;

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
  }
}

export default Profile;
