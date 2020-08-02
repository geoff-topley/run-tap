import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
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
          <Container>
            <Row>
              <Col md={{ offset: 5 }}>
                <Spinner size="lg" animation="border" />
              </Col>
            </Row>
          </Container>
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
