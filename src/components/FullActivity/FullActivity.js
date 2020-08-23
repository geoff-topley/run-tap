import React from "react";
import axios from "axios/index";
import ActivityModal from "./Modal/Modal";
import Map from "./Map/Map";
import Loader from "../Loader/Loader";
import Header from "./Header/Header";
import { handleError } from "../../errorHandling/ErrorHandling";
import {
  getWorkoutTypeText,
  getWorkoutTypeCode,
} from "../../helpers/getWorkOutType";

export class FullActivity extends React.Component {
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
    const access_token = localStorage.getItem("access_token");
    const config = {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    };

    const url = "https://www.strava.com/api/v3/athlete";
    axios.get(url, config).then((response) => {
      this.setState({ shoes: response.data.shoes });
    });
  };

  retrieveActivityData = (id) => {
    const access_token = localStorage.getItem("access_token");
    const config = {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    };
    const url = `https://www.strava.com/api/v3/activities/${id}`;
    axios
      .get(url, config)
      .then((response) => {
        this.setState({
          isLoading: false,
          activity: response.data,
          activityName: response.data.name,
          workout_type: response.data.workout_type,
          shoeName: response.data.gear.name,
          lat: response.data.start_latitude,
          lng: response.data.start_longitude,
          polyline: response.data.map.polyline,
        });
      })
      .catch(() => {
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
    const { name } = this.state.activity;
    this.setState({ showModal: false, activityName: name });
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
    const { id } = this.state;
    let url = `https://www.strava.com/api/v3/activities/${id}`;
    const access_token = localStorage.getItem("access_token");

    axios({
      method: "put",
      url: url,
      data: {
        name: this.state.activityName,
        workout_type: this.state.workout_type,
        gear_id: this.state.shoeId,
      },
      headers: { Authorization: `Bearer ${access_token}` },
    })
      .then((response) => {
        this.setState({ showModal: false, activity: response.data });
      })
      .catch(() => {
        handleError(
          "Error updating Activity details. Please check console",
          "toast-top-center",
          "3000",
          "error"
        );
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
            <Header name={name} onClickOpenModal={this.onClickOpenModal} />

            <Map
              lat={this.state.lat}
              lng={this.state.lng}
              polyline={this.state.polyline}
            />

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
