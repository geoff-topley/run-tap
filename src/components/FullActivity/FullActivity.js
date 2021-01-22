import React from "react";
import Row from "react-bootstrap/Row";
import ActivityModal from "./Modal/Modal";
import Stats from "./Stats/Stats";
import Map from "./Map/Map";
import Laps from "./Laps/Laps";
import Loader from "../Loader/Loader";
import Header from "./Header/Header";
import { handleError } from "../../errorHandling/ErrorHandling";
import {
  getWorkoutTypeText,
  getWorkoutTypeCode,
} from "../../helpers/getWorkOutType";

export class FullActivity extends React.Component {
  constructor(props) {
    super(props);
    this.stravaInstance = this.props.auth.setStravaInstance();
  }

  state = {
    isLoading: true,
    shoes: [],
    shoeId: "",
    shoeName: "",
    activity: {},
    lat: 0,
    lng: 0,
    polyline: "",
    showModal: false,
    activityName: "",
    workout_type: null,
    id: "",
  };

  componentDidMount() {
    // activity ID passed from Link and used to retrieve all Activity data
    this.setState({ id: this.props.match.params.id });
    this.retrieveActivityData(this.props.match.params.id);
    this.retrieveGear();
  }

  retrieveGear = () => {
    const url = "/athlete";

    this.stravaInstance.get(url).then((response) => {
      this.setState({ shoes: response.data.shoes });
    });
  };

  retrieveActivityData = (id) => {
    const url = `/activities/${id}`;

    this.stravaInstance
      .get(url)
      .then((response) => {
        this.setState({
          isLoading: false,
          activity: response.data,
          activityName: response.data.name,
          workout_type: response.data.workout_type,
          shoeName: response.data.gear && response.data.gear.name,
          lat: response.data.start_latitude,
          lng: response.data.start_longitude,
          polyline: response.data.map.polyline,
          mileSplits: response.data.splits_standard,
        });
      })
      .catch((error) => {
        console.log(error);
        handleError(
          "Error loading Activity Data. Please check console.",
          "toast-top-center",
          "3000",
          "error"
        );
      });
  };

  onClickOpenModal = () => {
    this.setState({ showModal: true });
  };

  onClickCancelModal = () => {
    const { activity } = this.state;
    this.setState({
      activityName: activity.name,
      shoeName: activity.gear.name,
      workout_type: activity.workout_type,
      showModal: false,
    });
  };

  onChangeActivityName = (event) => {
    let activityName = event.target.value;
    this.setState({ activityName });
  };

  onChangeWorkoutType = (event) => {
    let workout_type = getWorkoutTypeCode(event.target.value);
    this.setState({ workout_type });
  };

  updateActivity = () => {
    this.setState({ isLoading: true });

    const { id, activity } = this.state;
    const url = `/activities/${id}`;

    const data = {
      name: this.state.activityName,
      workout_type: this.state.workout_type,
      gear_id: this.state.shoeId,
    };

    this.stravaInstance
      .put(url, data)
      .then((response) => {
        this.setState({
          showModal: false,
          activity: response.data,
          isLoading: false,
        });
      })
      .catch((error) => {
        console.log(error);
        handleError(
          "Unable to update activity. Ensure you authorized this operation by checking 'Upload your activities from Run-Tap to Strava' during login.",
          "toast-top-center",
          "5000",
          "error"
        );
        this.setState({
          isLoading: false,
          activityName: activity.name,
          shoeName: activity.gear.name,
          workout_type: activity.workout_type,
          showModal: false,
        });
      });
  };

  onChangeShoeList = (event) => {
    const index = event.target.selectedIndex;
    const optionElement = event.target.childNodes[index];
    const shoeId = optionElement.getAttribute("id");

    this.setState({ shoeName: event.target.value, shoeId });
  };

  render() {
    let { showModal } = this.state;
    const { name } = this.state.activity;
    let activityName = this.state.activityName;
    let workout_type = getWorkoutTypeText(this.state.workout_type);
    let shoeOptions = this.state.shoes.map((shoe) => {
      return (
        <option key={shoe.id} id={shoe.id}>
          {shoe.name}
        </option>
      );
    });

    return (
      <div>
        {this.state.isLoading ? (
          <Loader />
        ) : (
          <>
            <Header
              name={name}
              shoeName={this.state.shoeName}
              workout_type={workout_type}
              onClickOpenModal={this.onClickOpenModal}
            />

            <Row style={{ marginTop: "16px" }}>
              <Map
                lat={this.state.lat}
                lng={this.state.lng}
                polylineData={this.state.polyline}
              />
              <Laps mileSplits={this.state.mileSplits} />
              <Stats activity={this.state.activity} />
            </Row>

            <ActivityModal
              showModal={showModal}
              activityName={activityName}
              workout_type={workout_type}
              onClickCancelModal={this.onClickCancelModal}
              onChangeActivityName={this.onChangeActivityName}
              onChangeWorkoutType={this.onChangeWorkoutType}
              updateActivity={this.updateActivity}
              shoeOptions={shoeOptions}
              onChangeShoeList={this.onChangeShoeList}
              shoeName={this.state.shoeName}
            />
          </>
        )}
      </div>
    );
  }
}

export default FullActivity;
