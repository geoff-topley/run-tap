import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const ActivityModal = ({
  showModal,
  activityName,
  workout_type,
  onClickCancelModal,
  onChangeActivityName,
  onChangeWorkoutType,
  saveNewActivityName,
}) => {
  return (
    <Modal show={showModal} animation={false}>
      <Modal.Header>
        <Modal.Title>Edit Activity</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Control
              type="text"
              onChange={onChangeActivityName}
              value={activityName}
            ></Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Control
              as="select"
              value={workout_type}
              onChange={onChangeWorkoutType}
            >
              <option>TBD</option>
              <option>Base Building</option>
              <option>Workout</option>
              <option>Long Run</option>
              <option>Race</option>
            </Form.Control>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClickCancelModal}>
          Cancel
        </Button>
        <Button variant="primary" onClick={saveNewActivityName}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ActivityModal;
